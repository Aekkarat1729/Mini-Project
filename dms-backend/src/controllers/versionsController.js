// src/controllers/versionsController.js
const {
  idParamSchema,
  createVersionSchema,
  updateVersionSchema,
} = require("../validations/versionsValidation");
const validateZod = require("../validations/validateZod");
const versionsService = require("../services/versionsService");
const { success, created, notFound, error } = require("../utils/responseFormatter");

// Get all versions
const getAllVersions = {
  description: "Get list of all document versions",
  tags: ["api", "versions"],
  handler: async (request, h) => {
    try {
      const list = await versionsService.getAllVersions();
      return success(h, list, "Fetched versions successfully");
    } catch (err) {
      console.error("Error fetching versions:", err);
      return error(h, err.message);
    }
  },
};

// Get version by ID
const getVersionById = {
  description: "Get a version by ID",
  tags: ["api", "versions"],
  validate: {
    params: validateZod(idParamSchema),
  },
  handler: async (request, h) => {
    const { id } = request.params;
    try {
      const v = await versionsService.getVersionById(Number(id));
      if (!v) {
        return notFound(h, "Version not found");
      }
      return success(h, v, "Fetched version successfully");
    } catch (err) {
      console.error("Error fetching version:", err);
      return error(h, err.message);
    }
  },
};

// Create new version
const createVersion = {
  description: "Create a new document version",
  tags: ["api", "versions"],
  validate: {
    payload: validateZod(createVersionSchema),
  },
  handler: async (request, h) => {
    try {
      const v = await versionsService.createVersion(request.payload);
      return created(h, v, "Version created successfully");
    } catch (err) {
      console.error("Error creating version:", err);
      return error(h, err.message);
    }
  },
};

// Update existing version
const updateVersion = {
  description: "Update a version by ID",
  tags: ["api", "versions"],
  validate: {
    params: validateZod(idParamSchema),
    payload: validateZod(updateVersionSchema),
  },
  handler: async (request, h) => {
    const { id } = request.params;
    try {
      const v = await versionsService.updateVersion(Number(id), request.payload);
      return success(h, v, "Version updated successfully");
    } catch (err) {
      console.error("Error updating version:", err);
      return error(h, err.message);
    }
  },
};

// Delete version
const deleteVersion = {
  description: "Delete a version by ID",
  tags: ["api", "versions"],
  validate: {
    params: validateZod(idParamSchema),
  },
  handler: async (request, h) => {
    const { id } = request.params;
    try {
      const exists = await versionsService.getVersionById(Number(id));
      if (!exists) {
        return notFound(h, "Version not found");
      }
      await versionsService.deleteVersion(Number(id));
      return success(h, "Version deleted successfully");
    } catch (err) {
      console.error("Error deleting version:", err);
      return error(h, err.message);
    }
  },
};

module.exports = {
  getAllVersions,
  getVersionById,
  createVersion,
  updateVersion,
  deleteVersion,
};
