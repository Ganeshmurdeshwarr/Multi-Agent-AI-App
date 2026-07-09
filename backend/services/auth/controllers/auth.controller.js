import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import redis from "../../../shared/redis/redis.js"
import User from "../models/user.model.js";

export const login = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = await getAuth(app).verifyIdToken(token);

    let  user = await User.findOne({
      firebaseUid: decoded.uid,
    });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,

        email: decoded.email,

        name: decoded.name,

        avatar: decoded.picture,

        provider: decoded.firebase?.sign_in_provider,
      });
    }
const sessionId = crypto.randomUUID();

await redis.set(`session-${sessionId}`,
   JSON.stringify({
    userId:user._id,
    name:user.name,
    email:user.email,
    avatar:user.avatar
   }), "EX", 60 * 60 * 24 * 7
)

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const logout = async(req , res)=>{
   try {
     const sessionId = req.cookies?.session ;
     await redis.del(`session-${sessionId}`);
     
    res.clearCookie("session")
    return res.status(200).json({success:true , message:"user logout successfully"})
   } catch (error) {
     return res.status(500).json({
      message: error.message,
    });
   }
}
