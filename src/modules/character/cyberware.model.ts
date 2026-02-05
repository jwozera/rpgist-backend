import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface CyberwareAttributes {
  id: string;
  characterId: string;
  name: string;
  description: string;
  cost: number;
  modifiers: Record<string, unknown>;
  skillModifiers: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CyberwareCreationAttributes = Optional<
  CyberwareAttributes,
  'id' | 'modifiers' | 'skillModifiers' | 'createdAt' | 'updatedAt'
>;

export class Cyberware
  extends Model<CyberwareAttributes, CyberwareCreationAttributes>
  implements CyberwareAttributes
{
  public id!: string;
  public characterId!: string;
  public name!: string;
  public description!: string;
  public cost!: number;
  public modifiers!: Record<string, unknown>;
  public skillModifiers!: Record<string, unknown>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize): void {
    Cyberware.init(
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
        description: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        cost: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        modifiers: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'modifiers'
        },
        skillModifiers: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'skill_modifiers'
        }
      },
      {
        sequelize,
        tableName: 'cyberwares',
        timestamps: true,
        underscored: true
      }
    );
  }
}
