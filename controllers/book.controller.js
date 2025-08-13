const Book = require('../models/book.model');
const httpStatus = require('http-status');

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    // Lấy limit và page từ query, mặc định nếu không có
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    const skip = (page - 1) * limit;

    // Đếm tổng số kết quả
    const totalResults = await Book.countDocuments();

    // Lấy danh sách sách với phân trang và populate các trường liên quan
    const books = await Book.find()
      .skip(skip)
      .limit(limit)
      .populate('author_id', 'name')
      .populate('category_id', 'name');
    // .populate('publisher_id', 'name');

    res.status(httpStatus.status.OK).json({
      code: httpStatus.status.OK,
      message: 'Lấy danh sách sách thành công!',
      data: {
        books,
        limit: +limit,
        currentPage: +page,
        totalPage: Math.ceil(totalResults / +limit),
        totalResults,
      },
    });
  } catch (err) {
    res.status(httpStatus.status.INTERNAL_SERVER_ERROR).json({
      code: httpStatus.status.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId)
      .populate('author_id', 'name')
      .populate('category_id', 'name');
    // .populate('publisher_id', 'name');
    if (!book) {
      return res.status(httpStatus.status.NOT_FOUND).json({
        code: httpStatus.status.NOT_FOUND,
        message: 'Book not found',
      });
    }
    res.status(httpStatus.status.OK).json({
      code: httpStatus.status.OK,
      message: 'Lấy sách thành công!',
      data: { book },
    });
  } catch (err) {
    res.status(httpStatus.status.INTERNAL_SERVER_ERROR).json({
      code: httpStatus.status.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

// Create a new book
exports.createBook = async (req, res) => {
  try {
    // Kiểm tra dữ liệu đầu vào cơ bản
    const { title, author_id, category_id, publisher_id, isbn } = req.body;
    if (!title || !author_id || !category_id || !publisher_id) {
      return res.status(httpStatus.status.BAD_REQUEST).json({
        code: httpStatus.status.BAD_REQUEST,
        message: 'Thiếu thông tin bắt buộc: title, author_id, category_id, publisher_id',
      });
    }

    // Kiểm tra mã ISBN đã tồn tại chưa
    if (isbn) {
      const existingBook = await Book.findOne({ isbn });
      if (existingBook) {
        return res.status(httpStatus.status.BAD_REQUEST).json({
          code: httpStatus.status.BAD_REQUEST,
          message: 'mã isbn đã tồn tại',
        });
      }
    }

    // Tạo instance Book mới
    const bookData = {
      title: req.body.title,
      author_id: Array.isArray(req.body.author_id) ? req.body.author_id : [req.body.author_id],
      category_id: req.body.category_id,
      publisher_id: Array.isArray(req.body.publisher_id)
        ? req.body.publisher_id
        : [req.body.publisher_id],
    };

    // Thêm các field optional
    if (req.body.year_published) bookData.year_published = req.body.year_published;
    if (req.body.isbn) bookData.isbn = req.body.isbn;
    if (req.body.quantity !== undefined) bookData.quantity = req.body.quantity;
    if (req.body.price) bookData.price = req.body.price;

    const newBook = new Book(bookData);

    // Lưu vào database
    const savedBook = await newBook.save();

    res.status(httpStatus.status.CREATED).json({
      code: httpStatus.status.CREATED,
      message: 'Tạo sách thành công!',
      data: { book: savedBook },
    });
  } catch (err) {
    console.error('Error creating book:', err);

    // Xử lý lỗi validation
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(httpStatus.status.BAD_REQUEST).json({
        code: httpStatus.status.BAD_REQUEST,
        message: 'Dữ liệu không hợp lệ',
        errors: errors,
      });
    }

    // Xử lý lỗi CastError (ObjectId không hợp lệ)
    if (err.name === 'CastError') {
      return res.status(httpStatus.status.BAD_REQUEST).json({
        code: httpStatus.status.BAD_REQUEST,
        message: 'ID không hợp lệ',
      });
    }

    // Lỗi khác
    res.status(httpStatus.status.INTERNAL_SERVER_ERROR).json({
      code: httpStatus.status.INTERNAL_SERVER_ERROR,
      message: 'Lỗi server',
      error: err.message,
    });
  }
};

// Update a book by ID
exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true });
    if (!updatedBook) {
      return res.status(httpStatus.status.NOT_FOUND).json({
        code: httpStatus.status.NOT_FOUND,
        message: 'Book not found',
      });
    }
    res.status(httpStatus.status.OK).json({
      code: httpStatus.status.OK,
      message: 'Cập nhật sách thành công!',
      data: { book: updatedBook },
    });
  } catch (err) {
    res.status(httpStatus.status.BAD_REQUEST).json({
      code: httpStatus.status.BAD_REQUEST,
      message: err.message,
    });
  }
};

// Delete a book by ID
exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.bookId);
    if (!deletedBook) {
      return res.status(httpStatus.status.NOT_FOUND).json({
        code: httpStatus.status.NOT_FOUND,
        message: 'Book not found',
      });
    }
    res.status(httpStatus.status.OK).json({
      code: httpStatus.status.OK,
      message: 'Xóa sách thành công!',
    });
  } catch (err) {
    res.status(httpStatus.status.INTERNAL_SERVER_ERROR).json({
      code: httpStatus.status.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};
