const {
  getAllVersions,
  getVersionById,
  createVersion,
  updateVersion,
  deleteVersion
} = require('../controllers/versionsController');

module.exports = [
  {
    method: 'GET',
    path: '/versions',
    options: getAllVersions
  },
  {
    method: 'GET',
    path: '/versions/{id}',
    options: getVersionById
  },
  {
    method: 'POST',
    path: '/versions',
    options: createVersion
  },
  {
    method: 'PUT',
    path: '/versions/{id}',
    options: updateVersion
  },
  {
    method: 'DELETE',
    path: '/versions/{id}',
    options: deleteVersion
  }
];
