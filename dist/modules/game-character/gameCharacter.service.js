"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameCharacterService = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../database");
const AppError_1 = require("../../shared/errors/AppError");
const character_model_1 = require("../character/character.model");
const character_service_1 = require("../character/character.service");
const game_model_1 = require("../game/game.model");
const gameCharacter_model_1 = require("./gameCharacter.model");
const membershipInclude = [
    {
        model: game_model_1.Game,
        as: 'game',
        attributes: ['id', 'name', 'ownerUserId']
    },
    {
        model: character_model_1.Character,
        as: 'character',
        attributes: ['id', 'name', 'userId']
    }
];
class GameCharacterService {
    async requestJoin(userId, payload) {
        return database_1.sequelize.transaction(async (transaction) => {
            const { character, game } = await this.resolveEntities(userId, payload, transaction);
            const existing = await gameCharacter_model_1.GameCharacter.findOne({
                where: { gameId: payload.gameId, characterId: payload.characterId },
                transaction,
                lock: sequelize_1.Transaction.LOCK.UPDATE
            });
            if (existing) {
                if (existing.userId !== userId) {
                    throw new AppError_1.AppError({
                        code: 'MEMBERSHIP.CONFLICT',
                        message: 'Character already linked to a different player for this game'
                    });
                }
                if (existing.status === 'approved') {
                    throw new AppError_1.AppError({
                        code: 'MEMBERSHIP.CONFLICT',
                        message: 'Character already approved for this game'
                    });
                }
                if (existing.status === 'pending') {
                    throw new AppError_1.AppError({
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
            const created = await gameCharacter_model_1.GameCharacter.create({
                gameId: game.id,
                characterId: character.id,
                userId,
                status: 'pending',
                hpCurrent: null,
                conditions: [],
                temporaryModifiers: {}
            }, { transaction });
            return this.toResponse(await created.reload({ include: membershipInclude, transaction }));
        });
    }
    async listForUser(userId) {
        const memberships = await gameCharacter_model_1.GameCharacter.findAll({
            where: { userId },
            include: membershipInclude,
            order: [['createdAt', 'DESC']]
        });
        return memberships.map((membership) => this.toResponse(membership));
    }
    async listForGame(ownerUserId, gameId) {
        await this.ensureGameOwnership(ownerUserId, gameId);
        const memberships = await gameCharacter_model_1.GameCharacter.findAll({
            where: { gameId },
            include: membershipInclude,
            order: [['createdAt', 'ASC']]
        });
        return memberships.map((membership) => this.toResponse(membership));
    }
    async getById(id, requesterId) {
        const membership = await gameCharacter_model_1.GameCharacter.findByPk(id, { include: membershipInclude });
        if (!membership) {
            throw new AppError_1.AppError({ code: 'MEMBERSHIP.NOT_FOUND' });
        }
        if (!this.canAccessMembership(membership, requesterId)) {
            throw new AppError_1.AppError({ code: 'MEMBERSHIP.NOT_FOUND' });
        }
        return this.toResponse(membership);
    }
    async approve(id, ownerUserId) {
        return database_1.sequelize.transaction(async (transaction) => {
            const membership = await gameCharacter_model_1.GameCharacter.findByPk(id, {
                lock: sequelize_1.Transaction.LOCK.UPDATE,
                transaction
            });
            if (!membership) {
                throw new AppError_1.AppError({ code: 'MEMBERSHIP.NOT_FOUND' });
            }
            await membership.reload({ include: membershipInclude, transaction });
            const game = membership.get('game');
            if (!game || game.ownerUserId !== ownerUserId) {
                throw new AppError_1.AppError({ code: 'MEMBERSHIP.NOT_FOUND' });
            }
            if (membership.status !== 'pending') {
                throw new AppError_1.AppError({
                    code: 'MEMBERSHIP.INVALID_STATE',
                    message: 'Only pending requests can be approved'
                });
            }
            const { computed } = await character_service_1.characterService.getByIdWithComputed(membership.characterId, ownerUserId);
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
    async reject(id, ownerUserId) {
        return database_1.sequelize.transaction(async (transaction) => {
            const membership = await gameCharacter_model_1.GameCharacter.findByPk(id, {
                lock: sequelize_1.Transaction.LOCK.UPDATE,
                transaction
            });
            if (!membership) {
                throw new AppError_1.AppError({ code: 'MEMBERSHIP.NOT_FOUND' });
            }
            await membership.reload({ include: membershipInclude, transaction });
            const game = membership.get('game');
            if (!game || game.ownerUserId !== ownerUserId) {
                throw new AppError_1.AppError({ code: 'MEMBERSHIP.NOT_FOUND' });
            }
            if (membership.status !== 'pending') {
                throw new AppError_1.AppError({
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
    async updateState(id, ownerUserId, payload) {
        return database_1.sequelize.transaction(async (transaction) => {
            const membership = await gameCharacter_model_1.GameCharacter.findByPk(id, {
                lock: sequelize_1.Transaction.LOCK.UPDATE,
                transaction
            });
            if (!membership) {
                throw new AppError_1.AppError({ code: 'MEMBERSHIP.NOT_FOUND' });
            }
            await membership.reload({ include: membershipInclude, transaction });
            const game = membership.get('game');
            if (!game || game.ownerUserId !== ownerUserId) {
                throw new AppError_1.AppError({ code: 'MEMBERSHIP.NOT_FOUND' });
            }
            if (membership.status !== 'approved') {
                throw new AppError_1.AppError({
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
    async resolveEntities(userId, payload, transaction) {
        const character = await character_model_1.Character.findOne({
            where: { id: payload.characterId, userId },
            transaction,
            lock: sequelize_1.Transaction.LOCK.UPDATE
        });
        if (!character) {
            throw new AppError_1.AppError({ code: 'CHARACTER.NOT_FOUND' });
        }
        const game = await game_model_1.Game.findByPk(payload.gameId, { transaction, lock: sequelize_1.Transaction.LOCK.UPDATE });
        if (!game) {
            throw new AppError_1.AppError({ code: 'GAME.NOT_FOUND' });
        }
        return { character, game };
    }
    async ensureGameOwnership(ownerUserId, gameId) {
        const game = await game_model_1.Game.findOne({ where: { id: gameId, ownerUserId } });
        if (!game) {
            throw new AppError_1.AppError({ code: 'GAME.NOT_FOUND' });
        }
    }
    canAccessMembership(membership, requesterId) {
        const game = membership.get('game');
        const character = membership.get('character');
        if (membership.userId === requesterId) {
            return true;
        }
        if (game && game.ownerUserId === requesterId) {
            return true;
        }
        return Boolean(character && character.userId === requesterId);
    }
    extractHp(computed) {
        if (!computed || typeof computed !== 'object') {
            return null;
        }
        const derivedStats = computed.derivedStats;
        if (!derivedStats || typeof derivedStats !== 'object') {
            return null;
        }
        const hpMax = derivedStats.hpMax;
        return typeof hpMax === 'number' ? hpMax : null;
    }
    toResponse(instance) {
        const json = instance.toJSON();
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
exports.gameCharacterService = new GameCharacterService();
