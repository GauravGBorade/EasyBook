import express from "express";
import { addHotel, getMyHotels } from "../controllers/my_hotels_controller";
import upload from "../middleware/multer_middleware";
import verifyToken from "../middleware/auth_middleware";
import { body } from "express-validator";
const router = express.Router();

//route - api/my-hotels
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("country").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel Type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("country").notEmpty().withMessage("Name is required"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("facilities are required"),
  ],
  upload.array("imageFiles", 6), //call upload middleware to accept imageFiles from frontend. we will set name for input filed as imageFiles.
  addHotel
); //upload middleware is to store files submitted by user in memoryStorage using multer until we upload them to cloudinary

//! Get all Hotels
router.get("/", verifyToken, getMyHotels);

export default router;
