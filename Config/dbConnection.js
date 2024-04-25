require("dotenv").config();
const { Sequelize } = require("sequelize");

const connectDb = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

connectDb
  .authenticate()
  .then(() => {
    console.log("Connected to MySQL database");
  })
  .catch((err) => {
    console.error("Error connecting to MySQL database:", err);
  });

module.exports = connectDb;
