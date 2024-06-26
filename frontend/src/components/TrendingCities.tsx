import { useNavigate } from "react-router-dom";
import { useSearchContext } from "../contexts/SearchContext";

type Props = {
  city: string;
  imagePath: string;
};

const TrendingCities = ({ city, imagePath }: Props) => {
  const search = useSearchContext();
  const navigate = useNavigate();

  const handleClick = () => {
    search.saveSearchValues(city, new Date(), new Date(), 1, 0);
    navigate("/search");
  };
  return (
    <div className="relative group h-[300px] w-full">
      <img src={imagePath} className="h-full w-full object-cover rounded-lg" />

      {/* For screens above tablet size (md and larger) */}
      <button
        className="hidden md:block absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 text-white text-2xl rounded-lg"
        onClick={handleClick}
      >
        {city}
      </button>

      {/* For screens below tablet size (sm and below) */}
      <button
        className="md:hidden absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white text-2xl rounded-lg p-4 opacity-90"
        onClick={handleClick}
      >
        {city}
      </button>
    </div>
  );
};

export default TrendingCities;
