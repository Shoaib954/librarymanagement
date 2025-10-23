import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private apiUrl = 'http://localhost:3002/api';

  constructor(private http: HttpClient) { }

  // Books
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books`);
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(`${this.apiUrl}/books`, book);
  }

  deleteBook(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/books/${id}`);
  }

  // Stats
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}