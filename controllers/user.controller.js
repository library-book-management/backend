const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/api-error');
const catchAsync = require('../utils/catch-async');
const User = require('../models/user.model');

const getUserByConditions = catchAsync(async (req, res) => {
  const query = req.query || {};
  const conditions = {};

  // Chỉ lọc theo các field cho phép
  const allowedFields = ['name', 'email', 'address'];
  allowedFields.forEach((field) => {
    if (query[field]) {
      conditions[field] = { $regex: query[field], $options: 'i' };
    }
  });

  // Lấy thông tin phân trang từ query
  const page = parseInt(query.page) || 1;
  const pageSize = parseInt(query.pageSize) || 10;
  const skip = (page - 1) * pageSize;

  // Tổng số user phù hợp điều kiện
  const total = await User.countDocuments(conditions);

  // Lấy danh sách user phân trang
  const users = await User.find(conditions).skip(skip).limit(pageSize);

  res.status(httpStatus.status.OK).json({
    code: httpStatus.status.OK,
    message: 'Lấy danh sách người dùng thành công',
    data: users,
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

module.exports = {
  getUserByConditions,
  getUserById,
  updateUserById,
  deleteAllUsers,
  deleteUserById,
};
