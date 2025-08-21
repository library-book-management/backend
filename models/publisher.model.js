const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const publisherSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true, strict: true },
);

const Publisher = mongoose.model('Publisher', publisherSchema);

module.exports = Publisher;
