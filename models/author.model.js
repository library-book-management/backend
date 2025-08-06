const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const authorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
  },
  { timestamps: true, strict: true },
);

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
