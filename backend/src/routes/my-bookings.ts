import express from "express";
import verifyToken from "../middleware/auth_middleware";
import { getMyBookings } from "../controllers/my_bookings_controller";
const router = express.Router();

//URL - api/my-bookings
router.get("/", verifyToken, getMyBookings);

export default router;
