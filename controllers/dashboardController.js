const Book = require('../models/Book');
const Member = require('../models/Member');
const Faculty = require('../models/Faculty');
const Transaction = require('../models/Transaction');

exports.dashboard = async (req, res) => {
  try {
    const user = req.session.user;
    
    if (user.role === 'admin') {
      // Admin dashboard with comprehensive stats
      const [
        totalBooks,
        totalMembers,
        totalFaculty,
        activeTransactions,
        overdueTransactions,
        recentTransactions,
        popularBooks
      ] = await Promise.all([
        Book.countDocuments(),
        Member.countDocuments(),
        Faculty.countDocuments(),
        Transaction.countDocuments({ status: 'active' }),
        Transaction.countDocuments({ 
          status: 'active', 
          dueDate: { $lt: new Date() } 
        }),
        Transaction.find()
          .populate('book', 'title')
          .populate('member', 'name')
          .sort({ createdAt: -1 })
          .limit(5),
        Transaction.aggregate([
          { $match: { type: 'issue' } },
          { $group: { _id: '$book', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
          { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'book' } },
          { $unwind: '$book' }
        ])
      ]);

      res.render('dashboard', {
        title: 'Admin Dashboard',
        stats: {
          totalBooks,
          totalMembers: totalMembers + totalFaculty,
          activeTransactions,
          overdueTransactions
        },
        recentTransactions,
        popularBooks
      });
    } else {
      // Member/Faculty dashboard
      const userTransactions = await Transaction.find({ member: user.id })
        .populate('book', 'title author category')
        .sort({ createdAt: -1 })
        .limit(10);

      const activeBooks = userTransactions.filter(t => t.status === 'active');
      const overdueBooks = activeBooks.filter(t => t.dueDate < new Date());

      res.render('dashboard', {
        title: 'My Dashboard',
        userStats: {
          activeBooks: activeBooks.length,
          maxBooks: user.maxBooks,
          overdueBooks: overdueBooks.length
        },
        recentTransactions: userTransactions.slice(0, 5)
      });
    }
  } catch (error) {
    res.render('error', { error: error.message });
  }
};