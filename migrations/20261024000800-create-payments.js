'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
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
        onDelete: 'RESTRICT',
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      method: {
        type: Sequelize.ENUM(
          'PIX', 'CREDIT_CARD', 'DEBIT_CARD',
          'CASH', 'BANK_TRANSFER'
        ),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          'PENDING', 'APPROVED', 'REJECTED', 'REFUNDED'
        ),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      transactionId: {
        type: Sequelize.STRING(180),
        allowNull: true,
        unique: true,
      },
      paidAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('payments', ['orderId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('payments');
  },
};