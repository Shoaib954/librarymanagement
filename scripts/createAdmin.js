const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const connectDB = require('../config/database');

async function createAdmin() {
  try {
    await connectDB();
    
    const adminExists = await Admin.findOne({ email: 'admin@library.com' });
    if (adminExists) {
      console.log('Admin already exists!');
      process.exit(0);
    }
    
    const admin = new Admin({
      username: 'admin',
      email: 'admin@library.com',
      password: 'admin123'
    });
    
    await admin.save();
    console.log('Admin created successfully!');
    console.log('Email: admin@library.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();