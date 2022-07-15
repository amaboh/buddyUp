import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";


dotenv.config()

const app = express();

app.use(cookieParser)


app.use(cors({
    origin: 'https://localhost:3000',
    method: ["GET, POST, PUT, DELETE"],
}))

const PORT = process.env.PORT || 3000;

const connect = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB)
        console.log("MongoDB server connected")
    } catch (error) {
        throw error;     
    }
};


mongoose.connection.on("disconnected", ()=>{
    console.log("mongoDB disconnected!")
})


app.listen(PORT, ()=>{
    connect();
    console.log(`server connected to http://localhost:${PORT}`);
})



