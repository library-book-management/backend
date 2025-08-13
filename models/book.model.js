const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author_id: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Author',
        required: true,
      },
    ],
    category_id: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
    ],
    publisher_id: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Publisher',
        required: true,
      },
    ],
    year_published: {
      type: Number,
      min: [1000, 'Năm xuất bản phải từ 1000 trở lên'],
      max: [new Date().getFullYear(), 'Năm xuất bản không được vượt quá năm hiện tại'],
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, 'Số lượng không được âm'],
    },
    price: {
      type: Number,
      min: [0, 'Giá không được âm'],
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

// Index để tối ưu tìm kiếm
bookSchema.index({ title: 1 });
bookSchema.index({ author_id: 1 });
bookSchema.index({ category_id: 1 });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
