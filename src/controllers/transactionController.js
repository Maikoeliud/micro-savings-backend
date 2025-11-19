const { Account, Transaction, sequelize } = require("../models/index");
const Joi = require("joi");
const logger = require("../utils/logger");
const { v4: uuidv4 } = require("uuid");

// Helper to check if transaction ID already processed (idempotency)
const isTransactionProcessed = async transactionId => {
  return await Transaction.findOne({ where: { id: transactionId } });
};

const deposit = async (req, res, next) => {
  const schema = Joi.object({
    user_id: Joi.string().uuid().required(),
    amount: Joi.number().positive().required(),
    transaction_id: Joi.string().uuid().required(), // For idempotency
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { user_id, amount, transaction_id } = req.body;

  if (await isTransactionProcessed(transaction_id)) {
    return res.status(200).json({ message: "Transaction already processed" });
  }

  try {
    const result = await sequelize.transaction(async t => {
      const account = await Account.findOne({
        where: { userId: user_id },
        transaction: t,
        lock: true,
      });
      if (!account) throw new Error("Account not found");

      account.balance = (parseFloat(account.balance) + amount).toFixed(2);
      await account.save({ transaction: t });

      const tx = await Transaction.create(
        {
          id: transaction_id,
          type: "Deposit",
          amount,
          toAccountId: account.id,
          status: "Success",
        },
        { transaction: t }
      );

      return tx;
    });
    logger.info(`Deposit successful: ${result.id}`);
    res.status(201).json(result);
  } catch (err) {
    logger.error(`Deposit failed: ${err.message}`);
    next(err);
  }
};

const transfer = async (req, res, next) => {
  const schema = Joi.object({
    from_user_id: Joi.string().uuid().required(),
    to_user_id: Joi.string().uuid().required(),
    amount: Joi.number().positive().required(),
    transaction_id: Joi.string().uuid().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { from_user_id, to_user_id, amount, transaction_id } = req.body;

  if (from_user_id === to_user_id)
    return res.status(400).json({ error: "Cannot transfer to self" });
  if (await isTransactionProcessed(transaction_id)) {
    return res.status(200).json({ message: "Transaction already processed" });
  }

  try {
    const result = await sequelize.transaction(async t => {
      const fromAccount = await Account.findOne({
        where: { userId: from_user_id },
        transaction: t,
        lock: true,
      });
      const toAccount = await Account.findOne({
        where: { userId: to_user_id },
        transaction: t,
        lock: true,
      });

      if (!fromAccount || !toAccount) throw new Error("Account not found");
      if (fromAccount.balance < amount) throw new Error("Insufficient balance");

      fromAccount.balance = (parseFloat(fromAccount.balance) - amount).toFixed(
        2
      );
      toAccount.balance = (parseFloat(toAccount.balance) + amount).toFixed(2);
      await fromAccount.save({ transaction: t });
      await toAccount.save({ transaction: t });

      const tx = await Transaction.create(
        {
          id: transaction_id,
          type: "Transfer",
          amount,
          fromAccountId: fromAccount.id,
          toAccountId: toAccount.id,
          status: "Success",
        },
        { transaction: t }
      );

      return tx;
    });
    logger.info(`Transfer successful: ${result.id}`);
    res.status(201).json(result);
  } catch (err) {
    logger.error(`Transfer failed: ${err.message}`);
    if (err.message === "Insufficient balance") {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

const withdraw = async (req, res, next) => {
  const schema = Joi.object({
    user_id: Joi.string().uuid().required(),
    amount: Joi.number().positive().required(),
    transaction_id: Joi.string().uuid().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { user_id, amount, transaction_id } = req.body;

  if (await isTransactionProcessed(transaction_id)) {
    return res.status(200).json({ message: "Transaction already processed" });
  }

  try {
    const result = await sequelize.transaction(async t => {
      const account = await Account.findOne({
        where: { userId: user_id },
        transaction: t,
        lock: true,
      });
      if (!account) throw new Error("Account not found");
      if (account.balance < amount) throw new Error("Insufficient balance");

      account.balance = (parseFloat(account.balance) - amount).toFixed(2);
      await account.save({ transaction: t });

      // Simulate external system call (e.g., bank API) - assume success for prototype
      // In real: Call external API here; if fails, throw error to rollback

      const tx = await Transaction.create(
        {
          id: transaction_id,
          type: "Withdrawal",
          amount,
          fromAccountId: account.id,
          status: "Success",
        },
        { transaction: t }
      );

      return tx;
    });
    logger.info(`Withdrawal successful: ${result.id}`);
    res.status(201).json(result);
  } catch (err) {
    logger.error(`Withdrawal failed: ${err.message}`);
    if (err.message === "Insufficient balance") {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

module.exports = { deposit, transfer, withdraw };
