const httpStatus = require('http-status');

const validate = (schema) => (req, res, next) => {
  for (const key in schema) {
    const value = req[key];
    const { error } = schema[key].validate(value, { abortEarly: false });

    if (error) {
      const { details } = error;
      const messages = details
        .map((detail) => detail.message)
        .join(',')
        .replace(/"/g, '');

      return res.status(httpStatus.BAD_REQUEST).json({
        message: messages,
        code: httpStatus.BAD_REQUEST,
      });
    }
  }

  next();
};

module.exports = validate;
