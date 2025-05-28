const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllUsers = async () => {
  return prisma.user.findMany();
};

const getUserById = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};

const createUser = async (data) => {
  return prisma.user.create({ data });
};

const updateUser = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

const deleteUser = async (id) => {
  return prisma.user.delete({ where: { id } });
};

const getUserByUsername = async (username) => {
  return prisma.user.findUnique({ where: { username } });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByUsername
};
