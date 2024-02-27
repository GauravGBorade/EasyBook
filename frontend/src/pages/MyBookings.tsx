import { useQuery } from "react-query";
import * as apiClient from "../api-client";

const MyBookings = () => {
  const { data: hotels } = useQuery(
    "fetchMyBookings",
    apiClient.fetchMyBookings
  );

  if (!hotels || hotels.length === 0) {
    return <span>NO BOOKINGS FOUND</span>;
  }
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
  } as Intl.DateTimeFormatOptions;
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      {hotels.map((hotel) => (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_2fr] border border-slate-300 rounded-lg p-8 gap-10">
          <div className="lg:w-full lg:h-[350px]">
            <img
              src={hotel.imageUrls[0]}
              alt="hotel-image"
              className="2xl:w-[80%] w-full h-full object-cover object-center rounded-md"
            />
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px]">
            <div className="text-3xl font-bold">
              {hotel.name}
              <div className="text-sm font-normal">
                {hotel.city}, {hotel.country}
              </div>
            </div>
            {hotel.bookings.map((booking) => (
              <div className="mt-3">
                <div>
                  <span className="text-lg font-bold mr-2">Dates: </span>
                  <span>
                    {new Date(booking.checkIn).toLocaleDateString(
                      "en-IN",
                      options
                    )}{" "}
                    -{" "}
                    {new Date(booking.checkOut).toLocaleDateString(
                      "en-IN",
                      options
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-lg font-bold mr-2">Guests: </span>
                  <span>
                    {booking.adultCount} Adults, {booking.childCount} Children
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
