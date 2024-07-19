// backend/routes/whoopRoutes.js

const express = require('express');
const passport = require('passport');
const { syncWhoopData } = require('../controllers/whoopController');
const router = express.Router();

router.get('/auth/whoop', passport.authenticate('withWhoop'));

router.get('/redirect', passport.authenticate('withWhoop', { failureRedirect: '/error-page' }), (req, res) => {
    if (!req.user) {
        return res.redirect('/error-page');
    }
    res.redirect('/dashboard');
});

router.get('/sync-data', passport.authenticate('jwt', { session: false }), syncWhoopData);

router.get('/error-page', (req, res) => {
    res.send('An error occurred during the authentication process.');
});

module.exports = router;
