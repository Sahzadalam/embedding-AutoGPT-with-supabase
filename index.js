require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const Sequelize = require("sequelize");
const initModels = require("./models/init-models");
const dbconfig = require("./config/config");
var bodyParser = require("body-parser");
const embeddingController = require("./controller/embeddingController");

app.use(bodyParser.json());
var whitelist = JSON.parse(process.env.WHITELIST_DOMAINS);
var corsOptions = {
  origin: function (origin, callback) {
    if (process.env.NODE_ENV === "development") {
      callback(null, true);
    } else {
      if (whitelist?.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Unauthorized Domain"));
      }
    }
  },
};
app.use(cors(corsOptions));

const init = async () => {
  const db = dbconfig[process.env.NODE_ENV];
  const { database, username, password, host, dialect } = db;
  const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
    logging: false,
    pool: {
      max: 1,
      min: 0,
      acquire: 1000,
      idle: 1000,
    },
  });
  const databases = initModels(sequelize);

  app.get("/api/v1/store-embedding", async (req, res) => {
    await embeddingController.storeEmbedding(req, res, databases);
  });
  app.get("/api/v1/search", async (req, res) => {
    await embeddingController.searchEmbedding(req, res, databases);
  });

  app.listen(process.env.PORT, () => {
    console.log(`app running on ${process.env.PORT}`);
  });
};

init();
