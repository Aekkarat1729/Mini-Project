const { z } = require('zod');

const idParamSchema = z.object({
  id: z.string().regex(/^[0-9]+$/, 'Invalid ID'),
});

module.exports = {
  idParamSchema,
};
