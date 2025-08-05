const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/api-error');
const catchAsync = require('../utils/catch-async');
const User = require('../models/user.model');
const generateToken = require('../utils/generate-tokens');

const register = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Kiểm tra thông tin
  if (!name || !email || !password) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Vui lòng nhập đầy đủ thông tin');
  }

  // Kiểm tra email đã tồn tại chưa
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, 'Email đã được sử dụng');
  }

  // Hash mật khẩu
  const hashedPassword = await bcrypt.hash(password, 10);

  // Tạo người dùng mới
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'user', // mặc định là user nếu không truyền
  });

  const payload = {
    id: newUser._id,
    email: newUser.email,
    role: newUser.role,
    name: newUser.name,
  };

  const accessToken = generateToken.generateAccessToken(payload);
  const refreshToken = generateToken.generateRefreshToken(payload);

  // Gán cookie
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(httpStatus.status.CREATED).json({
    code: httpStatus.status.CREATED,
    message: 'Đăng ký thành công',
    data: {
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    },
  });
});

const login = catchAsync(async (req, res) => {
  console.log(req);

  const { email, password } = req.body;

  const account = await User.findOne({ email });

  if (!account) {
    throw new ApiError(httpStatus.status.NOT_FOUND, 'Tài khoản không tồn tại');
  }

  const isValidPassword = await bcrypt.compare(password, account.password);

  if (!isValidPassword) {
    throw new ApiError(httpStatus.status.UNAUTHORIZED, 'Mật khẩu không chính xác');
  }

  const payload = {
    id: account._id,
    email: account.email,
    role: account.role,
    name: account.name,
  };

  const accessToken = generateToken.generateAccessToken(payload);
  const refreshToken = generateToken.generateRefreshToken(payload);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(httpStatus.status.OK).json({
    code: httpStatus.status.OK,
    message: 'Đăng nhập thành công',
    data: {
      users: payload,
    },
  });
});

module.exports = {
  login,
  register,
};
