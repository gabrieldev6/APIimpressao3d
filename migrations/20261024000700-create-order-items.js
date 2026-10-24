'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_items', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      orderId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      productId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      quantity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
      },
      unitPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      subtotal: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
    });

    await queryInterface.addIndex('order_items', ['orderId']);
    await queryInterface.addIndex('order_items', ['productId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('order_items');
  },
};