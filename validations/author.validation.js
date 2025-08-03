const Joi = require('joi');
const { objectId, phoneNumberValidate } = require('./custom.validation');

const createAuthor = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(100).required().messages({
      'any.required': 'Vui lòng nhập tên tác giả',
      'string.base': 'Tên phải là chuỗi',
      'string.min': 'Tên phải có ít nhất 2 ký tự',
      'string.max': 'Tên không được vượt quá 100 ký tự',
    }),
    email: Joi.string().required().email().messages({
      'string.email': 'Email không hợp lệ',
    }),
    phone: Joi.string().custom(phoneNumberValidate),
  }),
};

const getAuthors = {
  query: Joi.object({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    searchBy: Joi.string().valid('name', 'email', 'phone').insensitive(),
    value: Joi.string(),
  }).with('searchBy', 'value'),
};

const getAuthorById = {
  params: Joi.object({
    authorId: Joi.string().required().custom(objectId),
  }),
};

const updateAuthorById = {
  params: Joi.object({
    authorId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(100).messages({
        'string.base': 'Tên phải là chuỗi',
        'string.min': 'Tên phải có ít nhất 2 ký tự',
        'string.max': 'Tên không được vượt quá 100 ký tự',
      }),
      email: Joi.string().email().messages({
        'string.email': 'Email không hợp lệ',
      }),
      phone: Joi.string().custom(phoneNumberValidate),
    })
    .min(1)
    .messages({
      'object.min': 'Cần cung cấp ít nhất một trường để cập nhật',
    }),
};

const deleteAuthorById = {
  params: Joi.object({
    authorId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createAuthor,
  getAuthors,
  getAuthorById,
  updateAuthorById,
  deleteAuthorById,
};
