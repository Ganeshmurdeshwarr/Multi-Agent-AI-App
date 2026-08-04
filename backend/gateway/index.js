import express from 'express';
import dotenv from 'dotenv';
import proxy from 'express-http-proxy';
import cookieParser from 'cookie-parser';
import cors from "cors"
import { protect } from './middleware/auth.middleware.js';
import { getCurrentUser } from './controller/user.controller.js';
import { proxyWithHeader } from './utils/proxyWithHeader.js';
import morgan from "morgan"

dotenv.config();
const port = process.env.PORT || 8000;
const app = express();
app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials:true
}))
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));app.use(morgan("dev"))
app.use(cookieParser())


app.use("/api/auth", proxy(process.env.AUTH_SERVICE));
app.use("/api/chat", protect, proxyWithHeader(process.env.CHAT_SERVICE));
app.use("/api/billing", protect, proxyWithHeader(process.env.BILLING_SERVICE));
app.use("/api/agent", protect, proxyWithHeader(process.env.AGENT_SERVICE));
dotenv.config();

console.log("BILLING_SERVICE:", process.env.BILLING_SERVICE);
app.use("/api/me", protect, getCurrentUser);

app.use("/", (req, res) => {
  res.json({ message: `Gateway received request for ALL IS WELL FOR SURE` });
});

app.listen(port, () => {
  console.log(`Gateway is running on port ${port}`);
});