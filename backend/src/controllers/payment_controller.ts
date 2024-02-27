import { Request, Response } from "express";
import Stripe from "stripe";
import Hotel from "../models/hotel";
import { BookingType } from "../shared/types";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

//! Controller function to create a payment intent
export const createPaymentIntent = async (req: Request, res: Response) => {
  // Extracting required information from the request body and parameters
  const { numberOfNights } = req.body;
  const hotelId = req.params.hotelId;

  // Retrieve hotel details from the database using the provided hotelId
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    // If hotel is not found, respond with an error
    return res.status(400).json({ message: "Hotel Not Found" });
  }

  // Calculate the total cost based on the price per night and the number of nights
  const totalCost = hotel.pricePerNight * numberOfNights;

  // Create a payment intent using the Stripe API
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalCost * 100,
    currency: "INR",
    metadata: {
      hotelId,
      userId: req.userId,
    },
    description: "EasyBook",
    shipping: {
      name: "Random singh",
      address: {
        line1: "510 Townsend St",
        postal_code: "98140",
        city: "San Francisco",
        state: "CA",
        country: "US",
      },
    },
  });

  // Check if the payment intent was created successfully
  if (!paymentIntent.client_secret) {
    // If not, respond with an error
    return res.status(500).json({ message: "Error Creating Payment Intent" });
  }

  // If successful, prepare the response with payment intent details
  const response = {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret.toString(),
    totalCost,
  };

  // Send the response back to the client
  res.send(response);
};

//!create hotel booking

export const createBooking = async (req: Request, res: Response) => {
  try {
    // Extract paymentIntentId from the request body
    const paymentIntentId = req.body.paymentIntentId;

    // Retrieve the payment intent details from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId as string
    );

    // Check if the payment intent exists
    if (!paymentIntent) {
      return res.status(500).json({ message: "Payment intent not found" });
    }

    // Verify that the payment intent matches the hotelId and userId.
    // we are doing that because anyone can call this api if they are logged in e.g. using postman they can access it. so we are adding extra check. we are comparing what user created payment intent before and who made payment and is now accessing this api.
    if (
      paymentIntent.metadata.hotelId !== req.params.hotelId ||
      paymentIntent.metadata.userId !== req.userId
    ) {
      return res.status(400).json({ message: "Payment intent mismatch" });
    }

    // Check if the payment intent has succeeded
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        message: `Payment intent not succeeded. Status: ${paymentIntent.status}`,
      });
    }

    // Find the hotel document
    const hotel = await Hotel.findOne({ _id: req.params.hotelId });

    // Check if the hotel is found
    if (!hotel) {
      return res.status(400).json({ message: "Hotel not found" });
    }

    // Create a new booking object with userId and other details from the request
    const newBooking: BookingType = {
      ...req.body,
      userId: req.userId,
    };

    // Push the new booking to the bookings array
    hotel.bookings.push(newBooking);

    // Save the updated hotel document
    const updatedHotel = await hotel.save();

    // Check if the save operation was successful
    if (!updatedHotel) {
      return res.status(500).json({ message: "Error updating hotel" });
    }
    // Respond with a success status
    res.status(200).send();
  } catch (error) {
    // Log any errors and respond with a generic error message
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
