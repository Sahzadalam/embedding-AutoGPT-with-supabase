"use strict";
const Sequelize = require("sequelize");
const models = require("./models");
const dbconfig = require("./config/config");
const { createUser } = require("./controller/userController");

let databases;

const getDatabases = async () => {
  const db = dbconfig[process.env.NODE_ENV];
  const { database, username, password, host, dialect } = db;
  const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
    pool: {
      max: 1,
      min: 0,
      acquire: 1000,
      idle: 1000,
    },
  });
  await sequelize.authenticate();
  return models(sequelize);
};

module.exports.signin = async (event) => {
  try {
    if (!databases) {
      databases = await getDatabases();
    } else {
      Sequelize.connectionManager.initPools();
      if (Sequelize.connectionManager.hasOwnProperty("getConnection")) {
        delete Sequelize.connectionManager.getConnection;
      }
    }
    return await createUser(event, databases);
  } catch (e) {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        success: false,
      }),
    };
  }
};
