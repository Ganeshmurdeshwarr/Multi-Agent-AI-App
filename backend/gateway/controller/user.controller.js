export const getCurrentUser = async(req , res)=>{
    try {
        const user = req.user;
        if(!user){
            return res.status(400).json({message: "Unauthorized"});
        }
        return res.status(200).json({user});
    } catch (error) {
        return res.status(500).json({message: `getCurrentUser error ${error}`});
    }
}