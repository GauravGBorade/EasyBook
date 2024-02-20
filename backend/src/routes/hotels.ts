import express from "express";
import { getHotels } from "../controllers/hotels_controlller";
const router = express.Router();

// URL -> /api/hotels/search?

//get all hotels
router.get("/search", getHotels);

export default router;
