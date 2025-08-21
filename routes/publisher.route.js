const express = require('express');
const validate = require('../middlewares/validate.middleware');
const publisherController = require('../controllers/publisher.controller');
const publisherValidation = require('../validations/publisher.validation');
const { author, auth } = require('../middlewares/auth.middleware');
const { USER_ROLE_ENUM } = require('../constants');

const publisherRoute = express.Router();

publisherRoute
  .route('/')
  .post(
    auth,
    author([USER_ROLE_ENUM.ADMIN]),
    validate(publisherValidation.createPublisher),
    publisherController.createPublisher,
  )
  .get(
    auth,
    author([USER_ROLE_ENUM.ADMIN]),
    validate(publisherValidation.getPublishers),
    publisherController.getPublishers,
  );

publisherRoute
  .route('/:publisherId')
  .get(
    auth,
    author([USER_ROLE_ENUM.ADMIN]),
    validate(publisherValidation.getPublisherById),
    publisherController.getPublisherById,
  )
  .put(
    auth,
    author([USER_ROLE_ENUM.ADMIN]),
    validate(publisherValidation.updatePublisherById),
    publisherController.updatePublisherById,
  )
  .delete(
    auth,
    author([USER_ROLE_ENUM.ADMIN]),
    validate(publisherValidation.deletePublisherById),
    publisherController.deletePublisherById,
  );

module.exports = publisherRoute;
