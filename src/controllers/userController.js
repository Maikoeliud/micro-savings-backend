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

module.exports = { createUser, getBalance, getTransactions };
