// src/routes/auth.js
const { login } = require('../controllers/authController');

module.exports = [
  {
    method: 'POST',
    path: '/auth/login',
    options: login
  }
];
