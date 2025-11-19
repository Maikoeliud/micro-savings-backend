const express = require("express");
const {
  deposit,
  transfer,
  withdraw,
} = require("../controllers/transactionController");

const router = express.Router();

router.post("/deposit", deposit);
router.post("/transfer", transfer);
router.post("/withdraw", withdraw);

module.exports = router;
