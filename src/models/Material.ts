import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import sequelize from '../config/database';
import { MaterialType } from '../types/enums';

class Material extends Model<
  InferAttributes<Material>,
  InferCreationAttributes<Material>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare type: MaterialType;
  declare color: string;
  declare brand: string;
  declare diameter: number;
  declare pricePerKg: number;
  declare stockGrams: number;
  declare minStockGrams: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  hasLowStock(): boolean {
    return this.stockGrams <= this.minStockGrams;
  }

  calculateCost(grams: number): number {
    if (grams < 0) {
      throw new Error('A quantidade não pode ser negativa.');
    }

    return (Number(this.pricePerKg) / 1000) * grams;
  }
}

Material.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        'PLA', 'PETG', 'ABS', 'TPU', 'RESIN', 'OTHER'
      ),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    diameter: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
      defaultValue: 1.75,
    },
    pricePerKg: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stockGrams: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    minStockGrams: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 500,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'materials',
    timestamps: true,
  }
);

export default Material;