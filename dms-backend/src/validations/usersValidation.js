// src/validations/usersValidation.js
const { z } = require('zod');

const idParamSchema = z.object({
  id: z.string().regex(/^[0-9]+$/, 'Invalid ID'),
});

const createUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),    // รับเป็น plain-text password
  email: z.string().email().optional(),
  role: z.enum(['ADMIN', 'USER']).optional(),
});

// สำหรับอัปเดต ให้เลือกอัปเดตได้เป็นบางฟิลด์
const updateUserSchema = createUserSchema.partial();

module.exports = {
  idParamSchema,
  createUserSchema,
  updateUserSchema,
};
