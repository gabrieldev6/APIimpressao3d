import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import sequelize from '../config/database';
import { PaymentMethod, PaymentStatus } from '../types/enums';

class Payment extends Model<
  InferAttributes<Payment>,
  InferCreationAttributes<Payment>
> {
  declare id: CreationOptional<number>;
  declare orderId: number;
  declare amount: number;
  declare method: PaymentMethod;
  declare status: PaymentStatus;
  declare transactionId: string | null;
  declare paidAt: Date | null;
  declare createdAt: CreationOptional<Date>;

  isPaid(): boolean {
    return this.status === PaymentStatus.APPROVED;
  }

  markAsPaid(): void {
    this.status = PaymentStatus.APPROVED;
    this.paidAt = new Date();
  }
}

Payment.init(
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0.01 },
    },
    method: {
      type: DataTypes.ENUM(
        'PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'BANK_TRANSFER'
      ),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'PENDING', 'APPROVED', 'REJECTED', 'REFUNDED'
      ),
      allowNull: false,
      defaultValue: PaymentStatus.PENDING,
    },
    transactionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'payments',
    timestamps: true,
    updatedAt: false,
  }
);

export default Payment;