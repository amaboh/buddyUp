import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authenticateUser from "./config/passport.js";
import passport from "passport";
import cookieSession from "cookie-session";

// access environment variable
dotenv.config();

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SEESION_KEY],
    maxAge: 24 * 60 * 60 * 2000,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 3000;

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("MongoDB server connected");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

// routes entry points
app.use("/auth", authRoute);
app.use("/user", userRoute);

app.listen(PORT, () => {
  connect();
  console.log(`server connected to http://localhost:${PORT}`);
});
