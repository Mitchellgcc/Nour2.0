// backend/config/passport.js
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const fetch = require('node-fetch');
const User = require('../models/User');

// WHOOP OAuth configuration
const whoopOAuthConfig = {
    authorizationURL: 'https://api.prod.whoop.com/oauth/oauth2/auth',
    tokenURL: 'https://api.prod.whoop.com/oauth/oauth2/token',
    clientID: process.env.WHOOP_CLIENT_ID,
    clientSecret: process.env.WHOOP_CLIENT_SECRET,
    callbackURL: process.env.WHOOP_REDIRECT_URI,
    state: true,
    scope: ['read:profile', 'read:recovery', 'read:sleep', 'read:workout', 'read:cycles']
};

const whoopStrategy = new OAuth2Strategy(whoopOAuthConfig, async (accessToken, refreshToken, profile, done) => {
    try {
        const userProfile = await fetchProfile(accessToken);
        let user = await User.findOne({ where: { email: userProfile.email } });

        if (!user) {
            user = await User.create({
                whoopId: userProfile.user_id,
                email: userProfile.email,
                name: userProfile.name || 'Default Name', // Ensure name is provided
                password: 'hashed_password', // Ensure you hash the password
            });
        }

        user.whoopAccessToken = accessToken;
        user.whoopRefreshToken = refreshToken;
        await user.save();

        done(null, user);
    } catch (error) {
        done(error);
    }
});

passport.use('withWhoop', whoopStrategy);

// Google OAuth configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5001/api/auth/google/callback'
},
async (token, tokenSecret, profile, done) => {
    try {
        let user = await User.findOne({ where: { googleId: profile.id } });
        if (!user) {
            user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
            });
        }
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// Apple OAuth configuration
passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    key: process.env.APPLE_PRIVATE_KEY,
    callbackURL: 'http://localhost:5001/api/auth/apple/callback',
    passReqToCallback: true
},
async (req, accessToken, refreshToken, idToken, profile, done) => {
    try {
        let user = await User.findOne({ where: { appleId: profile.id } });
        if (!user) {
            user = await User.create({
                appleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
            });
        }
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

const fetchProfile = async (accessToken) => {
    const response = await fetch('https://api.prod.whoop.com/developer/v1/user/profile/basic', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    const profile = await response.json();
    return profile;
};

// JWT Strategy
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findByPk(jwt_payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        console.error('Error in JWT Strategy:', error);
        return done(error, false);
    }
}));

module.exports = passport;
