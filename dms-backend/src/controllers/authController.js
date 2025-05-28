// src/controllers/authController.js
const validateZod = require('../validations/validateZod');
const { loginSchema } = require('../validations/authValidation');
const usersService = require('../services/usersService');
const { compare } = require('bcryptjs');
const { signToken } = require('../utils/jwt');
const { success, error } = require('../utils/responseFormatter');

const login = {
  description: 'Login and get JWT token',
  tags: ['api', 'auth'],
  auth: false,
  validate: { payload: validateZod(loginSchema) },
  handler: async (request, h) => {
    const { username, password } = request.payload;
    try {
      const user = await usersService.getUserByUsername(username);
      if (!user) return error(h, 'Invalid credentials', 401);

      const valid = await compare(password, user.passwordHash);
      if (!valid) return error(h, 'Invalid credentials', 401);

      const token = signToken(user);
      return success(h, { token }, 'Login successful');
    } catch (err) {
      console.error(err);
      return error(h, err.message);
    }
  }
};

module.exports = { login };
