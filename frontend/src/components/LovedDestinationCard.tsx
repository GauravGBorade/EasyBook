import { Link } from "react-router-dom";
import { HotelType } from "../../../backend/src/shared/types";

type Props = {
  hotel: HotelType;
};

const LovedDestinationCard = ({ hotel }: Props) => {
  return (
    <Link
      to={`/detail/${hotel._id}`}
      className="relative cursor-pointer overflow-hidden rounded-md"
    >
      <div className="h-[350px]">
        <img
          src={hotel.imageUrls[0]}
          alt={"hotel - " + hotel.name}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="absolute bottom-0 p-4 bg-black bg-opacity-50 w-full rounded-b-md">
        <span className="text-white font-bold tracking-tight md:text-xl lg:text-2xl 2xl:text-3xl">
          {hotel.name}
        </span>
      </div>
    </Link>
  );
};

export default LovedDestinationCard;