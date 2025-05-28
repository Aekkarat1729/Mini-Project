// src/controllers/documentsController.js
const {
  idParamSchema,
  createDocumentSchema,
  updateDocumentSchema,
} = require("../validations/documentsValidation");
const validateZod = require("../validations/validateZod");
const documentsService = require("../services/documentsService");
const { success, created, notFound, error } = require("../utils/responseFormatter");

// Get all documents
const getAllDocuments = {
  description: "Get list of all documents",
  tags: ["api", "documents"],
  handler: async (request, h) => {
    try {
      const list = await documentsService.getAllDocuments();
      return success(h, list, "Fetched documents successfully");
    } catch (err) {
      console.error("Error fetching documents:", err);
      return error(h, err.message);
    }
  },
};

// Get document by ID
const getDocumentById = {
  description: "Get a document by ID",
  tags: ["api", "documents"],
  validate: {
    params: validateZod(idParamSchema),
  },
  handler: async (request, h) => {
    const { id } = request.params;
    try {
      const doc = await documentsService.getDocumentById(Number(id));
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

// Create new document
const createDocument = {
  description: "Create a new document",
  tags: ["api", "documents"],
  validate: {
    payload: validateZod(createDocumentSchema),
  },
  handler: async (request, h) => {
    try {
      const d = await documentsService.createDocument(request.payload);
      return created(h, d, "Document created successfully");
    } catch (err) {
      console.error("Error creating document:", err);
      return error(h, err.message);
    }
  },
};

// Update existing document
const updateDocument = {
  description: "Update a document by ID",
  tags: ["api", "documents"],
  validate: {
    params: validateZod(idParamSchema),
    payload: validateZod(updateDocumentSchema),
  },
  handler: async (request, h) => {
    const { id } = request.params;
    try {
      const d = await documentsService.updateDocument(Number(id), request.payload);
      return success(h, d, "Document updated successfully");
    } catch (err) {
      console.error("Error updating document:", err);
      return error(h, err.message);
    }
  },
};

// Delete document
const deleteDocument = {
  description: "Delete a document by ID",
  tags: ["api", "documents"],
  validate: {
    params: validateZod(idParamSchema),
  },
  handler: async (request, h) => {
    const { id } = request.params;
    try {
      const exists = await documentsService.getDocumentById(Number(id));
      if (!exists) {
        return notFound(h, "Document not found");
      }
      await documentsService.deleteDocument(Number(id));
      return success(h, "Document deleted successfully");
    } catch (err) {
      console.error("Error deleting document:", err);
      return error(h, err.message);
    }
  },
};

module.exports = {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
