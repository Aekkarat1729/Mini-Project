// src/controllers/tagsController.js
const {
  idParamSchema,
  createTagSchema,
  updateTagSchema,
} = require("../validations/tagsValidation");
const validateZod = require("../validations/validateZod");
const tagsService = require("../services/tagsService");
const { success, created, notFound, error } = require("../utils/responseFormatter");

// Get all tags
const getAllTags = {
  description: "Get list of all tags",
  tags: ["api", "tags"],
  handler: async (request, h) => {
    try {
      const list = await tagsService.getAllTags();
      return success(h, list, "Fetched tags successfully");
    } catch (err) {
      console.error("Error fetching tags:", err);
      return error(h, err.message);
    }
  },
};

// Get tag by ID
const getTagById = {
  description: "Get a tag by ID",
  tags: ["api", "tags"],
  validate: {
    params: validateZod(idParamSchema),
  },
  handler: async (request, h) => {
    const { id } = request.params;
    try {
      const t = await tagsService.getTagById(Number(id));
      if (!t) {
        return notFound(h, "Tag not found");
      }
      return success(h, t, "Fetched tag successfully");
    } catch (err) {
      console.error("Error fetching tag:", err);
      return error(h, err.message);
    }
  },
};

// Create new tag
const createTag = {
  description: "Create a new tag",
  tags: ["api", "tags"],
  validate: {
    payload: validateZod(createTagSchema),
  },
  handler: async (request, h) => {
    try {
      const t = await tagsService.createTag(request.payload);
      return created(h, t, "Tag created successfully");
    } catch (err) {
      console.error("Error creating tag:", err);
      return error(h, err.message);
    }
  },
};

// Update existing tag
const updateTag = {
  description: "Update a tag by ID",
  tags: ["api", "tags"],
  validate: {
    params: validateZod(idParamSchema),
    payload: validateZod(updateTagSchema),
  },
  handler: async (request, h) => {
    const { id } = request.params;
    try {
      const t = await tagsService.updateTag(Number(id), request.payload);
      return success(h, t, "Tag updated successfully");
    } catch (err) {
      console.error("Error updating tag:", err);
      return error(h, err.message);
    }
  },
};

// Delete tag
const deleteTag = {
  description: "Delete a tag by ID",
  tags: ["api", "tags"],
  validate: {
    params: validateZod(idParamSchema),
  },
  handler: async (request, h) => {
    const { id } = request.params;
    try {
      const exists = await tagsService.getTagById(Number(id));
      if (!exists) {
        return notFound(h, "Tag not found");
      }
      await tagsService.deleteTag(Number(id));
      return success(h, "Tag deleted successfully");
    } catch (err) {
      console.error("Error deleting tag:", err);
      return error(h, err.message);
    }
  },
};

module.exports = {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
};
