import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";

//connecting to the database using string provided by MongoDB ( while setting up in web)
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();
// const ipAddress = "192.168.0.166";

app.use(cookieParser());
app.use(express.json()); //helps to parse body form requests
app.use(express.urlencoded({ extended: true })); //helps to parse url. e.g. to get query params
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
); //security - prevents certain req from certain urls

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

//start the server on port - 3000 and on local network with ip 192.168.0.166

app.listen(3000, () => {
  console.log("server is running on port: 3000");
});
