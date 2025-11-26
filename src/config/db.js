const { Sequelize } = require("sequelize");
require("dotenv").config();

const pg = require("pg");

// Determine environment
const isProduction =
  process.env.NODE_ENV === "production" || process.env.VERCEL;

let sequelize;

// if (isProduction) {
  // Production: Use DATABASE_URL from Neon
  console.log("🌐 Connecting to production database (Neon)...");
console.log(
  "✅ pg loaded successfully — version:",
  require("pg/package.json").version
);
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectModule: pg,
    logging: false, // Set to console.log for debugging
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
// } else {
  // Local Development: Use individual DB credentials
  // console.log("💻 Connecting to local database...");

  // sequelize = new Sequelize(
  //   process.env.DB_NAME,
  //   process.env.DB_USER,
  //   process.env.DB_PASSWORD,
  //   {
  //     host: process.env.DB_HOST || "localhost",
  //     port: process.env.DB_PORT || 5432,
  //     dialect: "postgres",
  //     logging: false, // Set to console.log for debugging
  //     pool: {
  //       max: 5,
  //       min: 0,
  //       acquire: 30000,
  //       idle: 10000,
  //     },
  //   }
  // );
// }

// Test connection
sequelize
  .authenticate()
  .then(() => {
    console.log(
      `✅ Database connection established successfully (${
        isProduction ? "PRODUCTION" : "LOCAL"
      })`
    );
  })
  .catch(err => {
    console.error("❌ Unable to connect to the database:", err.message);
    console.error("Environment:", isProduction ? "PRODUCTION" : "LOCAL");
  });

module.exports = sequelize;
