const mongoose = require('mongoose');

const Logger = require('../utils/logger');

const connectDB = async (mongoUri) => {
  try {
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    Logger.debug(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    Logger.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
