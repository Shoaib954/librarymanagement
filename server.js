const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const connectDB = require('./config/database');
const { requireAuth, requireAdmin } = require('./controllers/authController');

const app = express();

// Connect to MongoDB
connectDB();

// View engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'library-management-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Make user available in all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Routes
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.redirect('/auth/login');
});

const dashboardController = require('./controllers/dashboardController');
app.get('/dashboard', requireAuth, dashboardController.dashboard);

app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));
app.use('/books', requireAuth, require('./routes/books'));
app.use('/members', requireAuth, requireAdmin, require('./routes/members'));
app.use('/transactions', requireAuth, requireAdmin, require('./routes/transactions'));
app.use('/overdue', requireAuth, requireAdmin, require('./routes/overdue'));

// Member-specific routes
const memberController = require('./controllers/memberController');
app.get('/my-transactions', requireAuth, memberController.myTransactions);
app.get('/profile', requireAuth, memberController.profile);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});