import { AppError } from '../../shared/errors/AppError';

import { Attribute, AttributeAttributes } from './attribute.model';
import { Character, CharacterAttributes } from './character.model';
import { characterRepository } from './character.repository';
import { canAccessCharacter } from './character.permissions';
import { CharacterPayload } from './character.types';
import { Cyberware, CyberwareAttributes } from './cyberware.model';
import { Enhancement, EnhancementAttributes } from './enhancement.model';
import { PsiPower, PsiPowerAttributes } from './psi-power.model';
import { invokeRuleEngine } from './ruleEngine.loader';
import { Skill, SkillAttributes } from './skill.model';
import { GameCharacter, GameCharacterAttributes } from '../game-character/gameCharacter.model';

type CharacterWithRelations = Character & {
  attributes?: Attribute[];
  skills?: Skill[];
  cyberwares?: Cyberware[];
  psiPowers?: PsiPower[];
  enhancements?: Enhancement[];
  gameMemberships?: GameCharacter[];
};

type CharacterPlain = CharacterAttributes & {
  attributes: AttributeAttributes[];
  skills: SkillAttributes[];
  cyberwares: CyberwareAttributes[];
  psiPowers: PsiPowerAttributes[];
  enhancements: EnhancementAttributes[];
  gameMemberships?: Array<
    GameCharacterAttributes & {
      game?: {
        id: string;
        name: string;
      };
    }
  >;
};

export type CharacterResponse = CharacterPlain;

type CharacterAggregateResponse = {
  character: CharacterResponse;
  attributes: AttributeAttributes[];
  skills: SkillAttributes[];
  cyberwares: CyberwareAttributes[];
  psiPowers: PsiPowerAttributes[];
  enhancements: EnhancementAttributes[];
};

class CharacterService {
  async list(userId: string): Promise<CharacterResponse[]> {
    const records = await characterRepository.listByUser(userId);
    return records.map((record) => this.toResponse(record).character);
  }

  async getByIdWithComputed(
    id: string,
    requesterId: string
  ): Promise<{ character: CharacterResponse; computed: unknown }> {
    const hasAccess = await canAccessCharacter({ id: requesterId }, id);

    if (!hasAccess) {
      throw new AppError({ code: 'CHARACTER.NOT_FOUND' });
    }

    const record = await characterRepository.findByIdWithRelations(id);

    if (!record) {
      throw new AppError({ code: 'CHARACTER.NOT_FOUND' });
    }

    const payload = this.toResponse(record);
    const computed = await invokeRuleEngine({
      character: payload.character,
      attributes: payload.attributes,
      skills: payload.skills,
      modifiers: {
        cyberwares: payload.cyberwares,
        psiPowers: payload.psiPowers,
        enhancements: payload.enhancements
      }
    });

    return {
      character: payload.character,
      computed
    };
  }

  async create(userId: string, payload: CharacterPayload): Promise<CharacterResponse> {
    const record = await characterRepository.create(userId, payload);
    const response = this.toResponse(record);
    return response.character;
  }

  async updateAsOwner(id: string, userId: string, payload: CharacterPayload): Promise<CharacterResponse> {
    try {
      const record = await characterRepository.update(id, userId, payload);
      const response = this.toResponse(record);
      return response.character;
    } catch (error) {
      if (error instanceof Error && error.message === 'Character not found for user') {
        throw new AppError({ code: 'CHARACTER.NOT_FOUND' });
      }

      throw error;
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    try {
      await characterRepository.delete(id, userId);
    } catch (error) {
      if (error instanceof Error && error.message === 'Character not found for user') {
        throw new AppError({ code: 'CHARACTER.NOT_FOUND' });
      }

      throw error;
    }
  }

  private toResponse(instance: CharacterWithRelations): CharacterAggregateResponse {
    const plain = instance.toJSON() as CharacterPlain;

    const attributes = plain.attributes ?? [];
    const skills = plain.skills ?? [];
    const cyberwares = plain.cyberwares ?? [];
    const psiPowers = plain.psiPowers ?? [];
    const enhancements = plain.enhancements ?? [];
    const gameMemberships = (plain.gameMemberships ?? []).map((membership) => ({
      id: membership.id,
      gameId: membership.gameId,
      characterId: membership.characterId,
      userId: membership.userId,
      status: membership.status,
      hpCurrent: membership.hpCurrent ?? null,
      hpTotal: membership.hpTotal ?? null,
      conditions: membership.conditions ?? [],
      temporaryModifiers: membership.temporaryModifiers ?? {},
      createdAt: membership.createdAt,
      updatedAt: membership.updatedAt,
      game: membership.game
        ? {
            id: membership.game.id,
            name: membership.game.name
          }
        : undefined
    }));

    return {
      character: {
        id: plain.id,
        userId: plain.userId,
        name: plain.name,
        profession: plain.profession,
        level: plain.level,
        xp: plain.xp,
        ageReal: plain.ageReal,
        ageApparent: plain.ageApparent,
        heightCm: plain.heightCm,
        weightKg: plain.weightKg,
        imageUrl: plain.imageUrl,
        resources: plain.resources ?? {},
        createdAt: plain.createdAt,
        updatedAt: plain.updatedAt,
        attributes,
        skills,
        cyberwares,
        psiPowers,
        enhancements,
        gameMemberships
      },
      attributes,
      skills,
      cyberwares,
      psiPowers,
      enhancements
    };
  }
}

export const characterService = new CharacterService();
