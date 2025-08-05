const mongoose = require('mongoose');
const { USER_ROLE_ENUM } = require('../constants');
const Schema = mongoose.Schema;
require('../constants');

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: USER_ROLE_ENUM,
      required: true,
      default: 'user',
    },
    address: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('User', UserSchema);
