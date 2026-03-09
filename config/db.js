// config/db.js
const mongoose = require('mongoose');

// connectDB is an async function because mongoose.connect() returns a Promise
async function connectDB() {
  try {
    // process.env.MONGO_URI reads the value from your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If the connection fails, log the error and exit the process
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
