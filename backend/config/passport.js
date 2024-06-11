const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fetch = require('node-fetch');
const User = require('../models/User');

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
