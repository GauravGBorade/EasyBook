import { AiFillStar } from "react-icons/ai";
import { HotelType } from "../../../backend/src/shared/types";
import { Link } from "react-router-dom";

type Props = {
  hotel: HotelType;
};
const SearchResultCard = ({ hotel }: Props) => {
  let starCount = 1;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8">
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={hotel.imageUrls[0]}
          alt="hotel image"
          className="2xl:w-[80%] w-full h-[350px] object-cover object-center rounded-md"
        />
      </div>
      <div className="grid grid-rows-[1fr_2fr_3fr]">
        <div>
          <div className="flex items-center">
            <span className="flex">
              {Array.from({ length: hotel.starRating }).map(() => (
                <AiFillStar
                  className="fill-yellow-400"
                  key={`startRating-${starCount++}`}
                />
              ))}
            </span>
            <span className="ml-3 text-md">{hotel.type}</span>
          </div>
          <Link
            to={`/detail/${hotel._id}`}
            className="mt-1 text-2xl font-bold cursor-pointer"
          >
            {hotel.name}
          </Link>
        </div>
        <div className="">
          <div className="line-clamp-4">{hotel.description}</div>
        </div>
        <div className="grid grid-cols-2 items-end whitespace-nowrap">
          <div className="flex gap-1 items-center">
            {hotel.facilities.slice(0, 3).map((facility, index) => (
              <span
                key={`facility-${index}`}
                className="bg-gray-500	text-white p-2 rounded-lg text-xs whitespace-nowrap"
              >
                {facility}
              </span>
            ))}
            <span className="text-sm">
              {hotel.facilities.length > 3 &&
                `+${hotel.facilities.length - 3} more`}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-bold text-xl">
              ₹{hotel.pricePerNight}{" "}
              <span className="font-medium">per night</span>
            </span>
            <Link
              to={`/detail/${hotel._id}`}
              className="bg-blue-600 text-white p-2 h-full text-xl max-w-fit hover:bg-blue-500"
            >
              View More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;
