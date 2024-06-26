import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";

const MyHotels = () => {
  const { data: hotelData } = useQuery("fetchMyHotels", apiClient.getMyHotels); //fetch request from apiClient will return response.json() which will always be called as data by useQuery. we destructured it and renamed it to hotelData.

  if (hotelData?.length === 0) {
    return (
      <div className="gap-4 max-w-6xl mx-auto">
        <span>No Hotels Found</span>
        <Link
          to="/add-hotel"
          className="bg-blue-600  text-xl text-white font-bold hove:bg-blue-500 p-2 ml-4"
        >
          Add Property
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-5 flex flex-col gap-4 max-w-6xl mx-auto">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Properties</h1>
        <Link
          to="/add-hotel"
          className="bg-blue-600 flex text-xl text-white font-bold hove:bg-blue-500 p-2"
        >
          Add Property
        </Link>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {hotelData?.map((hotel) => (
          <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5">
            <h2 className="text-2xl font-bold">{hotel.name}</h2>
            <div className="whitespace-pre-line">{hotel.description}</div>
            <div className="grid grid-cols-5 gap-2">
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsMap className="mr-1" />
                {hotel.city},{hotel.country}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsBuilding className="mr-1" />
                {hotel.type}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiMoney className="mr-1" />
                {hotel.pricePerNight} Per Night
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiHotel className="mr-1" />
                {hotel.adultCount} Adults, {hotel.childCount} Children
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiStar className="mr-1" />
                {hotel.starRating} Star Rating
              </div>
            </div>
            {/* redirect user to edit hotel when clicked on view details button. we've passed hotel id along with it which we get from hotel as we are mapping over individual hotel. This will act as query param to get the hotel id in our backend */}
            <span className="flex justify-end ">
              <Link
                className="bg-blue-600 flex text-xl text-white font-bold hove:bg-blue-500 p-2"
                to={`/edit-hotel/${hotel._id}`}
              >
                View Details
              </Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;
