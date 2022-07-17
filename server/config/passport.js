import passportGoogle from "passport-google-oauth20";
import passportGithub from "passport-github";
import passport from "passport";


import User from "../models/User";

const GoogleStrategy = passportGoogle.Strategy;
const GithubStrategy = passportGithub.Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback"
        },
        async(accessToken, refreshToken, profile,done)=>{
            const newUser = {
                socialId: profile.id,
                surname: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                profilePicture: profile.photos[0].value,
              }

              try {
                let user = await User.findOne({ googleId: profile.id })

                if (user) {
                  done(null, user)
                }else{
                    user = await User.save(newUser)
                    done(null, user)
                }
              } catch (error) {
                console.log(error)
              }
        }

    )
)

passport.use(
    new GithubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback",
      },
      function (accessToken, refreshToken, profile, done) {
           const newUser = {
                socialId: profile.id,
                username: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                profilePicture: profile.photos[0].value,
              }

              try {
                let user = await User.findOne({ googleId: profile.id })

                if (user) {
                  done(null, user)
                }else{
                    user = await User.create(newUser)
                    done(null, user)
                }
              } catch (error) {
                console.log(error)
              }
      }
    )
  );

passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })



