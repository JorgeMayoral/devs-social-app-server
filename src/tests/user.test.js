const mongoose = require('mongoose');
const dotenv = require('dotenv');

const connectDB = require('../config/db');
const { User } = require('../models/User.model');
const { initialUsers } = require('../tests/helpers');

const {
  registration,
  loginUser,
  findAllUsers,
  findUserById,
  follow,
  update,
  remove,
} = require('./../services/user.service');

beforeAll(() => {
  dotenv.config();
  connectDB(process.env.MONGO_URI_TEST);
});

beforeEach(async () => {
  const user1 = new User(initialUsers[0]);
  await user1.save();

  const user2 = new User(initialUsers[1]);
  await user2.save();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('users', () => {
  test('can be registered with valid data', async () => {
    const username = 'test1';
    const name = 'Test 1';
    const email = 'test1@email.com';
    const password = '123456';

    const user = await registration(username, name, email, password);

    expect(user.username).toBe(username);
  });

  test('registration return error when using existing user data', async () => {
    const { username, name, email, password } = initialUsers[0];
    const data = await registration(username, name, email, password);

    expect(data).toHaveProperty('error');
  });

  test('can login with valid credentials', async () => {
    const userToLogIn = initialUsers[0];

    const user = await loginUser(userToLogIn.username, userToLogIn.password);

    expect(user).toHaveProperty('name', userToLogIn.name);
  });

  test('login return error with invalid credentials', async () => {
    const data = await loginUser('notExists', 'wrongPassword');

    expect(data).toHaveProperty('error');
  });

  test('can be get without returning email and password', async () => {
    const users = await findAllUsers();

    expect(users[0]).toHaveProperty('username');
    expect(users[0]).not.toHaveProperty('email');
    expect(users[0]).not.toHaveProperty('password');
  });

  test('can be find by their ID', async () => {
    const users = await findAllUsers();

    const userFoundWithId = await findUserById(users[0].id);

    expect(userFoundWithId).toEqual(users[0]);
  });

  test('can follow existing users', async () => {
    const users = await findAllUsers();
    const userFollower = users[0];
    const userToFollow = users[1];

    const data = await follow(userFollower.id, userToFollow.id);

    expect(data.followers).toContainEqual(userFollower.id);
  });

  test('can update their name and email', async () => {
    const users = await findAllUsers();
    const userToUpdate = users[0];
    const newName = 'Updated 1';
    const newEmail = 'updated1@email.com';

    const user = await update(userToUpdate.id, {
      name: newName,
      email: newEmail,
    });

    expect(user).toHaveProperty('id', userToUpdate.id);
    expect(user).toHaveProperty('name', newName);
    expect(user).toHaveProperty('email', newEmail);
  });

  test('can delete their account', async () => {
    let users = await findAllUsers();
    const lengthBeforeDelete = users.length;

    const userToDelete = users[0];
    await remove(userToDelete.id);

    users = await findAllUsers();
    const lengthAfterDelete = users.length;

    expect(lengthAfterDelete).toBe(lengthBeforeDelete - 1);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
