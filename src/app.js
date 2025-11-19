const express = require("express");
const userRoutes = require("./routes/users");
const transactionRoutes = require("./routes/transactions");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(express.json());

app.use("/users", userRoutes);
app.use("/transactions", transactionRoutes);

app.use(errorHandler); // Must be last

module.exports = app;
