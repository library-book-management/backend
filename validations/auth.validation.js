const Joi = require('joi');

const auth = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().required().messages({
      'string.email': 'Email không hợp lệ',
    }),
    password: Joi.string()
      .required()
      .pattern(
        new RegExp(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\'":\\\\|,.<>\\/?]).{8,}$',
        ),
      )
      .messages({
        'string.pattern.base':
          'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
        'any.required': 'Vui lòng nhập mật khẩu',
      }),
  }),
};

module.exports = {
  auth,
};
