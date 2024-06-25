// backend/app.js

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
require('./config/passport');

const { sequelize, connectMongoDB, disconnectMongoDB } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const mealRoutes = require('./routes/mealRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const whoopRoutes = require('./routes/whoopRoutes');
const userRoutes = require('./routes/userRoutes');
const mealUploadController = require('./controllers/mealUploadController');
const userPreferencesRoutes = require('./routes/userPreferencesRoutes');
const userFeedbackRoutes = require('./routes/userFeedbackRoutes');

console.log('Environment variables loaded:');
console.log('POSTGRESQL_URI:', process.env.POSTGRESQL_URI);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('WHOOP_CLIENT_ID:', process.env.WHOOP_CLIENT_ID);
console.log('WHOOP_CLIENT_SECRET:', process.env.WHOOP_CLIENT_SECRET);
console.log('WHOOP_REDIRECT_URI:', process.env.WHOOP_REDIRECT_URI);
console.log('WHOOP_API_BASE_URL:', process.env.WHOOP_API_BASE_URL);

const app = express();

// Establish database connections
(async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connected');
        await connectMongoDB();
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); // Exit if database connection fails
    }
})();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    store: new SequelizeStore({ db: sequelize }),
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/whoop', whoopRoutes);
app.use('/api/users', userRoutes); // Corrected the endpoint path
app.post('/api/mealUpload', mealUploadController.handleMealUpload);
app.use('/api/user/preferences', userPreferencesRoutes);
app.use('/api/user/feedback', userFeedbackRoutes);

app.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Welcome to your dashboard');
    } else {
        res.redirect('/login');
    }
});

app.get('/', (req, res) => {
    res.send('NOUR2.0 API');
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
});

const gracefulShutdown = () => {
    disconnectMongoDB().then(() => {
        console.log('MongoDB disconnected');
        sequelize.close().then(() => {
            console.log('PostgreSQL disconnected');
            process.exit(0);
        }).catch(err => {
            console.error('Error closing PostgreSQL:', err);
            process.exit(1);
        });
    }).catch(err => {
        console.error('Error closing MongoDB:', err);
        process.exit(1);
    });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

module.exports = app;
