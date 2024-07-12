const express = require('express');
const passport = require('passport');
const { register, login, logout, refreshToken } = require('../controllers/authController');

const router = express.Router();

// Traditional login routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken); // Ensure this line exists

// Social login routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/welcome');
});

router.get('/auth/apple', passport.authenticate('apple', { scope: ['profile', 'email'] }));
router.get('/auth/apple/callback', passport.authenticate('apple', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/welcome');
});

module.exports = router;
