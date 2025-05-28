const {
  getAllAuditLogs,
  getAuditLogById
} = require('../controllers/auditLogsController');

module.exports = [
  {
    method: 'GET',
    path: '/audit-logs',
    options: getAllAuditLogs
  },
  {
    method: 'GET',
    path: '/audit-logs/{id}',
    options: getAuditLogById
  }
];
