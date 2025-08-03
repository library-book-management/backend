const httpStatus = require('http-status');

class ApiError extends Error {
  constructor(status = httpStatus.BAD_REQUEST, message = '') {
    super(message);
    this.status = status;
  }
}

module.exports = ApiError;
