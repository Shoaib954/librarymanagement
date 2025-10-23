const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  member: { type: mongoose.Schema.Types.ObjectId, refPath: 'memberType', required: true },
  memberType: { type: String, enum: ['Member', 'Faculty'], required: true },
  type: { type: String, enum: ['issue', 'return'], required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  fine: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'returned', 'overdue'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);