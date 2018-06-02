const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

// Load User Model
const User = mongoose.model('users');

module.exports = passport => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
      },
      (accessToken, refreshToken, profile, done) => {
        // console.log(accessToken);
        // console.log(profile);

        const image = profile.photos[0].value.substring(
          0,
          profile.photos[0].value.indexOf('?')
        );

        newUser = {
          googleID: profile.id,
          fistName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.email[0],
          image
        };

        // Check for existing user
        User.findOne({
          googleID: profile.id
        }).then(user => {
          if (user) {
            done(null, user);
          } else {
            // Create User
            new User(newUser).save().then(user => done(null, user));
          }
        });
      }
    )
  );
};