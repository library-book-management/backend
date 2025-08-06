const Joi = require('joi');

const createBook = {
  body: Joi.object().keys({
    title: Joi.string().required().messages({
      'any.required': 'Vui lòng nhập tên sách',
      'string.base': 'Tên sách phải là chuỗi ký tự',
    }),
    author_id: Joi.alternatives()
      .try(Joi.string(), Joi.array().items(Joi.string()))
      .required()
      .messages({
        'any.required': 'Vui lòng nhập tác giả',
      }),
    category_id: Joi.string().required().messages({
      'any.required': 'Vui lòng nhập thể loại',
    }),
    publisher_id: Joi.alternatives()
      .try(Joi.string(), Joi.array().items(Joi.string()))
      .required()
      .messages({
        'any.required': 'Vui lòng nhập nhà xuất bản',
      }),
    year_published: Joi.number().integer().min(0),
    isbn: Joi.string(),
    quantity: Joi.number().integer().min(0),
    price: Joi.number().min(0),
  }),
};

const updateBook = {
  body: Joi.object().keys({
    title: Joi.string().messages({
      'string.base': 'Tên sách phải là chuỗi ký tự',
    }),
    author_id: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).messages({
      'string.base': 'Tác giả phải là chuỗi hoặc mảng chuỗi',
    }),
    category_id: Joi.string().messages({
      'string.base': 'Thể loại phải là chuỗi ký tự',
    }),
    publisher_id: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).messages({
      'string.base': 'Nhà xuất bản phải là chuỗi hoặc mảng chuỗi',
    }),
    year_published: Joi.number().integer().min(0),
    isbn: Joi.string(),
    quantity: Joi.number().integer().min(0),
    price: Joi.number().min(0),
  }),
};

module.exports = {
  createBook,
  updateBook,
};
