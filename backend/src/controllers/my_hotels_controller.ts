import { Request, Response } from "express";
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "../models/hotel";
export const addHotel = async (req: Request, res: Response) => {
  try {
    const imageFiles = req.files as Express.Multer.File[]; //get the files from multer middleware
    const newHotel: HotelType = req.body;
    //! 1. upload images to cloudinary

    const uploadPromises = imageFiles.map(async (image) => {
      //* loop over all images and store them in cloudinary

      const base64 = Buffer.from(image.buffer).toString("base64"); //converts image to base64 string so that it can be processed by cloudinary
      let dataURI = "data:" + image.mimetype + ";base64," + base64; //mimetype is format of image i,e, jpeg, jpg
      const res = await cloudinary.v2.uploader.upload(dataURI); //upload to cloudinary
      return res.url; //return url given by cloudinary where it stored the image.
    });

    const imageUrls = await Promise.all(uploadPromises); //above function is async so it will return a array of promises for all images upload combined. So we are waiting for all promises to be completed

    //! 2. if successful add url to the new hotel object

    newHotel.imageUrls = imageUrls;
    newHotel.lastUpdated = new Date();
    newHotel.userId = req.userId; //when verify token is called it sets userId in req.
    //! 3. save that object in db

    const hotel = new Hotel(newHotel); //create new hotel in db
    await hotel.save();

    //! 4.if all good, return a 201 status
    res.status(201).send(hotel);
  } catch (error) {
    console.log("error creating hotel: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
