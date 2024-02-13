import { Request, Response } from "express";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";

//! Add Hotel

export const addHotel = async (req: Request, res: Response) => {
  try {
    const imageFiles = req.files as Express.Multer.File[]; //get the files from multer middleware
    const newHotel: HotelType = req.body;
    //! 1. upload images to cloudinary

    const imageUrls = await uploadImagesToCloudinary(imageFiles); //get the image URLs from cloudinary after uploading the images.

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

//! Get user's Hotels
export const getAllMyHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Hotels" });
  }
};

//! get User's Hotel By Id
export const getUserHotelById = async (req: Request, res: Response) => {
  const id = req.params.id.toString(); //get the id from url(query param)
  try {
    const hotel = await Hotel.findOne({ _id: id, userId: req.userId }); //get hotel by id and confirm userId in Hotel doc with logged in user's id;

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
};

export const updateHotel = async (req: Request, res: Response) => {
  try {
    //get the data from body
    const updatedHotel: HotelType = req.body;
    updatedHotel.lastUpdated = new Date();

    //find the hotel with id and update the fileds with new created updatedHotel object
    const hotel = await Hotel.findOneAndUpdate(
      {
        _id: req.params.hotelId,
        userId: req.userId,
      },
      updatedHotel,
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ message: "Hotel Not Found" });
    }

    //now get the image files from req
    const newImageFiles = req.files as Express.Multer.File[];

    //upload them to cloudinary and get the urls in return.
    const updatedImageUrls = await uploadImagesToCloudinary(newImageFiles);

    /* add the newly created image link to hotel.
    but we have previously created image urls here too. we have those in updatedHotel which we got from req.body.just spread them in this array as they are already imageUrls. if not present i.e. if user deletes all exising images while uploading then pass empty array. */

    hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])];

    //save the hotel
    await hotel.save();

    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};
async function uploadImagesToCloudinary(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    //* loop over all images and store them in cloudinary
    const base64 = Buffer.from(image.buffer).toString("base64"); //converts image to base64 string so that it can be processed by cloudinary
    let dataURI = "data:" + image.mimetype + ";base64," + base64; //mimetype is format of image i,e, jpeg, jpg
    const res = await cloudinary.v2.uploader.upload(dataURI); //upload to cloudinary
    return res.url; //return url given by cloudinary where it stored the image.
  });

  const imageUrls = await Promise.all(uploadPromises); //above function is async so it will return a array of promises for all images upload combined. So we are waiting for all promises to be completed
  return imageUrls;
}
