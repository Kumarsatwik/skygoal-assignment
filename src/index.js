import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import { dbConnect } from "./utils/dbConnect.js";
import authRoutes from "./routes/auth.routes.js";

dbConnect();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server is running on port ", port);
});
