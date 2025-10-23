const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library_management';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
    
    // Create admin and sample data after connection
    if (process.env.NODE_ENV === 'production' || process.env.MONGODB_URI) {
      await createInitialData();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const createInitialData = async () => {
  try {
    const Admin = require('../models/Admin');
    const Book = require('../models/Book');
    
    // Create admin if doesn't exist
    const adminExists = await Admin.findOne({ email: 'admin@library.com' });
    if (!adminExists) {
      const admin = new Admin({
        username: 'admin',
        email: 'admin@library.com',
        password: 'admin123'
      });
      await admin.save();
      console.log('Admin user created');
    }
    
    // Add sample books if none exist
    const bookCount = await Book.countDocuments();
    if (bookCount === 0) {
      const sampleBooks = [
        { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0-06-112008-4', category: 'Fiction', totalCopies: 3, availableCopies: 3, publishedYear: 1960 },
        { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0-13-235088-4', category: 'Technology', totalCopies: 2, availableCopies: 2, publishedYear: 2008 },
        { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0-7432-7356-5', category: 'Fiction', totalCopies: 4, availableCopies: 4, publishedYear: 1925 }
      ];
      await Book.insertMany(sampleBooks);
      console.log('Sample books added');
    }
  } catch (error) {
    console.log('Initial data setup error:', error.message);
  }
};

module.exports = connectDB;