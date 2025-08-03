const jwt = require('jsonwebtoken');

const httpStatus = require('http-status');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const auth = catchAsync(async (req, res, next) => {
  const token = extracToken(req);

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Vui lòng đăng nhập hệ thống');
  }

  const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

  const user = await User.findById(payload.id);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Vui lòng đăng nhập hệ thống');
  }

  if (user.isLocked) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Tài khoản đã bị khoá');
  }

  req.user = user;

  next();
});

const author = (rolesAllowed) =>
  catchAsync(async (req, res, next) => {
    if (!rolesAllowed.includes(req.user.role)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền truy cập');
    }
    next();
  });

const extracToken = (req) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization?.split(' ')[1];
  }
  return token;
};

module.exports = { auth, author };
