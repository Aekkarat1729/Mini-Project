const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllTags = async () => {
  return prisma.tag.findMany();
};

const getTagById = async (id) => {
  return prisma.tag.findUnique({ where: { id } });
};

const createTag = async (data) => {
  return prisma.tag.create({ data });
};

const updateTag = async (id, data) => {
  return prisma.tag.update({
    where: { id },
    data,
  });
};

const deleteTag = async (id) => {
  return prisma.tag.delete({ where: { id } });
};

module.exports = {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
};
