import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import { connectDB } from './utils/dbConfig.js';
dotenv.config();

const port = process.env.PORT || 8001;
const app = express();

app.listen( port, ()=>{
    console.log("Server started on port", port);
    connectDB();
})