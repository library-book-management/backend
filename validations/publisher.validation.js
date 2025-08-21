const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPublisher = {
  body: Joi.object().keys({
    name: Joi.string().min(2).required().messages({
      'any.required': 'Vui lòng nhập tên nhà xuất bản',
      'string.base': 'Tên phải là chuỗi ký tự',
      'string.min': 'Tên phải có ít nhất 2 ký tự',
    }),
  }),
};

const getPublishers = {
  query: Joi.object({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    searchBy: Joi.string().valid('name').insensitive(),
    value: Joi.string(),
  }).with('searchBy', 'value'),
};

const getPublisherById = {
  params: Joi.object({
    publisherId: Joi.string().required().custom(objectId),
  }),
};

const updatePublisherById = {
  params: Joi.object({
    publisherId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).messages({
        'string.base': 'Tên phải là chuỗi ký tự',
        'string.min': 'Tên phải có ít nhất 2 ký tự',
      }),
    })
    .min(1)
    .messages({
      'object.min': 'Cần cung cấp ít nhất một trường để cập nhật',
    }),
};

const deletePublisherById = {
  params: Joi.object({
    publisherId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createPublisher,
  getPublisherById,
  updatePublisherById,
  deletePublisherById,
  getPublishers
};
