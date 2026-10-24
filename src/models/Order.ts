import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import sequelize from '../config/database';
import { OrderStatus } from '../types/enums';

class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  declare id: CreationOptional<number>;
  declare customerId: number;
  declare status: OrderStatus;
  declare totalAmount: number;
  declare discount: number;
  declare finalAmount: number;
  declare notes: string | null;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  calculateFinalAmount(): number {
    const total = Number(this.totalAmount);
    const discount = Number(this.discount);

    if (total < 0 || discount < 0 || discount > total) {
      throw new Error('Valores do pedido inválidos.');
    }

    return Number((total - discount).toFixed(2));
  }

  isCompleted(): boolean {
    return this.status === OrderStatus.COMPLETED;
  }

  cancel(): void {
    if (this.status === OrderStatus.COMPLETED) {
      throw new Error('Não é possível cancelar um pedido concluído.');
    }

    this.status = OrderStatus.CANCELLED;
  }
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'PENDING', 'APPROVED', 'IN_PRODUCTION',
        'COMPLETED', 'CANCELLED'
      ),
      allowNull: false,
      defaultValue: OrderStatus.PENDING,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    finalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'orders',
    timestamps: true,
  }
);

export default Order;