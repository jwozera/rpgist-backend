"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.characterRepository = exports.CharacterRepository = void 0;
const database_1 = require("../../database");
const game_model_1 = require("../game/game.model");
const gameCharacter_model_1 = require("../game-character/gameCharacter.model");
const attribute_model_1 = require("./attribute.model");
const character_model_1 = require("./character.model");
const cyberware_model_1 = require("./cyberware.model");
const enhancement_model_1 = require("./enhancement.model");
const psi_power_model_1 = require("./psi-power.model");
const skill_model_1 = require("./skill.model");
const defaultIncludes = [
    { model: attribute_model_1.Attribute, as: 'attributes' },
    { model: skill_model_1.Skill, as: 'skills' },
    { model: cyberware_model_1.Cyberware, as: 'cyberwares' },
    { model: psi_power_model_1.PsiPower, as: 'psiPowers' },
    { model: enhancement_model_1.Enhancement, as: 'enhancements' },
    {
        model: gameCharacter_model_1.GameCharacter,
        as: 'gameMemberships',
        include: [{ model: game_model_1.Game, as: 'game' }]
    }
];
class CharacterRepository {
    async listByUser(userId) {
        return character_model_1.Character.findAll({ where: { userId }, include: defaultIncludes });
    }
    async create(userId, payload) {
        return database_1.sequelize.transaction(async (transaction) => {
            const characterData = {
                ...payload.character,
                level: payload.character.level ?? 1,
                xp: payload.character.xp ?? 0,
                resources: payload.character.resources ?? {},
                userId
            };
            const character = await character_model_1.Character.create(characterData, { transaction });
            await this.replaceRelations(character.id, payload, transaction);
            return this.findByIdOrThrow(character.id, userId, transaction);
        });
    }
    async findById(id, userId) {
        return character_model_1.Character.findOne({ where: { id, userId }, include: defaultIncludes });
    }
    async findByIdWithRelations(id) {
        return character_model_1.Character.findByPk(id, { include: defaultIncludes });
    }
    async update(id, userId, payload) {
        return database_1.sequelize.transaction(async (transaction) => {
            await this.ensureOwnership(id, userId, transaction);
            const characterData = {
                ...payload.character,
                level: payload.character.level ?? 1,
                xp: payload.character.xp ?? 0,
                resources: payload.character.resources ?? {},
                userId
            };
            await character_model_1.Character.update(characterData, { where: { id, userId }, transaction });
            await this.replaceRelations(id, payload, transaction);
            return this.findByIdOrThrow(id, userId, transaction);
        });
    }
    async delete(id, userId) {
        await database_1.sequelize.transaction(async (transaction) => {
            await this.ensureOwnership(id, userId, transaction);
            await enhancement_model_1.Enhancement.destroy({ where: { characterId: id }, transaction });
            await psi_power_model_1.PsiPower.destroy({ where: { characterId: id }, transaction });
            await cyberware_model_1.Cyberware.destroy({ where: { characterId: id }, transaction });
            await skill_model_1.Skill.destroy({ where: { characterId: id }, transaction });
            await attribute_model_1.Attribute.destroy({ where: { characterId: id }, transaction });
            await character_model_1.Character.destroy({ where: { id, userId }, transaction });
        });
    }
    async replaceRelations(id, payload, transaction) {
        await Promise.all([
            attribute_model_1.Attribute.destroy({ where: { characterId: id }, transaction }),
            skill_model_1.Skill.destroy({ where: { characterId: id }, transaction }),
            cyberware_model_1.Cyberware.destroy({ where: { characterId: id }, transaction }),
            psi_power_model_1.PsiPower.destroy({ where: { characterId: id }, transaction }),
            enhancement_model_1.Enhancement.destroy({ where: { characterId: id }, transaction })
        ]);
        if (payload.attributes?.length) {
            const attributes = payload.attributes.map((attribute) => this.mapAttribute(id, attribute));
            await attribute_model_1.Attribute.bulkCreate(attributes, { transaction });
        }
        if (payload.skills?.length) {
            const skills = payload.skills.map((skill) => this.mapSkill(id, skill));
            await skill_model_1.Skill.bulkCreate(skills, { transaction });
        }
        if (payload.cyberwares?.length) {
            const cyberwares = payload.cyberwares.map((item) => this.mapCyberware(id, item));
            await cyberware_model_1.Cyberware.bulkCreate(cyberwares, { transaction });
        }
        if (payload.psiPowers?.length) {
            const psiPowers = payload.psiPowers.map((item) => this.mapPsiPower(id, item));
            await psi_power_model_1.PsiPower.bulkCreate(psiPowers, { transaction });
        }
        if (payload.enhancements?.length) {
            const enhancements = payload.enhancements.map((item) => this.mapEnhancement(id, item));
            await enhancement_model_1.Enhancement.bulkCreate(enhancements, { transaction });
        }
    }
    mapAttribute(characterId, attribute) {
        return {
            characterId,
            attributeId: attribute.attributeId,
            base: attribute.base
        };
    }
    mapSkill(characterId, skill) {
        return {
            characterId,
            name: skill.name,
            category: skill.category,
            baseAttribute: skill.baseAttribute,
            invested: skill.invested ?? {},
            misc: skill.misc ?? 0,
            damage: skill.damage ?? null,
            rof: skill.rof ?? null
        };
    }
    mapCyberware(characterId, cyberware) {
        return {
            characterId,
            name: cyberware.name,
            description: cyberware.description,
            cost: cyberware.cost,
            modifiers: cyberware.modifiers ?? {},
            skillModifiers: cyberware.skillModifiers ?? {}
        };
    }
    mapPsiPower(characterId, power) {
        return {
            characterId,
            name: power.name,
            notes: power.notes,
            focus: power.focus
        };
    }
    mapEnhancement(characterId, enhancement) {
        return {
            characterId,
            type: enhancement.type,
            cost: enhancement.cost,
            description: enhancement.description
        };
    }
    async ensureOwnership(id, userId, transaction) {
        const exists = await character_model_1.Character.findOne({ where: { id, userId }, attributes: ['id'], transaction });
        if (!exists) {
            throw new Error('Character not found for user');
        }
    }
    async findByIdOrThrow(id, userId, transaction) {
        const character = await character_model_1.Character.findOne({ where: { id, userId }, include: defaultIncludes, transaction });
        if (!character) {
            throw new Error('Character not found after persistence');
        }
        return character;
    }
}
exports.CharacterRepository = CharacterRepository;
exports.characterRepository = new CharacterRepository();
