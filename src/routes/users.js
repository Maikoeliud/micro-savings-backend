const express = require("express");
const {
  createUser,
  getAllUsers,
  getBalance,
  getTransactions,
  getSystemStats,
  getAllTransactions,
} = require("../controllers/userController");

const router = express.Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/balance/:user_id", getBalance);
router.get("/transactions/:user_id", getTransactions);
router.get("/stats", getSystemStats);
router.get("/all-transactions", getAllTransactions);

module.exports = router;
