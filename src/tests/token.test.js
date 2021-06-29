const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { generateToken, validateToken } = require('../utils/jwt');

beforeAll(() => dotenv.config());

describe('generateToken', () => {
  test('return null if no user data is provided', () => {
    expect(generateToken()).toBeNull();
  });

  test('return a valid token when user data is provided', () => {
    const token = generateToken(1, 'testUser');
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    expect(decoded).toHaveProperty('id');
    expect(decoded).toHaveProperty('username');
    expect(decoded).toHaveProperty('iat');
    expect(decoded).toHaveProperty('exp');
  });
});

describe('validateToken', () => {
  test('return user data when the token is valid', () => {
    const data = { id: 1, username: 'testUser' };
    const token = generateToken(data.id, data.username);
    const decoded = validateToken(token);
    expect(decoded.id).toBe(data.id);
    expect(decoded.username).toBe(data.username);
  });

  test('return error when the token is not valid', () => {
    const token = 'invalidToken';
    const decoded = validateToken(token);
    expect(decoded).toHaveProperty('error');
  });
});
