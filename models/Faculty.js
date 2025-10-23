const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  facultyId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  maxBooks: { type: Number, default: 10 }
}, { timestamps: true });

facultySchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

facultySchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Faculty', facultySchema);