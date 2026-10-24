import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import sequelize from '../config/database';
import { PrinterStatus } from '../types/enums';

class Printer extends Model<
  InferAttributes<Printer>,
  InferCreationAttributes<Printer>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare model: string;
  declare manufacturer: string;
  declare status: PrinterStatus;
  declare nozzleDiameter: number;
  declare maxTemperature: number;
  declare notes: string | null;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  isAvailable(): boolean {
    return this.status === PrinterStatus.AVAILABLE;
  }

  startPrinting(): void {
    if (!this.isAvailable()) {
      throw new Error('A impressora não está disponível.');
    }

    this.status = PrinterStatus.PRINTING;
  }
}

Printer.init(
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
    model: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    manufacturer: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'AVAILABLE', 'PRINTING', 'MAINTENANCE', 'INACTIVE'
      ),
      allowNull: false,
      defaultValue: PrinterStatus.AVAILABLE,
    },
    nozzleDiameter: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
      defaultValue: 0.4,
    },
    maxTemperature: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
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
    tableName: 'printers',
    timestamps: true,
  }
);

export default Printer;