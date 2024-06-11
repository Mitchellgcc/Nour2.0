require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
require('./config/passport'); // Ensure strategy is loaded

const { sequelize, mongoose } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const mealRoutes = require('./routes/mealRoutes'); // Ensure this is included
const inventoryRoutes = require('./routes/inventoryRoutes');
const whoopRoutes = require('./routes/whoopRoutes');
const userRoutes = require('./routes/userRoutes');

console.log('Environment variables loaded:');
console.log('POSTGRESQL_URI:', process.env.POSTGRESQL_URI);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('WHOOP_CLIENT_ID:', process.env.WHOOP_CLIENT_ID);
console.log('WHOOP_CLIENT_SECRET:', process.env.WHOOP_CLIENT_SECRET);
console.log('WHOOP_REDIRECT_URI:', process.env.WHOOP_REDIRECT_URI);
console.log('WHOOP_API_BASE_URL:', process.env.WHOOP_API_BASE_URL);

const app = express();

sequelize.authenticate()
  .then(() => console.log('PostgreSQL connected'))
  .catch(err => console.error('Unable to connect to PostgreSQL:', err));

mongoose.connection.once('open', () => {
  console.log('MongoDB connected');
}).on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new SequelizeStore({
    db: sequelize,
  }),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set secure to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session()); // Use passport session middleware
console.log("Passport initialized");

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/meals', mealRoutes); // Ensure this is included
app.use('/api/inventory', inventoryRoutes);
app.use('/api/whoop', whoopRoutes);
app.use('/api/user', userRoutes);

// Implement /dashboard route
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('Welcome to your dashboard');
  } else {
    res.redirect('/login'); // Redirect to login if not authenticated
  }
});

app.get('/', (req, res) => {
  res.send('NOUR2.0 API');
  console.log("Root route accessed");
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(`Error encountered: ${err.message}`);
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

module.exports = app;
