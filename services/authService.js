const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../data/models/User');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user || !user.isValidPassword(password)) {
            return done(null, false, { message: 'Invalid email or password' });
        }
        return done(null, user);
    } catch (error) {
        done(error);
    }
}));

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.id);
        if (!user) return done(null, false);
        return done(null, user);
    } catch (error) {
        done(error);
    }
}));
