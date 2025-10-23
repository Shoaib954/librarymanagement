const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Member = require('../models/Member');
const Faculty = require('../models/Faculty');
const libraryConfig = require('../config/library');

exports.index = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('book', 'title author')
      .populate('member', 'name membershipId')
      .sort({ createdAt: -1 })
      .lean();
    res.render('transactions/index', { transactions, title: 'All Transactions' });
  } catch (error) {
    res.render('error', { error: error.message });
  }
};

exports.issue = async (req, res) => {
  try {
    const books = await Book.find({ availableCopies: { $gt: 0 } });
    const members = await Member.find({ isActive: true });
    const faculty = await Faculty.find({ isActive: true });
    res.render('transactions/issue', { books, members, faculty, title: 'Issue Book' });
  } catch (error) {
    res.render('error', { error: error.message });
  }
};

exports.createIssue = async (req, res) => {
  try {
    const { bookId, memberId, memberType } = req.body;
    const book = await Book.findById(bookId);
    
    if (book.availableCopies <= 0) {
      throw new Error('Book not available');
    }

    // Check active transactions count
    const activeCount = await Transaction.countDocuments({ member: memberId, status: 'active' });
    const user = memberType === 'Faculty' ? await Faculty.findById(memberId) : await Member.findById(memberId);
    
    if (activeCount >= user.maxBooks) {
      throw new Error(`Cannot issue more than ${user.maxBooks} books`);
    }

    // Calculate due date based on book category
    const loanDays = libraryConfig.loanPeriods[book.category] || libraryConfig.loanPeriods.default;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + loanDays);

    const transaction = new Transaction({
      book: bookId,
      member: memberId,
      memberType,
      type: 'issue',
      dueDate
    });

    await transaction.save();
    book.availableCopies -= 1;
    await book.save();

    res.redirect('/transactions');
  } catch (error) {
    res.render('error', { error: error.message });
  }
};

exports.return = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('book')
      .populate('member');
    
    transaction.type = 'return';
    transaction.returnDate = new Date();
    transaction.status = 'returned';
    
    // Calculate fine if overdue (only for Members, not Faculty)
    if (transaction.memberType === 'Member' && transaction.returnDate > transaction.dueDate) {
      const daysOverdue = Math.ceil((transaction.returnDate - transaction.dueDate) / (1000 * 60 * 60 * 24));
      transaction.fine = daysOverdue * libraryConfig.finePerDay;
    }

    await transaction.save();
    
    const book = await Book.findById(transaction.book._id);
    book.availableCopies += 1;
    await book.save();

    res.redirect('/transactions');
  } catch (error) {
    res.render('error', { error: error.message });
  }
};