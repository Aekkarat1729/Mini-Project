const { z } = require('zod');

const createDocumentTagSchema = z.object({
  documentId: z.number(),
  tagId: z.number(),
});

const idParamSchema = z.object({
  documentId: z.string().regex(/^[0-9]+$/, 'Invalid documentId'),
  tagId: z.string().regex(/^[0-9]+$/, 'Invalid tagId'),
});

module.exports = {
  idParamSchema,
  createDocumentTagSchema,
};
