import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') }); 

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import process from 'process';

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, async (jwt_payload, done) => {
  try {
    console.log("JWT_SECRET being used:", process.env.JWT_SECRET);
    console.log("JWT PAYLOAD:", jwt_payload);

    const user = await User.findById(jwt_payload.id);
    console.log("USER FOUND:", user);

    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    console.error("JWT STRATEGY ERROR:", error);
    return done(error, false);
  }
}));

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (isMatch) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Invalid password' });
    }
  } catch (error) {
    return done(error);
  }
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({
      $or: [
        { providerId: profile.id, authProvider: 'google' },
        { email: profile.emails[0].value }
      ]
    });

    if (user) {
      return done(null, user);
    }

    user = new User({
      name: profile.displayName,
      email: profile.emails[0].value,
      authProvider: 'google',
      providerId: profile.id,
      avatar: profile.photos[0].value
    });

    await user.save();
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({
      $or: [
        { providerId: profile.id, authProvider: 'github' },
        { email: profile.emails && profile.emails[0] ? profile.emails[0].value : null }
      ]
    });

    if (user) {
      return done(null, user);
    }

    user = new User({
      name: profile.displayName || profile.username,
      email: profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.local`,
      authProvider: 'github',
      providerId: profile.id,
      avatar: profile.photos[0].value
    });

    await user.save();
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
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});