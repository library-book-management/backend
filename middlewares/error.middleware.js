const httpStatus = require('http-status');

const errorHandler = (error, req, res, next) => {
  let message = error.message || 'Internal server error';
  let code = error.status || httpStatus.INTERNAL_SERVER_ERROR;
  switch (message) {
    case 'File too large':
      message = 'File quá lớn';
      code = httpStatus.UNAUTHORIZED;
      break;
    case 'invalid signature':
    case 'jwt malformed':
      message = 'Token không đúng định dạng';
      code = httpStatus.UNAUTHORIZED;
      break;
  }
  res.status(code).json({
    message,
    code,
  });
};

module.exports = errorHandler;
