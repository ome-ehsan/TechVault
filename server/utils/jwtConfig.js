import jwt from 'jsonwebtoken'

export const generateJWT = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.SECRET, { expiresIn: "3d" });

    res.cookie("jwt", token, {
        maxAge: 60*60*24*1000*3,  // 3 day
        httpOnly: true,
        sameSite: "none",  // Changed from "strict" to "none"
        secure: true  // Must be true when sameSite is "none"
    })

    return token;
};
