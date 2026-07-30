import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import redis from "../../../shared/redis/redis.js";
import User from "../models/user.model.js";

export const login = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = await getAuth(app).verifyIdToken(token);

    let user = await User.findOne({
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
    await redis.set(
      `user-session-${user?._id}`,
      sessionId,
      "EX",
      60 * 60 * 24 * 7,
    );
    await redis.set(
      `session-${sessionId}`,
      JSON.stringify({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
        planExpiresAt: user.planExpireAt,
      }),
      "EX",
      60 * 60 * 24 * 7,
    );

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

export const logout = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;
    await redis.del(`session-${sessionId}`);

    res.clearCookie("session");
    return res
      .status(200)
      .json({ success: true, message: "user logout successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUserPayment = async (req, res) => {
  try {
    console.log("UPDATE PLAN CALLED");
    console.log("BODY:", req.body);
    const { userId, plan, credits } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.plan = plan;
    user.credits += credits;
    user.totalCredits += credits;
    user.planExpireAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await user.save();

    const sessionId = await redis.get(`user-session-${user?._id}`);

    if (sessionId) {
      await redis.set(
        `session-${sessionId}`,
        JSON.stringify({
          _id: user._id,
          email: user.email,
          avatar: user.avatar,
          name: user.name,
          plan: user.plan,
          credits: user.credits,
          totalCredits: user.totalCredits,
          planExpiresAt: user.planExpireAt,
        }),
        "EX",
        60 * 60 * 24 * 7,
      );
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log("update user error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deductCredits = async (req, res) => {
  try {
    const { userId, agent } = req.body;

    const COST = {
      chat:1, search:5, coding:10, pdf: 10, ppt: 10, image: 10,};

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const requiredCredits = COST[agent] || 1;

    if (user.credits < requiredCredits) {
      return res.status(400).json({
        success: false,
        message: "Not enough credits.",
      });
    }

    user.credits -= requiredCredits;

    await user.save();

    const sessionId = await redis.get(`user-session-${user?._id}`);

    if (sessionId) {
      await redis.set(
        `session-${sessionId}`, JSON.stringify({
          _id: user._id,
          email: user.email,
          avatar: user.avatar,
          name: user.name,
          plan: user.plan,
          credits: user.credits,
          totalCredits: user.totalCredits,
        }), "EX",60 * 60 * 24 * 7,
      );
    }

    return res.json({
      success: true,
      credits: user.credits,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
