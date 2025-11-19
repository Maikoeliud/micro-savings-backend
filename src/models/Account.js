const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Account = sequelize.define("Account", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
});

Account.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });
User.hasOne(Account, { foreignKey: { name: "userId", allowNull: false } });

module.exports = Account;
