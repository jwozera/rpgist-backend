import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

import { ATTRIBUTE_TYPES, AttributeType } from './character.enums';

export interface AttributeAttributes {
  id: number;
  characterId: string;
  attributeId: AttributeType;
  base: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type AttributeCreationAttributes = Optional<AttributeAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Attribute
  extends Model<AttributeAttributes, AttributeCreationAttributes>
  implements AttributeAttributes
{
  public id!: number;
  public characterId!: string;
  public attributeId!: AttributeType;
  public base!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize): void {
    Attribute.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        characterId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'character_id'
        },
        attributeId: {
          type: DataTypes.ENUM(...ATTRIBUTE_TYPES),
          allowNull: false,
          field: 'attribute_id'
        },
        base: {
          type: DataTypes.INTEGER,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'attributes',
        timestamps: true,
        underscored: true
      }
    );
  }
}
