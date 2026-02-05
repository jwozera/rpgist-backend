import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type GameCharacterStatus = 'pending' | 'approved' | 'rejected' | 'removed';

export interface GameCharacterAttributes {
  id: string;
  gameId: string;
  characterId: string;
  userId: string;
  status: GameCharacterStatus;
  hpCurrent: number | null;
  hpTotal: number | null;
  conditions: string[];
  temporaryModifiers: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export type GameCharacterCreationAttributes = Optional<
  GameCharacterAttributes,
  'id' | 'hpCurrent' | 'hpTotal' | 'conditions' | 'temporaryModifiers' | 'createdAt' | 'updatedAt'
>;

export class GameCharacter
  extends Model<GameCharacterAttributes, GameCharacterCreationAttributes>
  implements GameCharacterAttributes
{
  public id!: string;
  public gameId!: string;
  public characterId!: string;
  public userId!: string;
  public status!: GameCharacterStatus;
  public hpCurrent!: number | null;
  public hpTotal!: number | null;
  public conditions!: string[];
  public temporaryModifiers!: Record<string, unknown>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize): void {
    GameCharacter.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        gameId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'game_id'
        },
        characterId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'character_id'
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'user_id'
        },
        status: {
          type: DataTypes.ENUM('pending', 'approved', 'rejected', 'removed'),
          allowNull: false,
          defaultValue: 'pending'
        },
        hpCurrent: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: null,
          field: 'hp_current'
        },
        hpTotal: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: null,
          field: 'hp_total'
        },
        conditions: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'conditions'
        },
        temporaryModifiers: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'temporary_modifiers'
        }
      },
      {
        sequelize,
        tableName: 'game_characters',
        timestamps: true,
        underscored: true,
        indexes: [
          {
            unique: true,
            fields: ['game_id', 'character_id']
          },
          {
            fields: ['game_id']
          },
          {
            fields: ['user_id']
          },
          {
            fields: ['status']
          }
        ]
      }
    );
  }
}
