import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';

import passport from 'passport';
import userModel from '~/models/userModel';
import dotenv from 'dotenv';
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        if (profile.id) {
          const user = await userModel.findOne({ googleId: profile.id, email: profile.emails[0]?.value });
          if (user) {
            return cb(null, user);
          } else {
            const newUser = new userModel({
              googleId: profile.id,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails[0]?.value,
              avatar: {
                public_id: profile.photos[0]?.value,
                url: profile.photos[0]?.value,
              },
              typeLogin: profile.provider,
            });
            await newUser.save();
            return cb(null, newUser);
          }
        }
      } catch (error) {
        return cb(error);
      }
    },
  ),
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/api/auth/facebook/callback',
      profileFields: ['photos', 'name', 'email'],
      enableProof: true,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        if (profile.id) {
          const user = await userModel.findOne({ facebookId: profile.id, email: profile.emails[0]?.value });
          if (user) {
            return cb(null, user);
          } else {
            const newUser = new userModel({
              facebookId: profile.id,
              firstName: profile._json.first_name,
              lastName: profile._json.last_name,
              email: profile.emails[0]?.value,
              avatar: {
                public_id: profile.photos[0].value,
                url: profile.photos[0].value,
              },
              typeLogin: profile.provider,
            });
            await newUser.save();
            return cb(null, newUser);
          }
        }
      } catch (error) {
        return cb(error);
      }
    },
  ),
);
