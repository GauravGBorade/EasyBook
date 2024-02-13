import mongoose from "mongoose";
import { HotelType } from "../shared/types";

const hotelSchema = new mongoose.Schema<HotelType>({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  adultCount: {
    type: Number,
    required: true,
  },
  childCount: {
    type: Number,
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  starRating: { type: Number, required: true, min: 1, max: 5 }, // Hotel rating can be between 1 to 5
  facilities: [{ type: String, required: true }],
  imageUrls: [{ type: String, required: true }],
  lastUpdated: { type: Date, required: true },
});

const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);
export default Hotel;