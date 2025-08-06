const Joi = require('joi');

const getUserQuerySchema = Joi.object({
  email: Joi.string().email(),
  address: Joi.string(),
  name: Joi.string(),
});

module.exports = {
  getUserQuerySchema,
};
