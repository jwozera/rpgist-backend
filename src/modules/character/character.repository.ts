import { Transaction } from 'sequelize';

import { sequelize } from '../../database';
import { Game } from '../game/game.model';
import { GameCharacter } from '../game-character/gameCharacter.model';

import { Attribute, AttributeCreationAttributes } from './attribute.model';
import { Character, CharacterCreationAttributes } from './character.model';
import {
  AttributeInput,
  CharacterPayload,
  CyberwareInput,
  EnhancementInput,
  PsiPowerInput,
  SkillInput
} from './character.types';
import { Cyberware, CyberwareCreationAttributes } from './cyberware.model';
import { Enhancement, EnhancementCreationAttributes } from './enhancement.model';
import { PsiPower, PsiPowerCreationAttributes } from './psi-power.model';
import { Skill, SkillCreationAttributes } from './skill.model';

const defaultIncludes = [
  { model: Attribute, as: 'attributes' },
  { model: Skill, as: 'skills' },
  { model: Cyberware, as: 'cyberwares' },
  { model: PsiPower, as: 'psiPowers' },
  { model: Enhancement, as: 'enhancements' },
  {
    model: GameCharacter,
    as: 'gameMemberships',
    include: [{ model: Game, as: 'game' }]
  }
];

export class CharacterRepository {
  async listByUser(userId: string): Promise<Character[]> {
    return Character.findAll({ where: { userId }, include: defaultIncludes });
  }

  async create(userId: string, payload: CharacterPayload): Promise<Character> {
    return sequelize.transaction(async (transaction) => {
      const characterData: CharacterCreationAttributes = {
        ...payload.character,
        level: payload.character.level ?? 1,
        xp: payload.character.xp ?? 0,
        resources: payload.character.resources ?? {},
        userId
      };

      const character = await Character.create(characterData, { transaction });

      await this.replaceRelations(character.id, payload, transaction);

      return this.findByIdOrThrow(character.id, userId, transaction);
    });
  }

  async findById(id: string, userId: string): Promise<Character | null> {
    return Character.findOne({ where: { id, userId }, include: defaultIncludes });
  }

  async findByIdWithRelations(id: string): Promise<Character | null> {
    return Character.findByPk(id, { include: defaultIncludes });
  }

  async update(id: string, userId: string, payload: CharacterPayload): Promise<Character> {
    return sequelize.transaction(async (transaction) => {
      await this.ensureOwnership(id, userId, transaction);

      const characterData: CharacterCreationAttributes = {
        ...payload.character,
        level: payload.character.level ?? 1,
        xp: payload.character.xp ?? 0,
        resources: payload.character.resources ?? {},
        userId
      };

      await Character.update(characterData, { where: { id, userId }, transaction });
      await this.replaceRelations(id, payload, transaction);
      return this.findByIdOrThrow(id, userId, transaction);
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await sequelize.transaction(async (transaction) => {
      await this.ensureOwnership(id, userId, transaction);

      await Enhancement.destroy({ where: { characterId: id }, transaction });
      await PsiPower.destroy({ where: { characterId: id }, transaction });
      await Cyberware.destroy({ where: { characterId: id }, transaction });
      await Skill.destroy({ where: { characterId: id }, transaction });
      await Attribute.destroy({ where: { characterId: id }, transaction });
      await Character.destroy({ where: { id, userId }, transaction });
    });
  }

  private async replaceRelations(id: string, payload: CharacterPayload, transaction: Transaction): Promise<void> {
    await Promise.all([
      Attribute.destroy({ where: { characterId: id }, transaction }),
      Skill.destroy({ where: { characterId: id }, transaction }),
      Cyberware.destroy({ where: { characterId: id }, transaction }),
      PsiPower.destroy({ where: { characterId: id }, transaction }),
      Enhancement.destroy({ where: { characterId: id }, transaction })
    ]);

    if (payload.attributes?.length) {
      const attributes = payload.attributes.map((attribute) => this.mapAttribute(id, attribute));
      await Attribute.bulkCreate(attributes, { transaction });
    }

    if (payload.skills?.length) {
      const skills = payload.skills.map((skill) => this.mapSkill(id, skill));
      await Skill.bulkCreate(skills, { transaction });
    }

    if (payload.cyberwares?.length) {
      const cyberwares = payload.cyberwares.map((item) => this.mapCyberware(id, item));
      await Cyberware.bulkCreate(cyberwares, { transaction });
    }

    if (payload.psiPowers?.length) {
      const psiPowers = payload.psiPowers.map((item) => this.mapPsiPower(id, item));
      await PsiPower.bulkCreate(psiPowers, { transaction });
    }

    if (payload.enhancements?.length) {
      const enhancements = payload.enhancements.map((item) => this.mapEnhancement(id, item));
      await Enhancement.bulkCreate(enhancements, { transaction });
    }
  }

  private mapAttribute(characterId: string, attribute: AttributeInput): AttributeCreationAttributes {
    return {
      characterId,
      attributeId: attribute.attributeId,
      base: attribute.base
    };
  }

  private mapSkill(characterId: string, skill: SkillInput): SkillCreationAttributes {
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

  private mapCyberware(characterId: string, cyberware: CyberwareInput): CyberwareCreationAttributes {
    return {
      characterId,
      name: cyberware.name,
      description: cyberware.description,
      cost: cyberware.cost,
      modifiers: cyberware.modifiers ?? {},
      skillModifiers: cyberware.skillModifiers ?? {}
    };
  }

  private mapPsiPower(characterId: string, power: PsiPowerInput): PsiPowerCreationAttributes {
    return {
      characterId,
      name: power.name,
      notes: power.notes,
      focus: power.focus
    };
  }

  private mapEnhancement(characterId: string, enhancement: EnhancementInput): EnhancementCreationAttributes {
    return {
      characterId,
      type: enhancement.type,
      cost: enhancement.cost,
      description: enhancement.description
    };
  }

  private async ensureOwnership(id: string, userId: string, transaction?: Transaction): Promise<void> {
    const exists = await Character.findOne({ where: { id, userId }, attributes: ['id'], transaction });

    if (!exists) {
      throw new Error('Character not found for user');
    }
  }

  private async findByIdOrThrow(id: string, userId: string, transaction?: Transaction): Promise<Character> {
    const character = await Character.findOne({ where: { id, userId }, include: defaultIncludes, transaction });

    if (!character) {
      throw new Error('Character not found after persistence');
    }

    return character;
  }
}

export const characterRepository = new CharacterRepository();
