import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";

const HotelDetails = () => {
  const { hotelId } = useParams();
  let starCount = 1;
  const { data: hotel } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId, // Wont render this component if hotelId is undefined.
    }
  );

  if (!hotel) {
    return <></>;
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="flex">
          {Array.from({ length: hotel.starRating }).map(() => (
            <AiFillStar
              className="fill-yellow-400"
              key={`starCount-${starCount++}`}
            />
          ))}
        </span>
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
        <span>
          {hotel.city}
          {", "}
          {hotel.country}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {hotel.imageUrls.map((image, index) => (
          <div key={`image-${index}`} className="h-[350px]">
            <img
              src={image}
              alt={hotel.name}
              className="rounded-md shadow-xl w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {hotel.facilities.map((facility, index) => (
          <div
            key={`facility-${index}`}
            className=" text-center border border-slate-300 rounded-sm p-4"
          >
            {facility}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <div className="whitespace-pre-line">{hotel.description}</div>
        <div className="h-fit 2xl:max-w-[600px] 2xl:ml-20">
          <GuestInfoForm
            hotelId={hotel._id}
            pricePerNight={hotel.pricePerNight}
          />
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
