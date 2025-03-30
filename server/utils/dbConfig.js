import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

export const connectDB = async () =>{
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connection successfull. Host: ${connection.connection.host}`);
    }catch(err){
        console.log("Database error : ", err);
    }
};
