const {
  getAllDocumentTags,
  createDocumentTag,
  deleteDocumentTag
} = require('../controllers/documentTagsController');

module.exports = [
  {
    method: 'GET',
    path: '/document-tags',
    options: getAllDocumentTags
  },
  {
    method: 'POST',
    path: '/document-tags',
    options: createDocumentTag
  },
  {
    method: 'DELETE',
    path: '/document-tags/{documentId}/{tagId}',
    options: deleteDocumentTag
  }
];
