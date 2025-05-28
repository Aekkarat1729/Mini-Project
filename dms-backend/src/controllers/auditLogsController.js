// src/controllers/auditLogsController.js
const { idParamSchema } = require("../validations/auditLogsValidation");
const validateZod = require("../validations/validateZod");
const auditLogsService = require("../services/auditLogsService");
const { success, notFound, error } = require("../utils/responseFormatter");

// Get all audit logs
const getAllAuditLogs = {
  description: "Get list of all audit logs",
  tags: ["api", "auditLogs"],
  handler: async (request, h) => {
    try {
      const list = await auditLogsService.getAllAuditLogs();
      return success(h, list, "Fetched audit logs successfully");
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      return error(h, err.message);
    }
  },
};

// Get audit log by ID
const getAuditLogById = {
  description: "Get an audit log by ID",
  tags: ["api", "auditLogs"],
  validate: {
    params: validateZod(idParamSchema),
  },
  handler: async (request, h) => {
    const { id } = request.params;
    try {
      const log = await auditLogsService.getAuditLogById(Number(id));
      if (!log) {
        return notFound(h, "Audit log not found");
      }
      return success(h, log, "Fetched audit log successfully");
    } catch (err) {
      console.error("Error fetching audit log:", err);
      return error(h, err.message);
    }
  },
};

module.exports = {
  getAllAuditLogs,
  getAuditLogById,
};
