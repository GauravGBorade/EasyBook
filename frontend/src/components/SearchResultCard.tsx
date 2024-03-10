import { AiFillStar } from "react-icons/ai";
import { HotelType } from "../../../backend/src/shared/types";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

type Props = {
  hotel: HotelType;
};
const SearchResultCard = ({ hotel }: Props) => {
  let starCount = 1;
  const [facilitiesToShow, setFacilitiesToShow] = useState(
    window.innerWidth < 640 ? 2 : 3
  );
  useEffect(() => {
    const handleResize = () => {
      setFacilitiesToShow(window.innerWidth < 640 ? 2 : 3);
    };

    // Attach the event listener
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg sm:p-8 p-4 gap-8">
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={hotel.imageUrls[0]}
          alt="hotel image"
          className="2xl:w-[80%] w-full h-[350px] object-cover object-center rounded-md"
        />
      </div>
      <div className="grid grid-rows-[1fr_2fr_2fr]">
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
        <div>
          <div className="line-clamp-5">{hotel.description}</div>
        </div>
        <div className="grid grid-col-1 sm:grid-cols-2 items-end whitespace-nowrap">
          <div className="flex gap-1 items-center">
            {hotel.facilities
              .slice(0, facilitiesToShow)
              .map((facility, index) => (
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
          <div className="flex flex-row sm:flex-col justify-between items-end gap-1">
            <span className="font-bold text-xl">
              ₹{hotel.pricePerNight}{" "}
              <span className="font-medium">per night</span>
            </span>
            <Link
              to={`/detail/${hotel._id}`}
              className="bg-blue-600 rounded-md text-white p-2 h-full text-lg sm:text-xl max-w-fit hover:bg-blue-500"
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
