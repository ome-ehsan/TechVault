import toast from "react-hot-toast";
import bcrypt from "bcryptjs"

export const hashKey = async (key)=>{
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedKey = await bcrypt.hash(key,salt);
        return hashedKey ;
    } catch (error) {
        toast.error(error.message);
    }
}