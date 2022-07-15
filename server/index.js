import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// routes
import authRoute from "./routes/authRoute.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "https://localhost:3000",
    methods: ["GET", "POST", "PUT"],
  })
);

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
app.use("/api/auth/", authRoute);

app.listen(PORT, () => {
  connect();
  console.log(`server connected to http://localhost:${PORT}`);
});
