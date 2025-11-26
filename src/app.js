// import cors from "cors";
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");
const transactionRoutes = require("./routes/transactions");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://micro-savings-frontend.vercel.app/",
    ], // Allow requests from this origin (adjust if your frontend port changes)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);
app.use(express.json());

app.use("/users", userRoutes);
app.use("/transactions", transactionRoutes);

// Enable CORS for your frontend origin

app.use(errorHandler); // Must be last

module.exports = app;
