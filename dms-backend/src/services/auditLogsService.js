const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllAuditLogs = async () => {
  return prisma.auditLog.findMany();
};

const getAuditLogById = async (id) => {
  return prisma.auditLog.findUnique({ where: { id } });
};

module.exports = {
  getAllAuditLogs,
  getAuditLogById,
};
