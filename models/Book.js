const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  totalCopies: { type: Number, default: 1 },
  availableCopies: { type: Number, default: 1 },
  publishedYear: { type: Number },
  imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);