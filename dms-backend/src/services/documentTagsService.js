const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllDocumentTags = async () => {
  return prisma.documentTag.findMany();
};

const createDocumentTag = async (data) => {
  // data = { documentId: Int, tagId: Int }
  return prisma.documentTag.create({ data });
};

const getDocumentTagById = async ({ documentId, tagId }) => {
  return prisma.documentTag.findUnique({
    where: {
      documentId_tagId: { documentId, tagId }
    }
  });
};

const deleteDocumentTag = async ({ documentId, tagId }) => {
  return prisma.documentTag.delete({
    where: {
      documentId_tagId: { documentId, tagId }
    }
  });
};

module.exports = {
  getAllDocumentTags,
  createDocumentTag,
  getDocumentTagById,
  deleteDocumentTag,
};
