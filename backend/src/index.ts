import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import myHotelsRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

//* Setup Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//connecting to the database using string provided by MongoDB ( while setting up in web)
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();
// const ipAddress = "192.168.0.166";

app.use(cookieParser());
app.use(express.json()); //helps to parse body form requests
app.use(express.urlencoded({ extended: true })); //helps to parse url. e.g. to get query params
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL as string,
      "https://easy-book-server.vercel.app/",
    ],
    credentials: true,
  })
); //security - prevents certain req from certain urls

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelsRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);

//catch all routes - catch all requests which are not api request be handled by html file i.e. our frontend. it will use react router :)
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

//start the server on port - 3000 and on local network with ip 192.168.0.166

app.listen(3000, () => {
  console.log("server is running on port: 3000");
});
