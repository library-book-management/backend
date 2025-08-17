const express = require('express');
const validate = require('../middlewares/validate.middleware');
const categoryController = require('../controllers/category.controller');
const categoryValidation = require('../validations/category.validation');
const { author, auth } = require('../middlewares/auth.middleware');
const { USER_ROLE_ENUM } = require('../constants');

const categoryRoute = express.Router();

categoryRoute
  .route('/')
  .post(
    auth,
    author([USER_ROLE_ENUM.ADMIN]),
    validate(categoryValidation.createCategory),
    categoryController.createCategory,
  )
  .get(
    auth,
    author([USER_ROLE_ENUM.ADMIN]),
    validate(categoryValidation.getCategories),
    categoryController.getCategories,
  );

categoryRoute.route('/bulk').post(
  auth,
  author([USER_ROLE_ENUM.ADMIN]),
  validate(categoryValidation.createCategories),
  categoryController.createCategories,
);

categoryRoute
  .route('/:categoryId')
  .get(
    auth,
    author([USER_ROLE_ENUM.ADMIN]),
    validate(categoryValidation.getCategoryById),
    categoryController.getCategoryById,
  )
  .put(
    auth,
    author([USER_ROLE_ENUM.ADMIN]),
    validate(categoryValidation.updateCategoryById),
    categoryController.updateCategoryById,
  )
  .delete(
    auth,
    author([USER_ROLE_ENUM.ADMIN]),
    validate(categoryValidation.deleteCategoryById),
    categoryController.deleteCategoryById,
  );

module.exports = categoryRoute;
