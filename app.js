require("express-async-errors");
const express = require("express");
const cors = require("cors");
const errorHandler = require("./handlers/errorHandler");
const mongoose = require("mongoose");
const userRoutes = require("./modules/users/users.routes");
const transactionRoutes = require("./modules/transactions/transactions.routes");
require("dotenv").config();

// Connection to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection to MongoDB successful!!");
  })
  .catch((err) => {
    console.error("Connection to MongoDB failed:", err);
    process.exit(1); // Exit the process if unable to connect to the database
  });

require("./models/users.model");
require("./models/transactions.model");

// Express
const app = express();

// Cors
app.use(cors());

// Express to read JSON
app.use(express.json());

// Root route for health checks
app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

// 404 handler
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "failed",
    message: "Error 404 not found",
  });
});

// Error handler
app.use(errorHandler);

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started successfully on port ${port}`);
});
