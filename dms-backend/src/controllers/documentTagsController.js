// src/controllers/documentTagsController.js
const {
  idParamSchema,
  createDocumentTagSchema,
} = require("../validations/documentTagsValidation");
const validateZod = require("../validations/validateZod");
const documentTagsService = require("../services/documentTagsService");
const { success, created, notFound, error } = require("../utils/responseFormatter");

// Get all document–tag relations
const getAllDocumentTags = {
  description: "Get all document–tag relations",
  tags: ["api", "documentTags"],
  handler: async (request, h) => {
    try {
      const list = await documentTagsService.getAllDocumentTags();
      return success(h, list, "Fetched document–tag relations successfully");
    } catch (err) {
      console.error("Error fetching relations:", err);
      return error(h, err.message);
    }
  },
};

// Create a document–tag relation
const createDocumentTag = {
  description: "Tag a document",
  tags: ["api", "documentTags"],
  validate: {
    payload: validateZod(createDocumentTagSchema),
  },
  handler: async (request, h) => {
    try {
      const rel = await documentTagsService.createDocumentTag(request.payload);
      return created(h, rel, "Document tagged successfully");
    } catch (err) {
      console.error("Error tagging document:", err);
      return error(h, err.message);
    }
  },
};

// Delete a document–tag relation
const deleteDocumentTag = {
  description: "Remove tag from document",
  tags: ["api", "documentTags"],
  validate: {
    params: validateZod(idParamSchema),
  },
  handler: async (request, h) => {
    const { documentId, tagId } = request.params;
    try {
      const exists = await documentTagsService.getDocumentTagById({ documentId: Number(documentId), tagId: Number(tagId) });
      if (!exists) {
        return notFound(h, "Relation not found");
      }
      await documentTagsService.deleteDocumentTag({ documentId: Number(documentId), tagId: Number(tagId) });
      return success(h, "Tag removed from document successfully");
    } catch (err) {
      console.error("Error removing tag:", err);
      return error(h, err.message);
    }
  },
};

module.exports = {
  getAllDocumentTags,
  createDocumentTag,
  deleteDocumentTag,
};
