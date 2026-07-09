import express from 'express';
import dotenv from 'dotenv';
import proxy from 'express-http-proxy';
import cookieParser from 'cookie-parser';
import cors from "cors"
import { protect } from './middleware/auth.middleware.js';
import { getCurrentUser } from './controller/user.controller.js';

dotenv.config();
const port = process.env.PORT || 8000;
const app = express();
app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials:true
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", proxy(process.env.AUTH_SERVICE));
app.use("/api/me", protect ,getCurrentUser);

app.use("/", (req, res) => {
  res.json({ message: `Gateway received request for ` });
});

app.listen(port, () => {
  console.log(`Gateway is running on port ${port}`);
});