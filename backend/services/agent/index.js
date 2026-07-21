import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import router from "./routes/agent.route.js";


const port = process.env.PORT;
const app = express();
app.use(express.json());

app.use("/" ,router )


app.listen(port, () => {
  console.log(`agent started on port ${port}`);
  connectDB();
});
