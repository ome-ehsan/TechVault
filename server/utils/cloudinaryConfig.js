import { v2 as cld } from "cloudinary"
import dotenv from 'dotenv'
dotenv.config();

cld.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
export default cld;
