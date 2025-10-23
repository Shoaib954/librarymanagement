const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Member = require('../models/Member');
const Transaction = require('../models/Transaction');
const libraryConfig = require('../config/library');

// Books API
router.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/books', async (req, res) => {
  try {
    const book = new Book(req.body);
    book.availableCopies = book.totalCopies;
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/books/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Members API
router.get('/members', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/members', async (req, res) => {
  try {
    const member = new Member(req.body);
    member.membershipId = 'MEM' + Date.now();
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/members/:id', async (req, res) => {
  try {
    const activeTransactions = await Transaction.countDocuments({ 
      member: req.params.id, 
      status: 'active' 
    });
    
    if (activeTransactions > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete member with active book transactions. Please return all books first.' 
      });
    }
    
    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transactions API
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('book', 'title author')
      .populate('member', 'name membershipId')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/transactions/issue', async (req, res) => {
  try {
    const { bookId, memberId } = req.body;
    const book = await Book.findById(bookId);
    
    if (book.availableCopies <= 0) {
      return res.status(400).json({ error: 'Book not available' });
    }

    // Calculate due date based on book category
    const loanDays = libraryConfig.loanPeriods[book.category] || libraryConfig.loanPeriods.default;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + loanDays);

    const transaction = new Transaction({
      book: bookId,
      member: memberId,
      type: 'issue',
      dueDate
    });

    await transaction.save();
    book.availableCopies -= 1;
    await book.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Stats API
router.get('/stats', async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalMembers = await Member.countDocuments();
    const activeIssues = await Transaction.countDocuments({ status: 'active' });
    
    res.json({ totalBooks, totalMembers, activeIssues });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Loan periods API
router.get('/loan-periods', (req, res) => {
  res.json(libraryConfig.loanPeriods);
});

// Calculate due date API
router.post('/calculate-due-date', async (req, res) => {
  try {
    const { bookId } = req.body;
    const book = await Book.findById(bookId);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    const loanDays = libraryConfig.loanPeriods[book.category] || libraryConfig.loanPeriods.default;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + loanDays);
    
    res.json({ 
      dueDate, 
      loanDays, 
      category: book.category,
      finePerDay: libraryConfig.finePerDay 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;