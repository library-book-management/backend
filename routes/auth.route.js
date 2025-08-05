const express = require('express');
const router = express.Router();

const validate = require('../middlewares/validate.middleware');
const authController = require('../controllers/auth.controller');
const authValidation = require('../validations/auth.validation');

router
  .post('/login', validate(authValidation.auth), authController.login)
  .post('/register', validate(authValidation.auth), authController.register);

module.exports = router;
