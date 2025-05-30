// src/validations/documentsValidation.js
const { z } = require('zod');

const createDocumentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  userId: z.number().optional(),
}).passthrough(); // อนุญาตฟิลด์อื่น ๆ เช่น file

const updateDocumentSchema = z.object({
  description: z.string().optional(),
  userId: z.number().optional(),
}).passthrough(); // อนุญาตฟิลด์อื่น ๆ เช่น file

const idParamSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val) && val > 0, {
    message: "ID must be a positive number",
  }),
});

module.exports = { createDocumentSchema, updateDocumentSchema, idParamSchema };