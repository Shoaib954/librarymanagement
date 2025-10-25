const mongoose = require('mongoose');
const Book = require('../models/Book');
const connectDB = require('../config/database');

const sampleBooks = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0-06-112008-4",
    category: "Fiction",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 1960
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "978-0-452-28423-4",
    category: "Fiction",
    totalCopies: 4,
    availableCopies: 4,
    publishedYear: 1949
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0-7432-7356-5",
    category: "Fiction",
    totalCopies: 2,
    availableCopies: 2,
    publishedYear: 1925
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "978-0-14-143951-8",
    category: "Fiction",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 1813
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "978-0-316-76948-0",
    category: "Fiction",
    totalCopies: 2,
    availableCopies: 2,
    publishedYear: 1951
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    isbn: "978-0-553-38016-3",
    category: "Science",
    totalCopies: 2,
    availableCopies: 2,
    publishedYear: 1988
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0-13-235088-4",
    category: "Technology",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 2008
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    isbn: "978-0-06-231609-7",
    category: "History",
    totalCopies: 4,
    availableCopies: 4,
    publishedYear: 2011
  },
  {
    title: "The Art of War",
    author: "Sun Tzu",
    isbn: "978-1-59030-963-7",
    category: "Non-Fiction",
    totalCopies: 2,
    availableCopies: 2,
    publishedYear: -500
  },
  {
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    isbn: "978-0-596-51774-8",
    category: "Technology",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 2008
  }
];

async function addSampleBooks() {
  try {
    await connectDB();
    
    // Check if books already exist
    const existingBooks = await Book.countDocuments();
    console.log(`Database currently has ${existingBooks} books.`);
    
    // Check if any of our sample books already exist
    const existingSampleBooks = await Book.find({ 
      isbn: { $in: sampleBooks.map(book => book.isbn) } 
    });
    
    if (existingSampleBooks.length > 0) {
      console.log(`${existingSampleBooks.length} sample books already exist. Skipping duplicates.`);
      process.exit(0);
    }
    
    // Add sample books
    await Book.insertMany(sampleBooks);
    console.log('✅ Successfully added 10 sample books to the database!');
    
    // Display added books
    console.log('\n📚 Books added:');
    sampleBooks.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title} by ${book.author} (${book.category})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample books:', error);
    process.exit(1);
  }
}

addSampleBooks();