// src/services/documentsService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllDocuments = async (userId) => {
  return await prisma.document.findMany({
    where: { userId, isDeleted: false },
    select: {
      id: true,
      title: true,
      description: true,
      filePath: true,
      createdAt: true,
    },
  });
};

const getDocumentById = async (id, userId) => {
  return await prisma.document.findFirst({
    where: { id, userId, isDeleted: false },
  });
};

// documentsService.js
const createDocument = async (documentData) => {
  try {
    // ตัวอย่าง: ใช้ Prisma หรือ ORM อื่นๆ
    const newDocument = await db.documents.create({
      data: documentData,
    });
    return newDocument;
  } catch (err) {
    console.error('Database error in createDocument:', err);
    throw new Error('Failed to create document in database');
  }
};

const updateDocument = async (id, data, userId) => {
  return await prisma.document.update({
    where: { id, userId },
    data,
  });
};

const deleteDocument = async (id, userId) => {
  return await prisma.document.update({
    where: { id, userId },
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