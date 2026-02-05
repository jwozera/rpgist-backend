import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface GameAttributes {
  id: string;
  name: string;
  description: string | null;
  ownerUserId: string;
  status: 'draft' | 'active' | 'archived';
  createdAt?: Date;
  updatedAt?: Date;
}

export type GameCreationAttributes = Optional<GameAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Game extends Model<GameAttributes, GameCreationAttributes> implements GameAttributes {
  public id!: string;
  public name!: string;
  public description!: string | null;
  public ownerUserId!: string;
  public status!: 'draft' | 'active' | 'archived';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize): void {
    Game.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        ownerUserId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'owner_user_id'
        },
        status: {
          type: DataTypes.ENUM('draft', 'active', 'archived'),
          allowNull: false,
          defaultValue: 'draft'
        }
      },
      {
        sequelize,
        tableName: 'games',
        timestamps: true,
        underscored: true
      }
    );
  }
}
