import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import sequelize from '../config/database';
import { PrintJobStatus } from '../types/enums';

class PrintJob extends Model<
  InferAttributes<PrintJob>,
  InferCreationAttributes<PrintJob>
> {
  declare id: CreationOptional<number>;
  declare orderItemId: number;
  declare printerId: number;
  declare materialId: number;
  declare status: PrintJobStatus;
  declare quantity: number;
  declare estimatedTime: number;
  declare actualTime: number | null;
  declare materialUsedGrams: number;
  declare startedAt: Date | null;
  declare finishedAt: Date | null;
  declare failureReason: string | null;
  declare notes: string | null;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  start(): void {
    if (this.status !== PrintJobStatus.PENDING) {
      throw new Error('Somente trabalhos pendentes podem ser iniciados.');
    }

    this.status = PrintJobStatus.PRINTING;
    this.startedAt = new Date();
  }

  finish(actualTime: number, materialUsedGrams: number): void {
    if (this.status !== PrintJobStatus.PRINTING) {
      throw new Error('O trabalho não está em andamento.');
    }

    if (actualTime < 0 || materialUsedGrams < 0) {
      throw new Error('Tempo ou consumo inválido.');
    }

    this.status = PrintJobStatus.COMPLETED;
    this.actualTime = actualTime;
    this.materialUsedGrams = materialUsedGrams;
    this.finishedAt = new Date();
  }

  fail(reason: string): void {
    if (this.status !== PrintJobStatus.PRINTING) {
      throw new Error('Somente trabalhos em andamento podem falhar.');
    }

    this.status = PrintJobStatus.FAILED;
    this.failureReason = reason;
    this.finishedAt = new Date();
  }
}

PrintJob.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    orderItemId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    printerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    materialId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'PENDING', 'PRINTING', 'COMPLETED', 'FAILED', 'CANCELLED'
      ),
      allowNull: false,
      defaultValue: PrintJobStatus.PENDING,
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: { min: 1 },
    },
    estimatedTime: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    actualTime: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    materialUsedGrams: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    finishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    failureReason: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'print_jobs',
    timestamps: true,
  }
);

export default PrintJob;