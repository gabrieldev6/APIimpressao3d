'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('materials', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM(
          'PLA', 'PETG', 'ABS', 'TPU', 'RESIN', 'OTHER'
        ),
        allowNull: false,
      },
      color: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      brand: {
        type: Sequelize.STRING(120),
        allowNull: true,
      },
      diameter: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      pricePerKg: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      stockGrams: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      minStockGrams: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('materials');
  },
};