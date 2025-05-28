const { z } = require('zod');

const idParamSchema = z.object({
  id: z.string().regex(/^[0-9]+$/, 'Invalid ID'),
});

const createTagSchema = z.object({
  name: z.string().min(1),
});

const updateTagSchema = createTagSchema.partial();

module.exports = {
  idParamSchema,
  createTagSchema,
  updateTagSchema,
};
