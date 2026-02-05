import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

import { ATTRIBUTE_TYPES, AttributeType, SKILL_CATEGORIES, SkillCategory } from './character.enums';

export interface SkillAttributes {
  id: string;
  characterId: string;
  name: string;
  category: SkillCategory;
  baseAttribute: AttributeType;
  invested: Record<string, unknown>;
  misc: number;
  damage?: string | null;
  rof?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SkillCreationAttributes = Optional<
  SkillAttributes,
  'id' | 'damage' | 'rof' | 'invested' | 'misc' | 'createdAt' | 'updatedAt'
>;

export class Skill extends Model<SkillAttributes, SkillCreationAttributes> implements SkillAttributes {
  public id!: string;
  public characterId!: string;
  public name!: string;
  public category!: SkillCategory;
  public baseAttribute!: AttributeType;
  public invested!: Record<string, unknown>;
  public misc!: number;
  public damage?: string | null;
  public rof?: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize): void {
    Skill.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        characterId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'character_id'
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        category: {
          type: DataTypes.ENUM(...SKILL_CATEGORIES),
          allowNull: false,
          field: 'category'
        },
        baseAttribute: {
          type: DataTypes.ENUM(...ATTRIBUTE_TYPES),
          allowNull: false,
          field: 'base_attribute'
        },
        invested: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'invested'
        },
        misc: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'misc'
        },
        damage: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'damage'
        },
        rof: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'rof'
        }
      },
      {
        sequelize,
        tableName: 'skills',
        timestamps: true,
        underscored: true
      }
    );
  }
}
