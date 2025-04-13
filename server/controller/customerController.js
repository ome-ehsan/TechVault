export const updateProfile = async (req, res) => {
    const userId = req.user._id;
    const { name,address, phone} = req.body; 
    const updates = {};
    try {
        if ( name ) updates.name = name ;
        if (phone ) updates.phone = phone;
        if (address) updates.address = address;
        // if ( password) {
        //     if (password.length < 6){ 
        //         return res.status(400).json( {
        //         msg : "Password length must be at least 6 characters or more"
        //     });  
        //     } 
        //     //hash pass
        //     const salt = await bcrypt.genSalt(10);
        //     updates.password = await bcrypt.hash(password,salt);
        // };

        // apply updates
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password") ;
        return res.status(200).json({
            msg : "Update Successfull",
            updatedUser 
        })
    } catch (error) {
        console.log("Update error", error.message);
        return res.status(500).json({ msg : "Internal server error"})
    }
}
