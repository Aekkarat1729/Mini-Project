const { z } = require('zod');

const idParamSchema = z.object({
  id: z.string().regex(/^[0-9]+$/, 'Invalid ID'),
});

const createDocumentSchema = z.object({
  title: z.string().min(1),
  type: z.string().min(1),
  description: z.string().optional(),
  filePath: z.string().optional(),
  userId: z.number(),
  createdBy: z.string().optional(),
});

const updateDocumentSchema = createDocumentSchema.partial();

module.exports = {
  idParamSchema,
  createDocumentSchema,
  updateDocumentSchema,
};
