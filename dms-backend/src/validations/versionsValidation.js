const { z } = require('zod');

const idParamSchema = z.object({
  id: z.string().regex(/^[0-9]+$/, 'Invalid ID'),
});

const createVersionSchema = z.object({
  documentId: z.number(),
  versionNumber: z.string().min(1),
  filePath: z.string().min(1),
});

const updateVersionSchema = createVersionSchema.partial();

module.exports = {
  idParamSchema,
  createVersionSchema,
  updateVersionSchema,
};
