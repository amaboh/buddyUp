import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import dotenv from "dotenv";

import { google } from "googleapis";

import { createActivationToken, createAccessToken, createRefreshToken} from "../utils/tokens.js"
import sendEmail from "../utils/sendEmail.js"

dotenv.config();

const {CLIENT_URL} = process.env
// signUp user

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if(!username || !email || !password) return res.status(400).json({msg: "Please fill all fields."})

    if(!validateEmail(email)) return res.status(400).json({msg: "Invalid email format"})

    const oldUser = await User.findOne({ username });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    if(password.length < 7) return res.status(400).json({msg :"Password must be at least 6 charactrs."})

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = {
      ...req.body,
      password: hash,
    };

    const activation_token = createActivationToken(newUser)

    const url = `${CLIENT_URL}/user/activate/${activation_token}`
    sendEmail(email, url, "Verify your email address")

    res.status(200).json({msg: "Registration Successful! Please activate your email to start."});
  } catch (err) {
    res.status(500).json({msg: err.message});
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
    const token = jwt.sign(
      {
        username: user.username,
        id: user._id,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ userDetails: { ...otherDetails }, isAdmin, token });
  } catch (error) {
    res.status(500).json(error);
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

// Login failed
export const loginFailed = (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
};

export const logout = (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
};


function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}