const express = require('express');
const validate = require('../middlewares/validate.middleware');
const bookController = require('../controllers/book.controller');
const bookValidation = require('../validations/book.validation');

const bookRoute = express.Router();

bookRoute
  .route('/')
  .post(validate(bookValidation.createBookSchema), bookController.createBook)
  .get(bookController.getAllBooks);

bookRoute
  .route('/:bookId')
  .get(bookController.getBookById)
  .put(validate(bookValidation.updateBookSchema), bookController.updateBook)
  .delete(bookController.deleteBook);

module.exports = bookRoute;
