const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5001/api/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;

let user = await User.findOne({ email });

if (!user) {
  let username = profile.displayName;

  let existingUser = await User.findOne({ username });
  if (existingUser) {
    username = username + "_" + Date.now();
  }

  user = await User.create({
    username,
    email,
    googleId: profile.id,
    avatar: profile.photos?.[0]?.value
  });
} else {
      user.googleId = profile.id;

      if (!user.avatar) {
        user.avatar = profile.photos?.[0]?.value;
      }

      await user.save();
    }

    return done(null, user);
  } catch (err) {
    console.log("GOOGLE AUTH ERROR:", err);
    return done(err, null);
  }
}));