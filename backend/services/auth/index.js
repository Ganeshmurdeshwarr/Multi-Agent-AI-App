import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/auth.router.js';

dotenv.config();
const port = process.env.PORT || 8000;
const app = express();
app.use(express.json());



app.use("/" , router)

app.use("/", (req, res) => {
  res.send("Auth service is running");
});

app.listen(port, () => {
  console.log(`Auth started on port ${port}`);
  connectDB();
});