/**
 * Helpers to build consistent HTTP responses.
 */

const success = (h, data, message = 'OK') => {
  return h.response({
    status: 'success',
    message,
    data,
  }).code(200);
};

const created = (h, data, message = 'Created') => {
  return h.response({
    status: 'success',
    message,
    data,
  }).code(201);
};

const notFound = (h, message = 'Not Found') => {
  return h.response({
    status: 'fail',
    message,
  }).code(404);
};

const error = (h, message = 'Internal Server Error') => {
  return h.response({
    status: 'error',
    message,
  }).code(500);
};

module.exports = {
  success,
  created,
  notFound,
  error,
};
