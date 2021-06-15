const mongoose = require('mongoose');
const { server } = require('../server');
const { User } = require('../models/User.model');
const {
  api,
  initialUsers,
  getAllUsernamesFromUsers,
} = require('../tests/helpers');

beforeEach(async () => {
  await User.deleteMany({});

  const user1 = new User(initialUsers[0]);
  await user1.save();

  const user2 = new User(initialUsers[1]);
  await user2.save();
});

describe('users', () => {
  test('are returned as json', async () => {
    await api
      .get('/api/v1/user/all')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test(`there are ${initialUsers.length} users`, async () => {
    const response = await api.get('/api/v1/user/all');
    expect(response.body).toHaveLength(initialUsers.length);
  });

  test('should return user with username example1', async () => {
    const usernames = await getAllUsernamesFromUsers();
    expect(usernames).toContain('example1');
  });

  test('a valid user can be registered', async () => {
    const newUser = {
      username: 'example3',
      name: 'User Example 3',
      email: 'example3@example.com',
      password: 'test1234',
    };

    await api
      .post('/api/v1/user')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usernames = await getAllUsernamesFromUsers();
    expect(usernames).toContain('example3');
  });

  test('a user without username can not be registered', async () => {
    const newUser = {
      name: 'User Example 3',
      email: 'example3@example.com',
      password: 'test1234',
    };

    await api.post('/api/v1/user').send(newUser).expect(500);
    const response = await api.get('/api/v1/user/all');
    expect(response.body).toHaveLength(initialUsers.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
