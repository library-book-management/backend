const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/api-error');
const catchAsync = require('../utils/catch-async');
const User = require('../models/user.model');

const getUserByConditions = catchAsync(async (req, res) => {
  const query = req.query || {};
  const conditions = {};

  // Nếu có keyword thì tìm theo name (regex, không phân biệt hoa thường)
  if (query.keyword) {
    conditions.name = { $regex: query.keyword, $options: 'i' };
  }

  // Nếu muốn lọc theo role
  if (query.role) {
    conditions.role = query.role;
  }

  // Phân trang
  const page = parseInt(query.page) || 1;
  const pageSize = parseInt(query.limit) || 10;
  const skip = (page - 1) * pageSize;

  // Đếm tổng số bản ghi
  const total = await User.countDocuments(conditions);

  // Lấy danh sách user (bỏ password)
  const users = await User.find(conditions).select('-password').skip(skip).limit(pageSize);

  res.status(httpStatus.status.OK).json({
    code: httpStatus.status.OK,
    message: 'Lấy danh sách người dùng thành công',
    data: { users },
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  });
});

const getUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.status.NOT_FOUND, 'Không tìm thấy người dùng');
  }
  res.status(httpStatus.status.OK).json({
    code: httpStatus.status.OK,
    message: 'Lấy thông tin người dùng thành công',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    },
  });
});

const updateUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { address } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.status.NOT_FOUND, 'Không tìm thấy người dùng');
  }

  Object.assign(user, {
    ...(address && { address: address.trim() }),
  });

  await user.save();
  res.status(httpStatus.status.OK).json({
    code: httpStatus.status.OK,
    message: 'Cập nhật người dùng thông tin thành công',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    },
  });
});

const deleteAllUsers = catchAsync(async (req, res) => {
  const users = await User.deleteMany();
  res.status(httpStatus.status.OK).json({
    code: httpStatus.status.OK,
    message: 'Xóa tất cả người dùng thành công',
    data: {
      users,
    },
  });
});

const deleteUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new ApiError(httpStatus.status.NOT_FOUND, 'Người dùng không tồn tại');
  }
  res.status(httpStatus.status.OK).json({
    code: httpStatus.status.OK,
    message: 'Xóa người dùng thành công',
    data: {
      user,
    },
  });
});

const createUser = catchAsync(async (req, res) => {
  const { name, email } = req.body;
  const password = 'User@123';
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashPassword,
  });
  res.status(httpStatus.status.OK).json({
    data: {
      user,
      code: httpStatus.status.OK,
      message: 'Tạo người dùng mới thành công',
    },
  });
});

module.exports = {
  getUserByConditions,
  getUserById,
  updateUserById,
  deleteAllUsers,
  deleteUserById,
  createUser,
};
