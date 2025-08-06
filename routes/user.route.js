const express = require('express');
const validate = require('../middlewares/validate.middleware');
require('../constants/index');

const router = express.Router();

const userController = require('../controllers/user.controller');
const { auth, author } = require('../middlewares/auth.middleware');
const { USER_ROLE_ENUM } = require('../constants');

router
  .get('/', auth, author(USER_ROLE_ENUM.ADMIN), userController.getUserByConditions)
  .get('/:userId', auth, author(USER_ROLE_ENUM.ADMIN), userController.getUserById)
  .put('/:userId', auth, author(USER_ROLE_ENUM.ADMIN), userController.updateUserById)
  .delete('/:userId', auth, author(USER_ROLE_ENUM.ADMIN), userController.deleteUserById)
  .delete('/', auth, author(USER_ROLE_ENUM.ADMIN), userController.deleteAllUsers);
module.exports = router;
