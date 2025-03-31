import { User } from "../model/userModel.js";
import bcrypt from "bcryptjs"
import { generateJWT } from "../utils/jwtConfig.js";


export const register = async (req,res)=>{

    try{
        const { email, name , password, phone } = req.body;
        if (!name || !email || !password || !phone){ 
            return res.status(400).json({ msg : "All fields are required"})
        };
        if (password.length < 6){ 
            return res.status(400).json( {
            msg : "Password length must be at least 6 characters or more"
        })
        };
        //check whether user exists or not
        const user = await User.findOne({email});
        if (user){ return res.status(400).json( {msg:"User already exists"} )};

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
            return res.status(400).json( {msg : "Invalid user data"})
        }
    }catch(err){
        console.log(`Sign up error : ${err.message}`);
        return res.status(500).json({ msg : "Internal server error"});
    }
};

export const login = async (req,res)=>{
    //fetch email and pass
    const {email, password} = req.body;
try{

    //check if credentials exist
    if(!email || !password){
        return res.status(400).json( {msg : "Invalid credentials"} );
    };
    //check if user exists
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json( {msg : "Account doesn't exist"} );
    };
    //check if its valid
    const isValidPass = await bcrypt.compare(password, user.password); 
    if(!isValidPass){
        return res.status(400).json( {msg : "Invalid credentials"} );
    };

    generateJWT(user._id,res);
    return res.status(200).json({
        _id : user._id,
        email : user.email,
        name : user.name,
        role : user.role
    });
}catch(err){
    console.log(`Login up error : ${err.message}`);
    return res.status(500).json({ msg : "internal server error"});
}
};

export const logout = async (req,res)=>{
    try {
        res.cookie("jwt","", { maxAge : 0 });
        return res.status(200).json( { msg : "Logged out successfully"});
    } catch (error) {
        console.log(`Logout error : ${error.message}`);
        return res.status(500).json({ msg : "Internal server error"});
    }
}