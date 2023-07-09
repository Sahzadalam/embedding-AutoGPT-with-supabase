("use strict");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("embeddings", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
      },
      text: {
        allowNull: false,
        primaryKey: false,
        type: Sequelize.DataTypes.TEXT,
      },
      sourceLink: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      embedding: {
        allowNull: false,
        type: Sequelize.BLOB,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("embeddings");
  },
};
