const express = require("express");
const {
  createUser,
  getBalance,
  getTransactions,
} = require("../controllers/userController");

const router = express.Router();

router.post("/", createUser);
router.get("/balance/:user_id", getBalance);
router.get("/transactions/:user_id", getTransactions);

module.exports = router;
