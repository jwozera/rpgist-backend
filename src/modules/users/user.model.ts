import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface UserAttributes {
  id: string;
  email: string;
  displayName: string | null;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'displayName'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public displayName!: string | null;
  public passwordHash!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize): void {
    User.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true
          }
        },
        passwordHash: {
          type: DataTypes.STRING,
          allowNull: false,
          field: 'password_hash'
        },
        displayName: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'display_name'
        }
      },
      {
        sequelize,
        tableName: 'users',
        timestamps: true,
        underscored: true,
        indexes: [
          {
            unique: true,
            fields: ['email']
          }
        ]
      }
    );
  }
}
