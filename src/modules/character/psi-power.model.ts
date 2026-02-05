import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface PsiPowerAttributes {
  id: string;
  characterId: string;
  name: string;
  notes: string;
  focus: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PsiPowerCreationAttributes = Optional<PsiPowerAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class PsiPower extends Model<PsiPowerAttributes, PsiPowerCreationAttributes> implements PsiPowerAttributes {
  public id!: string;
  public characterId!: string;
  public name!: string;
  public notes!: string;
  public focus!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize): void {
    PsiPower.init(
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
        notes: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        focus: {
          type: DataTypes.INTEGER,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'psi_powers',
        timestamps: true,
        underscored: true
      }
    );
  }
}
