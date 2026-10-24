'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('printers', {
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
      model: {
        type: Sequelize.STRING(120),
        allowNull: true,
      },
      manufacturer: {
        type: Sequelize.STRING(120),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(
          'AVAILABLE', 'PRINTING', 'MAINTENANCE', 'INACTIVE'
        ),
        allowNull: false,
        defaultValue: 'AVAILABLE',
      },
      nozzleDiameter: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: true,
      },
      maxTemperature: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.dropTable('printers');
  },
};