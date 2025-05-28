const {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag
} = require('../controllers/tagsController');

module.exports = [
  {
    method: 'GET',
    path: '/tags',
    options: getAllTags
  },
  {
    method: 'GET',
    path: '/tags/{id}',
    options: getTagById
  },
  {
    method: 'POST',
    path: '/tags',
    options: createTag
  },
  {
    method: 'PUT',
    path: '/tags/{id}',
    options: updateTag
  },
  {
    method: 'DELETE',
    path: '/tags/{id}',
    options: deleteTag
  }
];
