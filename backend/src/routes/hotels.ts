import express from "express";
import { getAnyHotelById, getHotels } from "../controllers/hotels_controlller";
import { param } from "express-validator";
const router = express.Router();

// URL -> /api/hotels
router.get(
  "/hotel/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required.")],
  getAnyHotelById
);

//get all hotels
router.get("/search", getHotels);

export default router;
