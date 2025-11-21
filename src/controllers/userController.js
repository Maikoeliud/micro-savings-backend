const { User, Account, Transaction, sequelize } = require("../models/index");
const Joi = require("joi");
const logger = require("../utils/logger");

const createUser = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const result = await sequelize.transaction(async t => {
      const user = await User.create(req.body, { transaction: t });
      const account = await Account.create(
        { userId: user.id },
        { transaction: t }
      );
      return { user, account };
    });
    logger.info(`User created: ${result.user.id}`);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Account,
          attributes: ["id", "balance"], // Only include relevant account fields
        },
      ],
      attributes: ["id", "name", "email"], // User fields to return
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};
const getBalance = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.user_id, { include: Account });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ balance: user.Account.balance });
  } catch (err) {
    next(err);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const account = await Account.findOne({
      where: { userId: req.params.user_id },
    });
    if (!account) return res.status(404).json({ error: "Account not found" });

    const transactions = await Transaction.findAll({
      where: {
        [sequelize.Op.or]: [
          { fromAccountId: account.id },
          { toAccountId: account.id },
        ],
      },
      order: [["createdAt", "DESC"]],
    });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};
const getSystemStats = async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const totalBalance = await Account.sum("balance");
    const totalTransfers = await Transaction.count({
      where: { type: "Transfer" },
    });
    const totalWithdrawals = await Transaction.count({
      where: { type: "Withdrawal" },
    });

    res.json({
      totalUsers,
      totalValueInWallets: totalBalance || 0,
      totalTransfers,
      totalWithdrawals,
    });
  } catch (err) {
    next(err);
  }
};

const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        { model: Account, as: "fromAccount", include: User },
        { model: Account, as: "toAccount", include: User },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formatted = transactions.map(tx => ({
      id: tx.id,
      type: tx.type,
      status: tx.status,
      amount: tx.amount,
      fromUser: tx.fromAccount ? tx.fromAccount.User.name : null,
      toUser: tx.toAccount ? tx.toAccount.User.name : null,
      timestamp: tx.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
};

// Export them too
module.exports = {
  createUser,
  getAllUsers,
  getBalance,
  getTransactions,
  getSystemStats,
  getAllTransactions,
};
