const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  membershipId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  maxBooks: { type: Number, default: 3 }
}, { timestamps: true });

memberSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

memberSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Member', memberSchema);