/**
 * Central error handler. Logs and returns a standardized Error object.
 */
const logger = require('./logger');

function handleError(err) {
  logger.error(err.message, err.stack);
  const error = new Error(err.message || 'Internal server error');
  error.statusCode = err.statusCode || 500;
  return error;
}

module.exports = { handleError };
