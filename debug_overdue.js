// Debug script to check overdue transactions
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');

mongoose.connect('mongodb+srv://your_username:your_password@cluster0.tlibbvi.mongodb.net/library?retryWrites=true&w=majority&appName=Cluster0');

async function checkOverdue() {
  try {
    console.log('=== CHECKING OVERDUE TRANSACTIONS ===');
    
    // Check all active transactions
    const activeTransactions = await Transaction.find({ status: 'active' })
      .populate('book', 'title')
      .populate('member', 'name');
    
    console.log(`Total active transactions: ${activeTransactions.length}`);
    
    // Check overdue transactions
    const overdueTransactions = await Transaction.find({
      status: 'active',
      dueDate: { $lt: new Date() }
    }).populate('book', 'title').populate('member', 'name');
    
    console.log(`Overdue transactions: ${overdueTransactions.length}`);
    
    overdueTransactions.forEach((transaction, index) => {
      console.log(`${index + 1}. Book: ${transaction.book.title}`);
      console.log(`   Member: ${transaction.member.name}`);
      console.log(`   Due Date: ${transaction.dueDate}`);
      console.log(`   Days Overdue: ${Math.ceil((new Date() - transaction.dueDate) / (1000 * 60 * 60 * 24))}`);
      console.log('---');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkOverdue();