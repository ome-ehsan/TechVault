import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { connectDB } from './utils/dbConfig.js';
import { authRouter } from './routes/authRoutes.js';
dotenv.config();

const port = process.env.PORT || 8001;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : 'http://localhost:5173',
    credentials: true
}));
app.use("/api/auth",authRouter);


app.listen( port, ()=>{
    console.log("Server started on port", port);
    connectDB();
});