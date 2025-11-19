const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Account = require("./Account");

const Transaction = sequelize.define("Transaction", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM("Deposit", "Transfer", "Withdrawal"),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Pending", "Success", "Failed"),
    defaultValue: "Pending",
  },
  fromAccountId: {
    type: DataTypes.UUID,
    references: {
      model: Account,
      key: "id",
    },
  },
  toAccountId: {
    type: DataTypes.UUID,
    references: {
      model: Account,
      key: "id",
    },
  },
});

Transaction.belongsTo(Account, {
  as: "fromAccount",
  foreignKey: "fromAccountId",
});
Transaction.belongsTo(Account, { as: "toAccount", foreignKey: "toAccountId" });

module.exports = Transaction;
