require("dotenv").config();
const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_URI;

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB successfully");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Connection to MongoDB failed", err);
  });
