const sequelize = require("../config/db");
const User = require("./User");
const Account = require("./Account");
const Transaction = require("./Transaction");

// Associations are already defined in models

// Sync models (create tables if not exist)
sequelize.sync({ force: false }); // Set force: true for dev to reset DB

module.exports = { User, Account, Transaction, sequelize };
