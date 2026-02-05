"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.characterService = void 0;
const AppError_1 = require("../../shared/errors/AppError");
const character_repository_1 = require("./character.repository");
const character_permissions_1 = require("./character.permissions");
const ruleEngine_loader_1 = require("./ruleEngine.loader");
class CharacterService {
    async list(userId) {
        const records = await character_repository_1.characterRepository.listByUser(userId);
        return records.map((record) => this.toResponse(record).character);
    }
    async getByIdWithComputed(id, requesterId) {
        const hasAccess = await (0, character_permissions_1.canAccessCharacter)({ id: requesterId }, id);
        if (!hasAccess) {
            throw new AppError_1.AppError({ code: 'CHARACTER.NOT_FOUND' });
        }
        const record = await character_repository_1.characterRepository.findByIdWithRelations(id);
        if (!record) {
            throw new AppError_1.AppError({ code: 'CHARACTER.NOT_FOUND' });
        }
        const payload = this.toResponse(record);
        const computed = await (0, ruleEngine_loader_1.invokeRuleEngine)({
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
    async create(userId, payload) {
        const record = await character_repository_1.characterRepository.create(userId, payload);
        const response = this.toResponse(record);
        return response.character;
    }
    async updateAsOwner(id, userId, payload) {
        try {
            const record = await character_repository_1.characterRepository.update(id, userId, payload);
            const response = this.toResponse(record);
            return response.character;
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Character not found for user') {
                throw new AppError_1.AppError({ code: 'CHARACTER.NOT_FOUND' });
            }
            throw error;
        }
    }
    async remove(id, userId) {
        try {
            await character_repository_1.characterRepository.delete(id, userId);
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Character not found for user') {
                throw new AppError_1.AppError({ code: 'CHARACTER.NOT_FOUND' });
            }
            throw error;
        }
    }
    toResponse(instance) {
        const plain = instance.toJSON();
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
exports.characterService = new CharacterService();
