import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import sequelize from '../config/database';

class Customer extends Model<
  InferAttributes<Customer>,
  InferCreationAttributes<Customer>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare phone: string;
  declare document: string;
  declare address: string;
  declare city: string;
  declare state: string;
  declare zipCode: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  getFullAddress(): string {
    return `${this.address}, ${this.city} - ${this.state}, CEP: ${this.zipCode}`;
  }
}

Customer.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    document: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'customers',
    timestamps: true,
  }
);

export default Customer;