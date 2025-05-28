const {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument
} = require('../controllers/documentsController');

module.exports = [
  {
    method: 'GET',
    path: '/documents',
    options: getAllDocuments
  },
  {
    method: 'GET',
    path: '/documents/{id}',
    options: getDocumentById
  },
  {
    method: 'POST',
    path: '/documents',
    options: createDocument
  },
  {
    method: 'PUT',
    path: '/documents/{id}',
    options: updateDocument
  },
  {
    method: 'DELETE',
    path: '/documents/{id}',
    options: deleteDocument
  }
];
