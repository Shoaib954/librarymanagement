# Library Management System - MEAN Stack

Complete library management system with Express.js backend (MVC + Pug) and Angular frontend.

## Architecture
- **Backend**: Express.js with MVC pattern and Pug templates
- **Frontend**: Angular 18+ with TypeScript
- **Database**: MongoDB with Mongoose ODM

## Project Structure
```
libm/
├── backend (Express MVC)
│   ├── models/          # MongoDB schemas
│   ├── views/           # Pug templates
│   ├── controllers/     # Business logic
│   ├── routes/          # API & web routes
│   └── server.js        # Main server
└── frontend/library-frontend/  # Angular app
    └── src/app/
        ├── models/      # TypeScript interfaces
        ├── services/    # API services
        └── components/  # Angular components
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (running on localhost:27017)
- Angular CLI: `npm install -g @angular/cli`

### Backend Setup
```bash
# Install dependencies
npm install

# Create admin user (first time only)
npm run create-admin

# Start the backend server
npm start
```
Server runs on http://localhost:3002

### Default Login Credentials
- **Admin**: admin@library.com / admin123
- **Members**: Register new account or use existing member credentials

### Frontend Setup
```bash
cd frontend/library-frontend
npm install
ng serve
```
App runs on http://localhost:4200

## Features
- **Authentication System**: Login for Members and Admins
- **Role-Based Access**: Different permissions for members vs administrators
- **Dashboard**: Real-time statistics with personalized content
- **Book Management**: Add, view, delete books with inventory tracking (Admin)
- **Member Management**: Register library members (Admin)
- **Member Portal**: Personal profile and transaction history
- **Transaction System**: Issue/return books with category-based due dates
- **Smart Due Dates**: Different loan periods by book category
  - Fiction: 14 days (2 weeks)
  - Non-Fiction: 21 days (3 weeks)
  - Science: 28 days (4 weeks)
  - Technology: 28 days (4 weeks)
  - History: 21 days (3 weeks)
- **Fine Calculation**: Automatic overdue fine calculation ($5/day)
- **Dual Interface**: Both Pug templates and Angular frontend

## API Endpoints
- `GET /api/books` - Get all books
- `POST /api/books` - Add new book
- `DELETE /api/books/:id` - Delete book
- `GET /api/members` - Get all members
- `POST /api/members` - Add new member
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions/issue` - Issue book
- `GET /api/loan-periods` - Get loan periods by category
- `POST /api/calculate-due-date` - Calculate due date for a book
- `GET /overdue` - View overdue members and fines
- `GET /overdue/api` - Get overdue members data (JSON)

## Access Points
- **Login Page**: http://localhost:3002 (redirects to login)
- **Web Interface (Pug)**: http://localhost:3002/dashboard (after login)
- **Angular Frontend**: http://localhost:4200
- **API**: http://localhost:3002/api

## User Roles
### Admin Features
- Full book management (add, edit, delete)
- Member management
- Issue/return books
- View all transactions
- System statistics

### Member Features
- Browse books
- View personal transaction history
- Manage profile
- View due dates and fines

## Database Schema
### Book
- title, author, isbn, category
- totalCopies, availableCopies
- publishedYear, timestamps

### Member
- name, email, phone, address
- membershipId (auto-generated)
- password (hashed), isActive

### Transaction
- book (ref), member (ref)
- type (issue/return), status
- issueDate, dueDate, returnDate
- fine calculation for overdue books