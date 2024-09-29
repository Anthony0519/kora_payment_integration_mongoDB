'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
      allowNull: false
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      transaction_reference: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: true
      },
      DateTime: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sender: {
        type: Sequelize.STRING,
        allowNull: true
      },
      receipient: {
        type: Sequelize.STRING,
        allowNull: true
      },
      receipient_bank: {
        type: Sequelize.STRING,
        allowNull: true
      },
      receipient_account: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};