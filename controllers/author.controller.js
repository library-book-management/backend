const httpStatus = require('http-status');
const Author = require('../models/author.model');
const ApiError = require('../utils/api-error');
const catchAsync = require('../utils/catch-async');

const createAuthor = catchAsync(async (req, res) => {
  const { name, email, phone } = req.body;

  const normalizedName = name?.trim();
  const normalizedEmail = email?.trim().toLowerCase() || undefined;
  const normalizedPhone = phone?.trim() || undefined;

  const fullMatch = await Author.findOne({
    name: normalizedName,
    email: normalizedEmail,
    phone: normalizedPhone,
  });

  if (fullMatch) {
    throw new ApiError(httpStatus.CONFLICT, 'Tác giả đã tồn tại');
  }

  if (normalizedEmail) {
    const emailUsed = await Author.findOne({ email: normalizedEmail });
    if (emailUsed) {
      throw new ApiError(httpStatus.CONFLICT, 'Email này đã được sử dụng');
    }
  }

  if (normalizedPhone) {
    const phoneUsed = await Author.findOne({ phone: normalizedPhone });
    if (phoneUsed) {
      throw new ApiError(httpStatus.CONFLICT, 'Số điện thoại này đã được sử dụng');
    }
  }

  const newAuthor = await Author.create({
    name: normalizedName,
    email: normalizedEmail,
    phone: normalizedPhone,
  });

  res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: 'Tạo tác giả thành công!',
    data: { author: newAuthor },
  });
});

const getAuthors = catchAsync(async (req, res) => {
  const { limit = 10, page = 1, searchBy, value } = req.query;
  const skip = (+page - 1) * +limit;

  const filter = {};

  if (searchBy && value) {
    const normalizedField = searchBy.toLowerCase();
    const allowedFields = ['name', 'email', 'phone'];

    if (allowedFields.includes(normalizedField)) {
      filter[normalizedField] = { $regex: value, $options: 'i' };
    }
  }

  const [authors, totalResults] = await Promise.all([
    Author.find(filter).sort({ createdAt: -1 }).skip(skip).limit(+limit),
    Author.countDocuments(filter),
  ]);

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy danh sách tác giả thành công!',
    data: {
      authors,
      limit: +limit,
      currentPage: +page,
      totalPage: Math.ceil(totalResults / +limit),
      totalResults,
    },
  });
});

const getAuthorById = catchAsync(async (req, res) => {
  const author = await Author.findById(req.params.authorId);

  if (!author) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy tác giả!');
  }

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy thông tin tác giả thành công!',
    data: { author },
  });
});

const updateAuthorById = catchAsync(async (req, res) => {
  const { authorId } = req.params;
  const { name, email, phone } = req.body;

  const author = await Author.findById(authorId);
  if (!author) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy tác giả!');
  }

  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedPhone = phone?.trim();

  if (normalizedEmail && normalizedEmail !== author.email) {
    const emailUsed = await Author.findOne({ email: normalizedEmail, _id: { $ne: authorId } });
    if (emailUsed) {
      throw new ApiError(httpStatus.CONFLICT, 'Email này đã được sử dụng');
    }
  }

  if (normalizedPhone && normalizedPhone !== author.phone) {
    const phoneUsed = await Author.findOne({ phone: normalizedPhone, _id: { $ne: authorId } });
    if (phoneUsed) {
      throw new ApiError(httpStatus.CONFLICT, 'Số điện thoại này đã được sử dụng');
    }
  }

  Object.assign(author, {
    ...(name && { name: name.trim() }),
    ...(normalizedEmail && { email: normalizedEmail }),
    ...(normalizedPhone && { phone: normalizedPhone }),
  });

  await author.save();

  res.status(httpStatus.OK).json({
    message: 'Cập nhật thông tin tác giả thành công!',
    code: httpStatus.OK,
    data: { author },
  });
});

const deleteAuthorById = catchAsync(async (req, res) => {
  const { authorId } = req.params;

  const author = await Author.findById(authorId);
  if (!author) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy tác giả!');
  }

  await Author.findByIdAndDelete(authorId);

  res.status(httpStatus.OK).json({
    message: 'Xoá tác giả thành công!',
    code: httpStatus.OK,
    data: { author },
  });
});

module.exports = {
  createAuthor,
  getAuthors,
  getAuthorById,
  updateAuthorById,
  deleteAuthorById,
};
