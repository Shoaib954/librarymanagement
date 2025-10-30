const Member = require('../models/Member');
const Transaction = require('../models/Transaction');

// Calculate fine for overdue books
const calculateFine = (dueDate, returnDate = new Date()) => {
  const timeDiff = returnDate - new Date(dueDate);
  const daysOverdue = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return daysOverdue > 0 ? daysOverdue * 5 : 0; // $5 per day
};

// Get all overdue members
exports.getOverdueMembers = async (req, res) => {
  try {
    const overdueTransactions = await Transaction.find({
      status: 'active',
      dueDate: { $lt: new Date() }
    }).populate('book').populate('member');

    const overdueMap = new Map();

    overdueTransactions.forEach(transaction => {
      const memberId = transaction.member._id.toString();
      const fine = calculateFine(transaction.dueDate);
      const daysOverdue = Math.ceil((new Date() - new Date(transaction.dueDate)) / (1000 * 60 * 60 * 24));

      if (!overdueMap.has(memberId)) {
        overdueMap.set(memberId, {
          member: transaction.member,
          overdueBooks: [],
          totalFine: 0
        });
      }

      const memberData = overdueMap.get(memberId);
      memberData.overdueBooks.push({
        book: transaction.book,
        issuedDate: transaction.issueDate,
        dueDate: transaction.dueDate,
        daysOverdue: daysOverdue,
        fine: fine
      });
      memberData.totalFine += fine;
    });

    const overdueMembers = Array.from(overdueMap.values());
    res.json(overdueMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send reminder to overdue member
exports.sendReminder = async (req, res) => {
  try {
    const { memberId } = req.params;
    const Member = require('../models/Member');
    const Faculty = require('../models/Faculty');
    
    let member = await Member.findById(memberId);
    if (!member) {
      member = await Faculty.findById(memberId);
    }
    
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    console.log(`Reminder sent to ${member.name} (${member.email})`);
    
    res.json({ 
      success: true, 
      message: `Reminder sent to ${member.name}` 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark fine as paid
exports.markPaid = async (req, res) => {
  try {
    const { memberId } = req.params;
    
    await Transaction.updateMany(
      {
        member: memberId,
        status: 'active',
        dueDate: { $lt: new Date() }
      },
      {
        fine: 0,
        status: 'returned'
      }
    );
    
    res.json({ 
      success: true, 
      message: 'Fine marked as paid and books returned' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get overdue members view
exports.overdueView = async (req, res) => {
  try {
    const overdueTransactions = await Transaction.find({
      status: 'active',
      dueDate: { $lt: new Date() }
    }).populate('book').populate('member');

    const overdueMap = new Map();

    overdueTransactions.forEach(transaction => {
      const memberId = transaction.member._id.toString();
      const fine = calculateFine(transaction.dueDate);
      const daysOverdue = Math.ceil((new Date() - new Date(transaction.dueDate)) / (1000 * 60 * 60 * 24));

      if (!overdueMap.has(memberId)) {
        overdueMap.set(memberId, {
          member: transaction.member,
          overdueBooks: [],
          totalFine: 0
        });
      }

      const memberData = overdueMap.get(memberId);
      memberData.overdueBooks.push({
        book: transaction.book,
        issuedDate: transaction.issueDate,
        dueDate: transaction.dueDate,
        daysOverdue: daysOverdue,
        fine: fine
      });
      memberData.totalFine += fine;
    });

    const overdueMembers = Array.from(overdueMap.values());
    res.render('overdue/index', { 
      title: 'Overdue Members',
      overdueMembers: overdueMembers
    });
  } catch (error) {
    res.render('error', { error: error.message });
  }
};