var DataTypes = require("sequelize").DataTypes;
var _embeddings = require("./embeddings");

function initModels(sequelize) {
  var embeddings = _embeddings(sequelize, DataTypes);

  return {
    embeddings,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
