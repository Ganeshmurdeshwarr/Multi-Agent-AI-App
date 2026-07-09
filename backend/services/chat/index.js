import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
dotenv.config();
import router from "./routes/chat.routes.js"

const port = process.env.PORT;
const app = express();
app.use(express.json());



app.use("/" , router)



app.listen(port, () => {
  console.log(`chat started on port ${port}`);
  connectDB();
});