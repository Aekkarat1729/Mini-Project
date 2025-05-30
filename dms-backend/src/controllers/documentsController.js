const {
  idParamSchema,
  createDocumentSchema,
  updateDocumentSchema,
} = require("../validations/documentsValidation");
const validateZod = require("../validations/validateZod");
const documentsService = require("../services/documentsService");
const { success, created, notFound, error } = require("../utils/responseFormatter");
const upload = require('../config/multer');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');

const getUserIdFromToken = (request) => {
  const token = request.headers.authorization?.split(' ')[1];
  if (!token) throw new Error('No token provided');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return decoded.userId || 1;
  } catch (err) {
    throw new Error('Invalid token');
  }
};

const getAllDocuments = {
  description: "Get list of all documents",
  tags: ["api", "documents"],
  handler: async (request, h) => {
    try {
      const userId = getUserIdFromToken(request);
      const { page = 1, limit = 10 } = request.query; // เพิ่มการรองรับ pagination
      const list = await documentsService.getAllDocuments(userId, Number(page), Number(limit));
      return success(h, list, "Fetched documents successfully");
    } catch (err) {
      console.error("Error fetching documents:", err);
      return error(h, err.message);
    }
  },
};

const getDocumentById = {
  description: "Get a document by ID",
  tags: ["api", "documents"],
  validate: {
    params: validateZod(idParamSchema),
  },
  handler: async (request, h) => {
    const { id } = request.params;
    const userId = getUserIdFromToken(request);
    try {
      const doc = await documentsService.getDocumentById(Number(id), userId);
      if (!doc) {
        return notFound(h, "Document not found");
      }
      return success(h, doc, "Fetched document successfully");
    } catch (err) {
      console.error("Error fetching document:", err);
      return error(h, err.message);
    }
  },
};
const createDocument = {
  description: "Create a new document",
  tags: ["api", "documents"],
  payload: {
    output: 'stream',
    parse: true,
    allow: 'multipart/form-data',
    maxBytes: 10 * 1024 * 1024,
    multipart: true,
  },
  handler: async (request, h) => {
    try {
      const { payload } = request;
      const file = payload.file;

      if (!file || !file.hapi || !file.pipe) {
        return error(h, "กรุณาแนบไฟล์ PDF");
      }

      if (!file.hapi.headers['content-type'].startsWith('application/pdf')) {
        return error(h, "กรุณาอัปโหลดไฟล์ PDF เท่านั้น");
      }

      const fileName = `${Date.now()}-${file.hapi.filename}`;
      const uploadDir = path.join(__dirname, '..', 'tmp');
      const fullFilePath = path.join(uploadDir, fileName);

      // สร้างโฟลเดอร์ tmp หากยังไม่มี
      await fs.mkdir(uploadDir, { recursive: true });

      // เขียนไฟล์ลง disk
      const fileStream = require('fs').createWriteStream(fullFilePath);
      await new Promise((resolve, reject) => {
        file.pipe(fileStream);
        file.on('end', resolve);
        file.on('error', reject);
      });

      // ดึง userId จาก token
      const userIdFromToken = getUserIdFromToken(request);

      const documentData = {
        title: payload.title || file.hapi.filename,
        description: payload.description || null,
        filePath: `tmp/${fileName}`,
        type: file.hapi.headers['content-type'],
        userId: Number(payload.userId || userIdFromToken),
        createdBy: 'user',
      };

      const d = await documentsService.createDocument(documentData);
      return created(h, d, "Document created successfully");
    } catch (err) {
      console.error("Error creating document:", err); // เพิ่มการ log
      return error(h, `Error creating document: ${err.message}`);
    }
  },
};

const updateDocument = {
  description: "Update a document by ID",
  tags: ["api", "documents"],
  validate: {
    params: validateZod(idParamSchema),
    payload: validateZod(updateDocumentSchema),
    options: {
      multipart: {
        output: 'file',
      },
    },
  },
  pre: [
    {
      method: (request, h) => {
        return new Promise((resolve, reject) => {
          upload.single('file')(request.raw.req, request.raw.res, (err) => {
            if (err) return reject(err);
            resolve(h.continue);
          });
        });
      }, assign: 'file'
    },
  ],
  handler: async (request, h) => {
    const { id } = request.params;
    const userId = getUserIdFromToken(request);
    const { description, userId: payloadUserId } = request.payload;
    const file = request.payload.file;

    try {
      const existingDoc = await documentsService.getDocumentById(Number(id), gotUserId);
      if (!existingDoc) {
        return notFound(h, "Document not found");
      }

      let fileName = existingDoc.filePath;
      let title = existingDoc.title;
      if (file) {
        if (!file.mimetype.startsWith('application/pdf')) {
          return error(h, "กรุณาอัปโหลดไฟล์ PDF เท่านั้น");
        }

        if (existingDoc.filePath) {
          const oldFilePath = path.join('/tmp', existingDoc.filePath);
          try {
            await fs.unlink(oldFilePath);
          } catch (err) {
            if (err.code !== 'ENOENT') {
              console.warn(`Failed to delete old file ${oldFilePath}:`, err);
            }
          }
        }

        fileName = `${Date.now()}-${file.originalname}`;
        const newFilePath = path.join('/tmp', fileName);
        await fs.writeFile(newFilePath, file.buffer);
        title = file.originalname;
      }

      const documentData = {
        title: title,
        description: description || null,
        filePath: fileName,
        type: file ? file.mimetype : existingDoc.type,
        userId: payloadUserId || userId,
        createdBy: 'user',
      };

      const d = await documentsService.updateDocument(Number(id), documentData, userId);
      return success(h, d, "Document updated successfully");
    } catch (err) {
      console.error("Error updating document:", err);
      return error(h, `Error updating document: ${err.message}`);
    }
  },
};

const deleteDocument = {
  description: "Delete a document by ID",
  tags: ["api", "documents"],
  validate: {
    params: validateZod(idParamSchema),
  },
  handler: async (request, h) => {
    const { id } = request.params;
    const userId = getUserIdFromToken(request);
    try {
      const existingDoc = await documentsService.getDocumentById(Number(id), userId);
      if (!existingDoc) {
        return notFound(h, "Document not found");
      }

      if (existingDoc.filePath) {
        const filePath = path.join('/tmp', existingDoc.filePath);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          if (err.code !== 'ENOENT') {
            console.warn(`Failed to delete file ${filePath}:`, err);
          }
        }
      }

      await documentsService.deleteDocument(Number(id), userId);
      return success(h, "Document deleted successfully");
    } catch (err) {
      console.error("Error deleting document:", err);
      return error(h, `Error deleting document: ${err.message}`);
    }
  },
};

const getDocumentFile = {
  description: "Download a document file by ID",
  tags: ["api", "documents"],
  validate: {
    params: validateZod(idParamSchema),
  },
  handler: async (request, h) => {
    const { id } = request.params;
    const userId = getUserIdFromToken(request);
    try {
      const doc = await documentsService.getDocumentById(Number(id), userId);
      if (!doc) {
        return notFound(h, "Document not found");
      }

      const filePath = path.join(__dirname, '..', doc.filePath);
      const fileContent = await fs.readFile(filePath);
      return h.response(fileContent)
        .type('application/pdf')
        .header('Content-Disposition', `attachment; filename="${doc.title}"`);
    } catch (err) {
      console.error("Error downloading document:", err);
      return error(h, `Error downloading document: ${err.message}`);
    }
  },
};

module.exports = {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocumentFile,
};