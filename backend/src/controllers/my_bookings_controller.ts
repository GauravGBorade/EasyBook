import { Request, Response } from "express";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    //finding user booked hotel will required 2 steps. first get the hotels which are booked by user. but catch here is we will get hotel objects and that object will still contain the bookings array with all user's bookings in it.e.g. if I booked 2 hotels, first function will give those 2 hotels object but that object will still contain bookings[] with all user bookings.
    //so do second step. first loop over all user hotel objects and create array of bookings where bookings are only made by user. then create new hotel object with all properties from current object but replace bookings with our new user specific bookings.
    const hotels = await Hotel.find({
      bookings: {
        $elemMatch: { userId: req.userId },
      },
    });

    const results = hotels.map((hotel) => {
      const userBookings = hotel.bookings.filter(
        (booking) => booking.userId === req.userId
      );
      const hotelWithUserBookings: HotelType = {
        ...hotel.toObject(),
        bookings: userBookings,
      };
      return hotelWithUserBookings;
    });

    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
};
