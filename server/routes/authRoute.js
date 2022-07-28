import express from "express";
import passport from "passport";
import {
  signUp,
  login,
  loginSuccess,
  loginFailed,
  logout,
  activateEmail,
  getAccessToken,
  forgotPassword,
  resetPassword,
} from "../controllers/AuthControllers.js";

import { verifyToken } from "../middleware/verifyAdmin.js";

const router = express.Router();

const CLIENT_URL = "http://localhost:3000/";

router.post("/signup", signUp);
router.post("/activation", activateEmail);
router.post("/login", login);
router.post("/refresh_token", getAccessToken);
router.post("/forgot", forgotPassword);
router.post("/reset", verifyToken, resetPassword);


router.get("/login/success", loginSuccess);
router.get("/login/failed", loginFailed);
router.get("/logout", logout);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successReirect: CLIENT_URL,
    failureRedirect: "login/failed",
  })
);

router.get("/github", passport.authenticate("github", { scope: ["profile"] }));
router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

export default router;
