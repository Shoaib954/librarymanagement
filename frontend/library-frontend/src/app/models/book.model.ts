export interface Book {
  _id?: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  publishedYear?: number;
  createdAt?: Date;
  updatedAt?: Date;
}