const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "embeddings",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      sourceLink: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      embedding: {
        type: DataTypes.BLOB,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "embeddings",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
