import passportGoogle from "passport-google-oauth20";
import passportGithub from "passport-github2";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

const GoogleStrategy = passportGoogle.Strategy;
const GithubStrategy = passportGithub.Strategy;

dotenv.config();

import passport from "passport";
import User from "../models/User.js";
;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5007/auth/google",
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        socialId: profile.id,
        username: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profilePicture: profile.photos[0].value,
      };

      try {
        let user = await User.findOne({ socialId: profile.id });

        if (user) {
          done(null, user);
        } else {
          const dbUser = new User(newUser);
          await dbUser.save();
          done(null, user);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(profile.id, salt);
      const newUser = {
        socialId: profile.nodeId,
        username: profile.username,
        displayName: profile.displayName,
        socialProfile: profile.profileUrl,
        profilePicture: profile.photos[0].value,
        password: hash
      };

      try {
     
        let user = await User.findOne({ socialId: profile.nodeId });

        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

export default passport;
