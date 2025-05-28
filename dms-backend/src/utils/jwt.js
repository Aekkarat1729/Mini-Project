// src/utils/jwt.js
const Jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

function signToken(user) {
  const payload = { id: user.id, username: user.username, role: user.role };
  return Jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '1h' });
}

module.exports = { signToken };
