const httpStatus = require('http-status');
const Publisher = require('../models/publisher.model');
const ApiError = require('../utils/api-error');
const catchAsync = require('../utils/catch-async');

const createPublisher = catchAsync(async (req, res) => {
  const { name } = req.body;
  const normalizedName = name?.trim();

  const fullMatch = await Publisher.findOne({ name: normalizedName });
  if (fullMatch) {
    throw new ApiError(httpStatus.status.CONFLICT, 'Nhà xuất bản đã tồn tại');
  }

  const newPublisher = await Publisher.create({ name: normalizedName });

  res.status(httpStatus.status.CREATED).json({
    code: httpStatus.status.CREATED,
    message: 'Tạo nhà xuất bản thành công!',
    data: { publisher: newPublisher },
  });
});

const getPublishers = catchAsync(async (req, res) => {
  const { limit = 10, page = 1, searchBy, value } = req.query;
  const skip = (+page - 1) * +limit;

  const filter = {};
  if (searchBy && value) {
    const normalizedField = searchBy.toLowerCase();
    const allowedFields = ['name'];
    if (allowedFields.includes(normalizedField)) {
      filter[normalizedField] = { $regex: value, $options: 'i' };
    }
  }

  const [publishers, totalResults] = await Promise.all([
    Publisher.find(filter).sort({ createdAt: -1 }).skip(skip).limit(+limit),
    Publisher.countDocuments(filter),
  ]);

  res.status(httpStatus.status.OK).json({
    code: httpStatus.status.OK,
    message: 'Lấy danh sách nhà xuất bản thành công!',
    data: {
      publishers,
      limit: +limit,
      currentPage: +page,
      totalPage: Math.ceil(totalResults / +limit),
      totalResults,
    },
  });
});

const getPublisherById = catchAsync(async (req, res) => {
  const publisher = await Publisher.findById(req.params.publisherId);
  if (!publisher) {
    throw new ApiError(httpStatus.status.NOT_FOUND, 'Không tìm thấy nhà xuất bản!');
  }

  res.status(httpStatus.status.OK).json({
    code: httpStatus.status.OK,
    message: 'Lấy thông tin nhà xuất bản thành công!',
    data: { publisher },
  });
});

const updatePublisherById = catchAsync(async (req, res) => {
  const { publisherId } = req.params;
  const { name } = req.body;

  const publisher = await Publisher.findById(publisherId);
  if (!publisher) {
    throw new ApiError(httpStatus.status.NOT_FOUND, 'Không tìm thấy nhà xuất bản!');
  }

  Object.assign(publisher, {
    ...(name && { name: name.trim() }),
  });

  await publisher.save();

  res.status(httpStatus.status.OK).json({
    message: 'Cập nhật thông tin nhà xuất bản thành công!',
    code: httpStatus.status.OK,
    data: { publisher },
  });
});

const deletePublisherById = catchAsync(async (req, res) => {
  const { publisherId } = req.params;

  const publisher = await Publisher.findById(publisherId);
  if (!publisher) {
    throw new ApiError(httpStatus.status.NOT_FOUND, 'Không tìm thấy nhà xuất bản!');
  }

  await Publisher.findByIdAndDelete(publisherId);

  res.status(httpStatus.status.OK).json({
    message: 'Xoá nhà xuất bản thành công!',
    code: httpStatus.status.OK,
    data: { publisher },
  });
});

module.exports = {
  createPublisher,
  getPublishers,
  getPublisherById,
  updatePublisherById,
  deletePublisherById,
};
