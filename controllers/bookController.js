const Book = require('../models/Book');

exports.index = async (req, res) => {
  try {
    const books = await Book.find();
    const isAdmin = req.session.user.role === 'admin';
    res.render('books/index', { books, title: 'All Books', isAdmin });
  } catch (error) {
    res.render('error', { error: error.message });
  }
};

exports.browse = async (req, res) => {
  try {
    const books = await Book.find({ availableCopies: { $gt: 0 } });
    res.render('books/browse', { books, title: 'Browse Books' });
  } catch (error) {
    res.render('error', { error: error.message });
  }
};

exports.new = (req, res) => {
  res.render('books/new', { title: 'Add New Book' });
};

exports.create = async (req, res) => {
  try {
    const book = new Book(req.body);
    book.availableCopies = book.totalCopies;
    await book.save();
    res.redirect('/books');
  } catch (error) {
    res.render('books/new', { error: error.message, title: 'Add New Book' });
  }
};

exports.show = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.render('error', { error: 'Book not found' });
    }
    res.render('books/show', { book, title: book.title });
  } catch (error) {
    res.render('error', { error: error.message });
  }
};

exports.edit = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.render('error', { error: 'Book not found' });
    }
    res.render('books/edit', { book, title: 'Edit Book' });
  } catch (error) {
    res.render('error', { error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    await Book.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/books');
  } catch (error) {
    res.render('error', { error: error.message });
  }
};

exports.destroy = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/books');
  } catch (error) {
    res.render('error', { error: error.message });
  }
};