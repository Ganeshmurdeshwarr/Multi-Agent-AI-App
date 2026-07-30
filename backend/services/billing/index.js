import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/billing.routes.js';

dotenv.config();
const port = process.env.PORT || 8000;
const app = express();
app.use(express.json());




app.use("/",router)

app.listen(port, () => {
  console.log(`Billing started on port ${port}`);
  connectDB();
});