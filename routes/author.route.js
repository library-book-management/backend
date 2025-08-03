const express = require('express');
const validate = require('../middlewares/validate.middleware');
const authorController = require('../controllers/author.controller');
const authorValidation = require('../validations/author.validation');
// const { auth, author } = require('../middlewares/auth.middleware');
// const { USER_ROLE_ENUM } = require('../constants');

const authorRoute = express.Router();

authorRoute
  .route('/')
  .post(
    // auth,
    // author([USER_ROLE_ENUM.ADMIN]),
    validate(authorValidation.createAuthor),
    authorController.createAuthor,
  )
  .get(
    // auth,
    // author([USER_ROLE_ENUM.ADMIN]),
    validate(authorValidation.getAuthors),
    authorController.getAuthors,
  );

authorRoute
  .route('/:authorId')
  .get(
    // auth,
    // author([USER_ROLE_ENUM.ADMIN]),
    validate(authorValidation.getAuthorById),
    authorController.getAuthorById,
  )
  .put(
    // auth,
    // author([USER_ROLE_ENUM.ADMIN]),
    validate(authorValidation.updateAuthorById),
    authorController.updateAuthorById,
  )
  .delete(
    // auth,
    // author([USER_ROLE_ENUM.ADMIN]),
    validate(authorValidation.deleteAuthorById),
    authorController.deleteAuthorById,
  );

module.exports = authorRoute;
