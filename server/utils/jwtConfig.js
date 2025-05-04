import jwt from 'jsonwebtoken'

export const generateJWT = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.SECRET, { expiresIn: "3d" });

    res.cookie("jwt", token, {
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "development" ? "Lax" : "None",
        secure: process.env.NODE_ENV !== "development"
    });

    return token;
};
