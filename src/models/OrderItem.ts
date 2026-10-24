import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import sequelize from '../config/database';

class OrderItem extends Model<
  InferAttributes<OrderItem>,
  InferCreationAttributes<OrderItem>
> {
  declare id: CreationOptional<number>;
  declare orderId: number;
  declare productId: number;
  declare quantity: number;
  declare unitPrice: number;
  declare subtotal: number;

  calculateSubtotal(): number {
    if (this.quantity <= 0 || Number(this.unitPrice) < 0) {
      throw new Error('Quantidade ou preço inválido.');
    }

    return Number(
      (this.quantity * Number(this.unitPrice)).toFixed(2)
    );
  }
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: { min: 1 },
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'order_items',
    timestamps: false,
  }
);

export default OrderItem;