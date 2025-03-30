import { User } from "../model/userModel.js";
import bcrypt from "bcryptjs"
import { generateJWT } from "../utils/jwtConfig.js";


export const register = async (req,res)=>{

    try{
        const { email, name , password, phone } = req.body;
        if (!name || !email || !password || !phone){ 
            return res.status(400).json({ msg : "all fields are required"})
        };
        if (password.length < 6){ 
            return res.status(400).json( {
            msg : "password length must be at least 6 characters or more"
        })
        };
        //check whether user exists or not
        const user = await User.findOne({email});
        if (user){ return res.status(400).json( {msg:"user already exists"} )};

        //hash pass
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //create a new user and save it to mongo db
        const newUser = new User({
            email,
            name,
            password : hashedPassword,
            phone
        });

        if(newUser){
            // generate a jwt token and send it to the user in a cookie 
            generateJWT( newUser._id, res);
            await newUser.save();

            res.status(200).json({
                _id : newUser._id,
                email : newUser.email,
                name : newUser.name,
                role : newUser.role
            });
        } else{
            return res.status(400).json( {msg : "invalid user data"})
        }
    }catch(err){
        console.log(`Sign up error : ${err.message}`);
        return res.status(500).json({ msg : "internal server error"});
    }
};