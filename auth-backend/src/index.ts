import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./route/auth";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/user", userRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
