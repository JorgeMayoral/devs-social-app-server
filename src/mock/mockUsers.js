const dotenv = require('dotenv');

// DB Config
const connectDB = require('../config/db');

// Model
const { User } = require('../models/User.model');

// Data
const mockData = require('./mock_users.json');

async function saveUser(userData) {
  console.log(`Creating user ${userData.username}...`);
  const user = await User.create(userData);
  console.log(`Created user ${userData.username} with id ${user._id}.`);
}

async function main() {
  console.log('Connecting to database...');

  dotenv.config();
  connectDB(process.env.MONGO_URI);

  console.log('Mocking data...');

  for (let user of mockData) {
    await saveUser(user);
  }

  console.log('All mock users has been created!');

  process.exit(0);
}

main();
