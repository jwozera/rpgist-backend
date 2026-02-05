import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface CharacterAttributes {
  id: string;
  userId: string;
  name: string;
  profession: string;
  level: number;
  xp: number;
  ageReal: number;
  ageApparent: number;
  heightCm: number;
  weightKg: number;
  imageUrl?: string | null;
  resources: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CharacterCreationAttributes = Optional<
  CharacterAttributes,
  'id' | 'imageUrl' | 'resources' | 'createdAt' | 'updatedAt'
>;

export class Character
  extends Model<CharacterAttributes, CharacterCreationAttributes>
  implements CharacterAttributes
{
  public id!: string;
  public userId!: string;
  public name!: string;
  public profession!: string;
  public level!: number;
  public xp!: number;
  public ageReal!: number;
  public ageApparent!: number;
  public heightCm!: number;
  public weightKg!: number;
  public imageUrl?: string | null;
  public resources!: Record<string, unknown>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize): void {
    Character.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'user_id'
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        profession: {
          type: DataTypes.STRING,
          allowNull: false
        },
        level: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1
        },
        xp: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        ageReal: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'age_real'
        },
        ageApparent: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'age_apparent'
        },
        heightCm: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'height_cm'
        },
        weightKg: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'weight_kg'
        },
        imageUrl: {
          type: DataTypes.STRING,
          allowNull: true
        },
        resources: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {}
        }
      },
      {
        sequelize,
        tableName: 'characters',
        timestamps: true,
        underscored: true
      }
    );
  }
}
