import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import { useState } from "react";
import SearchResultCard from "../components/SearchResultCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<
    number | undefined
  >();
  const [sortOption, setSortOption] = useState<string>("");

  //* search from useContext has all the fields which are entered by user set in context. we need to convert them to searchParams object so that we can pass them to fetch function using useQuery()

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedHotelTypes,
    facilities: selectedFacilities,
    maxPrice: selectedMaxPrice?.toString(),
    sortOption,
  };

  const { data: hotelData } = useQuery(
    ["searchHotels", searchParams],
    () => apiClient.searchHotels(searchParams),
    {
      onSuccess: () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      },
    }
  );

  /* flow of star rating filter and showing it on display - 
    1. first we created starRating component which displays star rating from 5 to 1. remember we have set their values as string so selectedStars array will be of string[]
    2. now when user checks in a box we call on change fucntion from that component which in turn runs below function as we have passed it as props.
    3. this fucntion gets the value of the box which user clicked. 
    4. now user can either check a box or uncheck, so we handle both actions, if user checks it then we get previous array from state from hook and add new star rating string to it, and if user unchecks the box then we filter over preious array of string and return only those strings which are not matched with user checked rating.
    5. In UI we have added checked attribute to checkbox whose value is determined by if current star UI is looping over to show is in the selectedStars array. */

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;
    //set the stars in state according to if box is checked or not. if checked then add it to previous array and if already checked and user unchecks it

    setSelectedStars((prevStars) =>
      event.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
  };

  const handleTypesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hotelType = event.target.value;

    setSelectedHotelTypes((prevSelectedTypes) =>
      event.target.checked
        ? [...prevSelectedTypes, hotelType]
        : prevSelectedTypes.filter((type) => type !== hotelType)
    );
  };

  const handleFacilitiesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFacility = event.target.value;

    setSelectedFacilities((prevFacilities) =>
      event.target.checked
        ? [...prevFacilities, newFacility]
        : prevFacilities.filter((facility) => facility !== newFacility)
    );
  };
  const handlePriceChange = (value?: number) => {
    setSelectedMaxPrice(value);
  };

  const clearFilters = () => {
    setSelectedStars([]);
    setSelectedFacilities([]);
    setSelectedHotelTypes([]);
    setSelectedMaxPrice(undefined);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <button className="block lg:hidden  cursor-pointer text-start p-2 w-fit bg-blue-600 text-white rounded-md font-bold">
        Show Filters
      </button>
      <div className="hidden lg:block rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold border-b border-slate-300 pb-5 w-full">
              Filter by:
            </h3>
            <span>
              <button
                className="text-sm bg-blue-200 px-2 py-1 rounded"
                onClick={clearFilters}
              >
                Clear
              </button>
            </span>
          </div>
          <StarRatingFilter
            selectedStars={selectedStars}
            onChange={handleStarsChange}
          />
          <HotelTypesFilter
            selectedHotelTypes={selectedHotelTypes}
            onChange={handleTypesChange}
          />
          <FacilitiesFilter
            onChange={handleFacilitiesChange}
            selectedFacilities={selectedFacilities}
          />
          <PriceFilter
            onChange={handlePriceChange}
            selectedPrice={selectedMaxPrice}
          />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {hotelData?.pagination.total === 1
              ? `${hotelData.pagination.total} Hotel Found`
              : `${hotelData?.pagination.total} Hotels Found`}
            {search.destination ? ` in ${search.destination}` : ""}
          </span>
          <select
            className="p-2 rounded-md border"
            value={sortOption}
            onChange={(event) => {
              setPage(1);
              setSortOption(event.target.value);
            }}
          >
            <option value="">Sort By</option>
            <option value="starRating">Star Rating</option>
            <option value="pricePerNightAsc">Price (Lowest to Highest)</option>
            <option value="pricePerNightDesc">Price (Highest to lowest)</option>
          </select>
        </div>
        {hotelData?.data.map((hotel) => (
          <SearchResultCard hotel={hotel} key={`hotel-${hotel._id}`} />
        ))}
        <div>
          <Pagination
            page={hotelData?.pagination.page || 1}
            pages={hotelData?.pagination.pages || 1}
            onPageChange={(pageNumber) => setPage(pageNumber)}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
