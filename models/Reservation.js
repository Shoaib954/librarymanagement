const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  member: { type: mongoose.Schema.Types.ObjectId, refPath: 'memberType', required: true },
  memberType: { type: String, enum: ['Member', 'Faculty'], required: true },
  status: { type: String, enum: ['active', 'fulfilled', 'cancelled'], default: 'active' },
  reservedDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, // 7 days
  notified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);