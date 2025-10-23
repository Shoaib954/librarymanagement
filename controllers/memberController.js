const Member = require('../models/Member');
const Transaction = require('../models/Transaction');

exports.index = async (req, res) => {
  try {
    const members = await Member.find().select('-password');
    res.render('members/index', { members, title: 'All Members' });
  } catch (error) {
    res.render('error', { error: error.message });
  }
};

exports.new = (req, res) => {
  res.render('members/new', { title: 'Add New Member' });
};

exports.create = async (req, res) => {
  try {
    const member = new Member(req.body);
    member.membershipId = 'MEM' + Date.now();
    await member.save();
    res.redirect('/members');
  } catch (error) {
    res.render('members/new', { error: error.message, title: 'Add New Member' });
  }
};

exports.show = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).select('-password');
    if (!member) {
      return res.render('error', { error: 'Member not found' });
    }
    const transactions = await Transaction.find({ member: req.params.id })
      .populate('book', 'title author')
      .sort({ createdAt: -1 });
    res.render('members/show', { member, transactions, title: member.name });
  } catch (error) {
    res.render('error', { error: error.message });
  }
};

exports.myTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ member: req.session.user.id })
      .populate('book', 'title author category')
      .sort({ createdAt: -1 })
      .lean();
    res.render('members/my-transactions', { transactions, title: 'My Transactions' });
  } catch (error) {
    res.render('error', { error: error.message });
  }
};

exports.profile = async (req, res) => {
  try {
    const member = await Member.findById(req.session.user.id).select('-password');
    res.render('members/profile', { member, title: 'My Profile' });
  } catch (error) {
    res.render('error', { error: error.message });
  }
};

exports.destroy = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.render('error', { error: 'Member not found' });
    }
    
    // Check if member has active transactions only
    const activeTransactions = await Transaction.countDocuments({ 
      member: req.params.id,
      status: 'active'
    });
    
    if (activeTransactions > 0) {
      return res.render('error', { 
        error: 'Cannot delete member with active book transactions. Please return all books first.' 
      });
    }
    
    await Member.findByIdAndDelete(req.params.id);
    res.redirect('/members');
  } catch (error) {
    res.render('error', { error: error.message });
  }
};