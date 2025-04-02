import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcrypt from "bcryptjs";
import { User } from "../model/userModel.js";
dotenv.config();

export const authenticate = async ( req , res , next ) => {
    try {
        const token  = req.cookies.jwt;
        if(!token) return res.status(401).json( { msg : "Uauthorized - No token given"});
        // decode token
        const decodedToken = jwt.verify(token, process.env.SECRET );
        if(!decodedToken) return res.status(401).json( { msg : "Invalid token"});
        // check db 
        const user = await User.findById(decodedToken.userId).select("-password");
        if(!user) return res.status(404).json( { msg : "Invalid user"});
        req.user = user;
        next();
    } catch (error) {
        console.log("Authentication error", error.message);
        return res.status(500).json( {msg : "Internal server error"});
    }
};


export const authorizeAdmin = async (req,res,next)=> {
    try {
        if( req.body.role === 'admin' && req.body.adminKey){
            const isValidKey = await bcrypt.compare(process.env.ADMIN_KEY, req.body.adminKey); 
            if(!isValidKey){
                return res.status(400).json( {msg : "Invalid Admin Key"} );
            };
            delete req.body.adminKey;
            return next();
        }
        next();
    } catch (error) {
        console.log("Admin Authorization error", error.message);
        return res.status(500).json( {msg : "Internal server error"});
    }
}