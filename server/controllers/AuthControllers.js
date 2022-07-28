import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

import { google } from "googleapis";

import {
  createActivationToken,
  createAccessToken,
  createRefreshToken,
} from "../utils/tokens.js";
import sendEmail from "../utils/sendEmail.js";

const { CLIENT_URL } = process.env;
// signUp user

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ msg: "Please fill all fields." });

    if (!validateEmail(email))
      return res.status(400).json({ msg: "Invalid email format" });

    const oldUser = await User.findOne({ username });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    if (password.length < 7)
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 charactrs." });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = {
      ...req.body,
      password: hash,
    };

    const activation_token = createActivationToken(newUser);

    const url = `${CLIENT_URL}/auth/activate/${activation_token}`;
    sendEmail(email, url, "Verify your email address");

    res.status(200).json({
      msg: "Registration Successful! Please activate your email to start.",
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const activateEmail = async (req, res) => {
  try {
    const { activation_token } = req.body;
    const user = jwt.verify(
      activation_token,
      process.env.ACTIVATION_TOKEN_SECRET
    );
    const { username, email, password } = user;

    const check = await User.findOne({ email });
    if (check)
      return res.status(400).json({ msg: "This email already exists." });

    const newUser = new User({ username, email, password });

    await newUser.save();
    res.json({ msg: "Account has been activated!" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
// Login User

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    // implementing authorization with JWT
    const refresh_token = createRefreshToken({ id: user._id });

    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "auth/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
      })
      .status(200)
      .json({
        userDetails: { ...otherDetails },
        isAdmin,
        msg: "Login successful",
      });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Login success
export const loginSuccess = (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      cookies: req.cookies,
    });
  }
};

export const getAccessToken = (req, res) => {
  try {
    const rf_token = req.cookies.refreshtoken;
    if (!rf_token) return res.status(400).json({ msg: "please login now!" });

    jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(err).json({ msg: "Please login now!" });

      const access_token = createAccessToken({ id: user.id });
      res.json({ access_token });
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "This email does not exist." });

    const access_token = createAccessToken({ id: user._id });
    const url = `${CLIENT_URL}/auth/reset/${access_token}`;

    sendEmail(email, url, "Reset yoou password");
    res.json({ msg: "Re-send the password, please check your email." });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    console.log(password);

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await User.findOneAndUpdate({ _id: req.user.id }, { password: hash });

    res.json({ msg: "Password successfully changed!" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};


// Login failed
export const loginFailed = (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
};

export const logout = async (req, res, next) => {
  try {

    res.clearCookie("refreshtoken", { path: "/auth/refresh_token" })
    return res
      .json({ msg: "Logged out" })
      .redirect(process.env.CLIENT_URL);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
