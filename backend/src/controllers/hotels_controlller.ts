import { Request, Response } from "express";
import Hotel from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";

export const getHotels = async (req: Request, res: Response) => {
  try {
    console.log("*** before any modification query : - ", req.query);

    //add the regexp to query object using below function. This will add what user typed in search box and convert it to reg ex object which we can pass to Hote.find() below to filter hotels.
    const query = constructSearchQuery(req.query);

    console.log("*** after creating search Query :- ", query);

    let sortOption = {};

    switch (req.query.sortOption) {
      case "starRating":
        sortOption = { starRating: -1 }; //-1 means sort high to low
        break;
      case "pricePerNightAsc":
        sortOption = { pricePerNight: 1 }; //1 means low to high i.e. ascending
        break;
      case "pricePerNightDesc":
        sortOption = { pricePerNight: -1 };
        break;
    }

    //* Adding pagination logic first

    //max page size
    const pageSize = 5;

    //get current page from frontend in req.
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );

    //now to skip pages use this logic.
    //how it work - suppose we are on 3rd page then we need to skip first 10 hotels as our each page displays 5 hotels each. so -> (3-1)*5 = 10. we get 10 to skip 10 hotels. similarly for 4th page -> (4-1)*5 = 15.

    const skip = (pageNumber - 1) * pageSize;

    //these below options will run in order. i.e. first find hotels and then sort then skip pages then paginate pages.
    const hotels = await Hotel.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize); //Find hotels according to PageSize and Skipped Hotels

    //count total hotels present in db
    const total = await Hotel.countDocuments(query);

    /* 
       Now send this data back to frontend
       Pass hotels after all skipping
       Pass total hotel number
       Pass pages required to show all hotels. i.e. Total Hotels/ Page Size e.g. 100pages/5page size = 20pages
     */
    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };
    //send response back
    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  //with $or we are telling mongoDB to give result if destination string either matches with city or contry.
  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") }, //i flag matches strings of city or country regardless of their case
      { country: new RegExp(queryParams.destination, "i") }, //also using req exp gives us autocomplete like feature e.g. if I pass "pu" in destination it would still match with pune or any other strings which has pu in it.
    ];
  }
  /* above constructedQuery will give output like this if typed "a" in destination - '$or': [ { city: /a/i }, { country: /a/i } ], i.e. either match a in city or country.*/

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount), //$gte is greater than flag.
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  //return all selected facilities depending upon if user selects one then its a string so converting it to string array and if already a string array then just returning it.
  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  //Hotel can only have 1 type so we are using $in mongoDB query filter here.
  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(), //$lte is less than or equal to flag.
    };
  }

  return constructedQuery;
};
