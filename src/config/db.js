const { Sequelize } = require("sequelize");
require("dotenv").config(); // Ensure env vars are loaded

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false, // Set to console.log for debugging
    dialectOptions: {
      // Add SSL for production if needed: ssl: { require: true, rejectUnauthorized: false }
    },
  }
);

module.exports = sequelize;
