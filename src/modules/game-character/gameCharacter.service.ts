import { Transaction } from 'sequelize';

import { sequelize } from '../../database';
import { AppError } from '../../shared/errors/AppError';
import { Character } from '../character/character.model';
import { characterService } from '../character/character.service';
import { Game } from '../game/game.model';

import { GameCharacter, GameCharacterAttributes } from './gameCharacter.model';
import { GameCharacterJoinInput, GameCharacterResponse, GameCharacterStateUpdateInput } from './gameCharacter.types';

const membershipInclude = [
  {
    model: Game,
    as: 'game',
    attributes: ['id', 'name', 'ownerUserId']
  },
  {
    model: Character,
    as: 'character',
    attributes: ['id', 'name', 'userId']
  }
];

class GameCharacterService {
  async requestJoin(userId: string, payload: GameCharacterJoinInput): Promise<GameCharacterResponse> {
    return sequelize.transaction(async (transaction) => {
      const { character, game } = await this.resolveEntities(userId, payload, transaction);

      const existing = await GameCharacter.findOne({
        where: { gameId: payload.gameId, characterId: payload.characterId },
        transaction,
        lock: Transaction.LOCK.UPDATE
      });

      if (existing) {
        if (existing.userId !== userId) {
          throw new AppError({
            code: 'MEMBERSHIP.CONFLICT',
            message: 'Character already linked to a different player for this game'
          });
        }

        if (existing.status === 'approved') {
          throw new AppError({
            code: 'MEMBERSHIP.CONFLICT',
            message: 'Character already approved for this game'
          });
        }

        if (existing.status === 'pending') {
          throw new AppError({
            code: 'MEMBERSHIP.CONFLICT',
            message: 'Join request already pending approval'
          });
        }

        existing.status = 'pending';
        existing.hpCurrent = null;
        existing.conditions = [];
        existing.temporaryModifiers = {};
        existing.userId = userId;
        await existing.save({ transaction });

        return this.toResponse(await existing.reload({ include: membershipInclude, transaction }));
      }

      const created = await GameCharacter.create(
        {
          gameId: game.id,
          characterId: character.id,
          userId,
          status: 'pending',
          hpCurrent: null,
          conditions: [],
          temporaryModifiers: {}
        },
        { transaction }
      );

      return this.toResponse(await created.reload({ include: membershipInclude, transaction }));
    });
  }

  async listForUser(userId: string): Promise<GameCharacterResponse[]> {
    const memberships = await GameCharacter.findAll({
      where: { userId },
      include: membershipInclude,
      order: [['createdAt', 'DESC']]
    });

    return memberships.map((membership) => this.toResponse(membership));
  }

  async listForGame(ownerUserId: string, gameId: string): Promise<GameCharacterResponse[]> {
    await this.ensureGameOwnership(ownerUserId, gameId);

    const memberships = await GameCharacter.findAll({
      where: { gameId },
      include: membershipInclude,
      order: [['createdAt', 'ASC']]
    });

    return memberships.map((membership) => this.toResponse(membership));
  }

  async getById(id: string, requesterId: string): Promise<GameCharacterResponse> {
    const membership = await GameCharacter.findByPk(id, { include: membershipInclude });

    if (!membership) {
      throw new AppError({ code: 'MEMBERSHIP.NOT_FOUND' });
    }

    if (!this.canAccessMembership(membership, requesterId)) {
      throw new AppError({ code: 'MEMBERSHIP.NOT_FOUND' });
    }

    return this.toResponse(membership);
  }

  async approve(id: string, ownerUserId: string): Promise<GameCharacterResponse> {
    return sequelize.transaction(async (transaction) => {
      const membership = await GameCharacter.findByPk(id, {
        lock: Transaction.LOCK.UPDATE,
        transaction
      });

      if (!membership) {
        throw new AppError({ code: 'MEMBERSHIP.NOT_FOUND' });
      }

      await membership.reload({ include: membershipInclude, transaction });

      const game = membership.get('game') as Game | undefined;

      if (!game || game.ownerUserId !== ownerUserId) {
        throw new AppError({ code: 'MEMBERSHIP.NOT_FOUND' });
      }

      if (membership.status !== 'pending') {
        throw new AppError({
          code: 'MEMBERSHIP.INVALID_STATE',
          message: 'Only pending requests can be approved'
        });
      }

      const { computed } = await characterService.getByIdWithComputed(membership.characterId, ownerUserId);
      const hpFromRules = this.extractHp(computed);

      membership.status = 'approved';
      membership.hpCurrent = hpFromRules;
      membership.hpTotal = hpFromRules;
      membership.conditions = [];
      membership.temporaryModifiers = {};

      await membership.save({ transaction });

      return this.toResponse(await membership.reload({ include: membershipInclude, transaction }));
    });
  }

  async reject(id: string, ownerUserId: string): Promise<GameCharacterResponse> {
    return sequelize.transaction(async (transaction) => {
      const membership = await GameCharacter.findByPk(id, {
        lock: Transaction.LOCK.UPDATE,
        transaction
      });

      if (!membership) {
        throw new AppError({ code: 'MEMBERSHIP.NOT_FOUND' });
      }

      await membership.reload({ include: membershipInclude, transaction });

      const game = membership.get('game') as Game | undefined;

      if (!game || game.ownerUserId !== ownerUserId) {
        throw new AppError({ code: 'MEMBERSHIP.NOT_FOUND' });
      }

      if (membership.status !== 'pending') {
        throw new AppError({
          code: 'MEMBERSHIP.INVALID_STATE',
          message: 'Only pending requests can be rejected'
        });
      }

      membership.status = 'rejected';
      membership.hpCurrent = null;
      membership.hpTotal = null;
      membership.conditions = [];
      membership.temporaryModifiers = {};

      await membership.save({ transaction });

      return this.toResponse(await membership.reload({ include: membershipInclude, transaction }));
    });
  }

  async updateState(id: string, ownerUserId: string, payload: GameCharacterStateUpdateInput): Promise<GameCharacterResponse> {
    return sequelize.transaction(async (transaction) => {
      const membership = await GameCharacter.findByPk(id, {
        lock: Transaction.LOCK.UPDATE,
        transaction
      });

      if (!membership) {
        throw new AppError({ code: 'MEMBERSHIP.NOT_FOUND' });
      }

      await membership.reload({ include: membershipInclude, transaction });

      const game = membership.get('game') as Game | undefined;

      if (!game || game.ownerUserId !== ownerUserId) {
        throw new AppError({ code: 'MEMBERSHIP.NOT_FOUND' });
      }

      if (membership.status !== 'approved') {
        throw new AppError({
          code: 'MEMBERSHIP.INVALID_STATE',
          message: 'Only approved memberships can have their state updated'
        });
      }

      if (payload.hpCurrent !== undefined) {
        membership.hpCurrent = payload.hpCurrent;
      }

      if (payload.hpTotal !== undefined) {
        membership.hpTotal = payload.hpTotal;
      }

      if (payload.conditions !== undefined) {
        membership.conditions = payload.conditions ?? [];
      }

      if (payload.temporaryModifiers !== undefined) {
        membership.temporaryModifiers = payload.temporaryModifiers ?? {};
      }

      await membership.save({ transaction });

      return this.toResponse(await membership.reload({ include: membershipInclude, transaction }));
    });
  }

  private async resolveEntities(userId: string, payload: GameCharacterJoinInput, transaction: Transaction) {
    const character = await Character.findOne({
      where: { id: payload.characterId, userId },
      transaction,
      lock: Transaction.LOCK.UPDATE
    });

    if (!character) {
      throw new AppError({ code: 'CHARACTER.NOT_FOUND' });
    }

    const game = await Game.findByPk(payload.gameId, { transaction, lock: Transaction.LOCK.UPDATE });

    if (!game) {
      throw new AppError({ code: 'GAME.NOT_FOUND' });
    }

    return { character, game };
  }

  private async ensureGameOwnership(ownerUserId: string, gameId: string): Promise<void> {
    const game = await Game.findOne({ where: { id: gameId, ownerUserId } });

    if (!game) {
      throw new AppError({ code: 'GAME.NOT_FOUND' });
    }
  }

  private canAccessMembership(membership: GameCharacter, requesterId: string): boolean {
    const game = membership.get('game') as Game | undefined;
    const character = membership.get('character') as Character | undefined;

    if (membership.userId === requesterId) {
      return true;
    }

    if (game && game.ownerUserId === requesterId) {
      return true;
    }

    return Boolean(character && character.userId === requesterId);
  }

  private extractHp(computed: unknown): number | null {
    if (!computed || typeof computed !== 'object') {
      return null;
    }

    const derivedStats = (computed as Record<string, unknown>).derivedStats;

    if (!derivedStats || typeof derivedStats !== 'object') {
      return null;
    }

    const hpMax = (derivedStats as Record<string, unknown>).hpMax;

    return typeof hpMax === 'number' ? hpMax : null;
  }

  private toResponse(instance: GameCharacter): GameCharacterResponse {
    const json = instance.toJSON() as GameCharacterAttributes & {
      game?: GameCharacterResponse['game'];
      character?: GameCharacterResponse['character'];
    };

    return {
      id: json.id,
      gameId: json.gameId,
      characterId: json.characterId,
      userId: json.userId,
      status: json.status,
      hpCurrent: json.hpCurrent ?? null,
      hpTotal: json.hpTotal ?? null,
      conditions: json.conditions ?? [],
      temporaryModifiers: json.temporaryModifiers ?? {},
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
      game: json.game
        ? {
            id: json.game.id,
            name: json.game.name,
            ownerUserId: json.game.ownerUserId
          }
        : undefined,
      character: json.character
        ? {
            id: json.character.id,
            name: json.character.name,
            userId: json.character.userId
          }
        : undefined
    };
  }
}

export const gameCharacterService = new GameCharacterService();
