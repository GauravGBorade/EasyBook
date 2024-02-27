import express from "express";
import {
  getAllHotels,
  getAnyHotelById,
  getHotels,
} from "../controllers/hotels_controlller";
import { param } from "express-validator";
import verifyToken from "../middleware/auth_middleware";
import {
  createBooking,
  createPaymentIntent,
} from "../controllers/payment_controller";
const router = express.Router();

// URL -> /api/hotels
router.get("/", getAllHotels);

router.get(
  "/hotel/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required.")],
  getAnyHotelById
);

//get all hotels
router.get("/search", getHotels);

//crete payment intent
router.post(
  "/:hotelId/bookings/payment-intent",
  verifyToken,
  createPaymentIntent
);

//create booking after checking payment
router.post("/:hotelId/bookings", verifyToken, createBooking);

export default router;
