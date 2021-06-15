const supertest = require('supertest');
const { app } = require('../server');

const api = supertest(app);

const initialUsers = [
  {
    username: 'example1',
    name: 'User Example 1',
    email: 'example1@example.com',
    password: 'test1234',
  },
  {
    username: 'exmaple2',
    name: 'User Example 2',
    email: 'example2@example.com',
    password: 'test1234',
  },
];

const getAllUsernamesFromUsers = async () => {
  const response = await api.get('/api/v1/user/all');
  return response.body.map((u) => u.username);
};

module.exports = { api, initialUsers, getAllUsernamesFromUsers };
