const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(100).required().messages({
      'any.required': 'Vui lòng nhập tên thể loại',
      'string.base': 'Tên phải là chuỗi ký tự',
      'string.min': 'Tên phải có ít nhất 2 ký tự',
      'string.max': 'Tên không được vượt quá 100 ký tự',
    }),
  }),
};

const createCategories = {
  body: Joi.object().keys({
    categories: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().min(2).max(100).required().messages({
            'any.required': 'Vui lòng nhập tên thể loại',
            'string.base': 'Tên phải là chuỗi ký tự',
            'string.min': 'Tên phải có ít nhất 2 ký tự',
            'string.max': 'Tên không được vượt quá 100 ký tự',
          }),
        }),
      )
      .min(1)
      .required()
      .messages({
        'array.base': 'Categories phải là một mảng',
        'array.min': 'Cần nhập ít nhất 1 thể loại',
        'any.required': 'Vui lòng nhập danh sách thể loại',
      }),
  }),
};

const getCategories = {
  query: Joi.object({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    searchBy: Joi.string().valid('name').insensitive(),
    value: Joi.string(),
  }).with('searchBy', 'value'),
};

const getCategoryById = {
  params: Joi.object({
    categoryId: Joi.string().required().custom(objectId),
  }),
};

const updateCategoryById = {
  params: Joi.object({
    categoryId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(100).messages({
        'string.base': 'Tên phải là chuỗi ký tự',
        'string.min': 'Tên phải có ít nhất 2 ký tự',
        'string.max': 'Tên không được vượt quá 100 ký tự',
      }),
    })
    .min(1)
    .messages({
      'object.min': 'Cần cung cấp ít nhất một trường để cập nhật',
    }),
};

const deleteCategoryById = {
  params: Joi.object({
    categoryId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createCategory,
  createCategories,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
