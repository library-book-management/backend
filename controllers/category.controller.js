const httpStatus = require('http-status');
const Category = require('../models/category.model');
const ApiError = require('../utils/api-error');
const catchAsync = require('../utils/catch-async');

/// Tạo Category
const createCategory = catchAsync(async (req, res) => {
  const { name } = req.body;

  const normalizedName = name?.trim();

  const fullMatch = await Category.findOne({
    name: normalizedName,
  });

  if (fullMatch) {
    throw new ApiError(httpStatus.status.CONFLICT, 'thể loại đã tồn tại');
  }

  const newCategory = await Category.create({
    name: normalizedName,
  });

  res.status(httpStatus.status.CREATED).json({
    code: httpStatus.status.CREATED,
    message: 'Tạo thể loại thành công!',
    data: { category: newCategory },
  });
});

/// Tạo nhiều categories
const createCategories = catchAsync(async (req, res) => {
  const categories = req.body.categories;
  if (!Array.isArray(categories) || categories.length === 0) {
    throw new ApiError(
      httpStatus.status.BAD_REQUEST,
      'Dữ liệu categories phải là mảng và không được rỗng',
    );
  }
  const normalizedNames = [...new Set(categories.map((c) => c.name?.trim()).filter(Boolean))];

  const existingCategories = await Category.find({
    name: { $in: normalizedNames },
  }).lean();
  const existingNames = existingCategories.map((c) => c.name);

  // Lọc ra những category mới chưa tồn tại
  const newCategoriesData = normalizedNames
    .filter((name) => !existingNames.includes(name))
    .map((name) => ({ name }));

  // Insert những category mới
  let insertedCategories = [];
  if (newCategoriesData.length > 0) {
    insertedCategories = await Category.insertMany(newCategoriesData);
  }

  res.status(httpStatus.status.CREATED).json({
    message: `Đã thêm thể loại, bỏ qua thể loại đã tồn tại.`,
    code: httpStatus.status.CREATED,
    data: { categories: newCategoriesData },
  });
});

/// Lấy danh sách Categories
const getCategories = catchAsync(async (req, res) => {
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

  const [categories, totalResults] = await Promise.all([
    Category.find(filter).sort({ createdAt: -1 }).skip(skip).limit(+limit),
    Category.countDocuments(filter),
  ]);

  res.status(httpStatus.status.OK).json({
    code: httpStatus.status.OK,
    message: 'Lấy danh sách thể loại thành công!',
    data: {
      categories,
      limit: +limit,
      currentPage: +page,
      totalPage: Math.ceil(totalResults / +limit),
      totalResults,
    },
  });
});

/// Lấy category theo Id
const getCategoryById = catchAsync(async (req, res) => {
  const category = await Category.findById(req.params.categoryId);

  if (!category) {
    throw new ApiError(httpStatus.status.NOT_FOUND, 'Không tìm thấy thể loại!');
  }

  res.status(httpStatus.status.OK).json({
    code: httpStatus.status.OK,
    message: 'Lấy thông thể loại thành công!',
    data: { category: category },
  });
});

/// Cập nhật category theo Id
const updateCategoryById = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.status.NOT_FOUND, 'Không tìm thấy thể loại !');
  }

  Object.assign(category, {
    ...(name && { name: name.trim() }),
  });

  await category.save();

  res.status(httpStatus.status.OK).json({
    message: 'Cập nhật thông tin thể loại thành công!',
    code: httpStatus.status.OK,
    data: { category },
  });
});

/// Xoá category theo id
const deleteCategoryById = catchAsync(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.status.NOT_FOUND, 'Không tìm thấy thể loại!');
  }

  await Category.findByIdAndDelete(categoryId);

  res.status(httpStatus.status.OK).json({
    message: 'Xoá thể loại thành công!',
    code: httpStatus.status.OK,
    data: { category: category },
  });
});

module.exports = {
  createCategory,
  createCategories,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
