const jwt = require('jsonwebtoken');

function generateToken(id, username) {
  console.log(id, username);
  if (id === undefined || username === undefined) {
    return null;
  }

  const secret = process.env.JWT_SECRET_KEY;
  const expirationDate = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365; // Token expires in 1 year
  const payload = {
    id: id,
    username: username,
    exp: expirationDate,
  };
  const token = jwt.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const secret = process.env.JWT_SECRET_KEY;
  let data;
  try {
    data = jwt.verify(token, secret);
  } catch (err) {
    throw new Error('Token verification failed');
  }

  return data;
}

module.exports = { generateToken, validateToken };
