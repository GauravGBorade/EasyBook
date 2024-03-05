import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LovedDestinationCard from "../components/LovedDestinationCard";
import TrendingCities from "../components/TrendingCities";

const Home = () => {
  const { data: hotels } = useQuery("fetchHotels", () =>
    apiClient.fetchHotels()
  );

  const topRowHotels = hotels?.slice(0, 4) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Most Loved Hotels</h2>
        <p>Most loved destinations by our visitors</p>
      </div>
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
          {topRowHotels.map((hotel) => (
            <LovedDestinationCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold mt-10">Most Visited Cities</h2>
        <p>Most loved by our visitors</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 2xl:grid-cols-8 gap-4">
        <TrendingCities city="Mumbai" imagePath="/images/mumbai.jpeg" />
        <TrendingCities city="Agra" imagePath="/images/agra.jpeg" />
        <TrendingCities city="Amritsar" imagePath="/images/amritsar.jpeg" />
        <TrendingCities city="Hampi" imagePath="/images/hampi.jpeg" />
        <TrendingCities city="Hyderabad" imagePath="/images/hyderabad.jpeg" />
        <TrendingCities city="Varanasi" imagePath="/images/varanasi.jpeg" />
        <TrendingCities city="Jaipur" imagePath="/images/jaipur.jpeg" />
        <TrendingCities city="Goa" imagePath="/images/goa.jpeg" />
      </div>
    </div>
  );
};

export default Home;
