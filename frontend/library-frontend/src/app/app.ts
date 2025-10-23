import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibraryService } from './services/library.service';
import { Book } from './models/book.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  books: Book[] = [];
  stats = { totalBooks: 0, totalMembers: 0, activeIssues: 0 };
  newBook: Book = {
    title: '',
    author: '',
    isbn: '',
    category: '',
    totalCopies: 1,
    availableCopies: 1
  };
  message = '';
  messageType = '';

  constructor(private libraryService: LibraryService) {}

  ngOnInit() {
    this.loadBooks();
    this.loadStats();
  }

  loadBooks() {
    this.libraryService.getBooks().subscribe({
      next: (books) => this.books = books,
      error: (error) => this.showMessage('Error loading books', 'error')
    });
  }

  loadStats() {
    this.libraryService.getStats().subscribe({
      next: (stats) => this.stats = stats,
      error: (error) => console.error('Error loading stats:', error)
    });
  }

  addBook() {
    if (!this.newBook.title || !this.newBook.author || !this.newBook.isbn || !this.newBook.category) {
      this.showMessage('Please fill all required fields', 'error');
      return;
    }

    this.newBook.availableCopies = this.newBook.totalCopies;
    
    this.libraryService.addBook(this.newBook).subscribe({
      next: () => {
        this.showMessage('Book added successfully!', 'success');
        this.resetForm();
        this.loadBooks();
        this.loadStats();
      },
      error: (error) => this.showMessage('Error adding book', 'error')
    });
  }

  deleteBook(id: string) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.libraryService.deleteBook(id).subscribe({
        next: () => {
          this.showMessage('Book deleted successfully!', 'success');
          this.loadBooks();
          this.loadStats();
        },
        error: (error) => this.showMessage('Error deleting book', 'error')
      });
    }
  }

  resetForm() {
    this.newBook = {
      title: '',
      author: '',
      isbn: '',
      category: '',
      totalCopies: 1,
      availableCopies: 1
    };
  }

  showMessage(message: string, type: string) {
    this.message = message;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }
}
