import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import sequelize from '../config/database';

class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare sku: string;
  declare category: string;
  declare weight: number;
  declare printTime: number;
  declare cost: number;
  declare price: number;
  declare isActive: boolean;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  calculateProfit(): number {
    return Number(
      (Number(this.price) - Number(this.cost)).toFixed(2)
    );
  }

  calculateTotalCost(quantity: number): number {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error('A quantidade deve ser um inteiro positivo.');
    }

    return Number((Number(this.cost) * quantity).toFixed(2));
  }

  deactivate(): void {
    this.isActive = false;
  }
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    weight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    printTime: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
  }
);

export default Product;