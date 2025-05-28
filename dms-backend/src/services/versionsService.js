const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllVersions = async () => {
  return prisma.documentVersion.findMany();
};

const getVersionById = async (id) => {
  return prisma.documentVersion.findUnique({ where: { id } });
};

const createVersion = async (data) => {
  return prisma.documentVersion.create({ data });
};

const updateVersion = async (id, data) => {
  return prisma.documentVersion.update({
    where: { id },
    data,
  });
};

const deleteVersion = async (id) => {
  return prisma.documentVersion.delete({ where: { id } });
};

module.exports = {
  getAllVersions,
  getVersionById,
  createVersion,
  updateVersion,
  deleteVersion,
};
