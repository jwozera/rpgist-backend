import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

import { ENHANCEMENT_TYPES, EnhancementType } from './character.enums';

export interface EnhancementAttributes {
  id: string;
  characterId: string;
  type: EnhancementType;
  cost: number;
  description: string;
  title?: string; // Only for custom enhancements
  createdAt?: Date;
  updatedAt?: Date;
}

export type EnhancementCreationAttributes = Optional<
  EnhancementAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class Enhancement
  extends Model<EnhancementAttributes, EnhancementCreationAttributes>
  implements EnhancementAttributes
{
  public id!: string;
  public characterId!: string;
  public type!: EnhancementType;
  public cost!: number;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize): void {
    Enhancement.init(
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
        type: {
          type: DataTypes.ENUM(...ENHANCEMENT_TYPES),
          allowNull: false,
          field: 'type'
        },
        cost: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'cost'
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: 'description'
        },
        title: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'title'
        }
      },
      {
        sequelize,
        tableName: 'enhancements',
        timestamps: true,
        underscored: true
      }
    );
  }
}
