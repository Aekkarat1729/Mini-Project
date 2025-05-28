const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllDocuments = async () => {
  return prisma.document.findMany({
    where: { isDeleted: false },
  });
};

const getDocumentById = async (id) => {
  return prisma.document.findUnique({ where: { id } });
};

const createDocument = async (data) => {
  return prisma.document.create({ data });
};

const updateDocument = async (id, data) => {
  return prisma.document.update({
    where: { id },
    data,
  });
};

const deleteDocument = async (id) => {
  // soft delete
  return prisma.document.update({
    where: { id },
    data: { isDeleted: true },
  });
};

module.exports = {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
