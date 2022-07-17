import express from "express";
import passport from "passport";
import { signUp, login, loginSuccess, loginFailed, logout } from "../controllers/AuthControllers.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);

router.get("/login/success", loginSuccess);
router.get("/login/failed", loginFailed);
router.get("/logout", logout);

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get(
    "/google/callback",
    passport.authenticate("google", {
        successReirect: process.env.CLIENT_URL, 
        failureRedirect: "login/failed"
    })
);


router.get("/github", passport.authenticate("github", { scope: ["profile"] }));
router.get(
    "/github/callback",
    passport.authenticate("github", {
      successRedirect: process.env.CLIENT_URL,
      failureRedirect: "/login/failed",
    })
  );


export default router;
