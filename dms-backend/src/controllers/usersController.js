// src/controllers/usersController.js
const bcrypt = require('bcryptjs');
const {
  idParamSchema,
  createUserSchema,
  updateUserSchema,
} = require("../validations/usersValidation");
const validateZod = require("../validations/validateZod");
const usersService = require("../services/usersService");
const { success, created, notFound, error } = require("../utils/responseFormatter");

// Get all users
const getAllUsers = {
  auth: 'jwt',
  description: "Get list of all users",
  tags: ["api", "users"],
  handler: async (request, h) => {
    try {
      const list = await usersService.getAllUsers();
      return success(h, list, "Fetched users successfully");
    } catch (err) {
      console.error("Error fetching users:", err);
      return error(h, err.message);
    }
  },
};

// Get user by ID
const getUserById = {
  auth: 'jwt',
  description: "Get a user by ID",
  tags: ["api", "users"],
  validate: {
    params: validateZod(idParamSchema),
  },
  handler: async (request, h) => {
    const { id } = request.params;
    try {
      const user = await usersService.getUserById(Number(id));
      if (!user) {
        return notFound(h, "User not found");
      }
      return success(h, user, "Fetched user successfully");
    } catch (err) {
      console.error("Error fetching user:", err);
      return error(h, err.message);
    }
  },
};

// Create new user
const createUser = {
  auth: false,
  description: "Create a new user",
  tags: ["api", "users"],
  validate: {
    payload: validateZod(createUserSchema),
  },
  handler: async (request, h) => {
    try {
      // ดึงข้อมูลจาก payload
      const { username, password, email, role } = request.payload;
      // hash รหัสผ่าน
      const passwordHash = await bcrypt.hash(password, 10);
      // สร้างผู้ใช้ใหม่
      const u = await usersService.createUser({ username, passwordHash, email, role });
      return created(h, u, "User created successfully");
    } catch (err) {
      console.error("Error creating user:", err);
      return error(h, err.message);
    }
  },
};

// Update existing user
const updateUser = {
  auth: 'jwt',
  description: "Update a user by ID",
  tags: ["api", "users"],
  validate: {
    params: validateZod(idParamSchema),
    payload: validateZod(updateUserSchema),
  },
  handler: async (request, h) => {
    const { id } = request.params;
    try {
      // เตรียม data สำหรับอัปเดต
      const data = { ...request.payload };
      if (data.password) {
        data.passwordHash = await bcrypt.hash(data.password, 10);
        delete data.password;
      }
      const u = await usersService.updateUser(Number(id), data);
      return success(h, u, "User updated successfully");
    } catch (err) {
      console.error("Error updating user:", err);
      return error(h, err.message);
    }
  },
};

// Delete user
const deleteUser = {
  auth: 'jwt',
  description: "Delete a user by ID",
  tags: ["api", "users"],
  validate: {
    params: validateZod(idParamSchema),
  },
  handler: async (request, h) => {
    const { id } = request.params;
    try {
      const exists = await usersService.getUserById(Number(id));
      if (!exists) {
        return notFound(h, "User not found");
      }
      await usersService.deleteUser(Number(id));
      return success(h, "User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      return error(h, err.message);
    }
  },
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
