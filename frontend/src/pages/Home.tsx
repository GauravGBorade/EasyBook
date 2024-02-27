import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LovedDestinationCard from "../components/LovedDestinationCard";

const Home = () => {
  const { data: hotels } = useQuery("fetchHotels", () =>
    apiClient.fetchHotels()
  );

  const topRowHotels = hotels?.slice(0, 4) || [];
  const bottomRowHotels = hotels?.slice(4, 12) || [];

  return (
    <div className="space-y-3 ">
      <h2 className="text-3xl font-bold">Most Loved Destinations</h2>
      <p>Most loved destinations by our visitors</p>
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
          {topRowHotels.map((hotel) => (
            <LovedDestinationCard hotel={hotel} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-6 gap-4">
          {bottomRowHotels.map((hotel) => (
            <LovedDestinationCard hotel={hotel} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
