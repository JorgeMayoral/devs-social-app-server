const dotenv = require('dotenv');

// DB Config
const connectDB = require('../config/db');

// Model
const { User } = require('../models/User.model');

// Data
const seedData = require('./seed_users.json');

async function saveUser(userData) {
  console.log(`Creating user ${userData.username}...`);
  const user = await User.create(userData);
  console.log(`Created user ${userData.username} with id ${user._id}.`);
}

async function main() {
  console.log('Connecting to database...');

  dotenv.config();
  connectDB(process.env.MONGO_URI);

  console.log('Seeding database with users...');

  for (let user of seedData) {
    await saveUser(user);
  }

  console.log('All users has been created!');

  process.exit(0);
}

main();
