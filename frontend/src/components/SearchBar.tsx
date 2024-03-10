import { FormEvent, useEffect, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SearchBar = () => {
  const search = useSearchContext();
  const navigate = useNavigate();

  /* we are creating local state for these variables even though we have them in search context is because, we will update them whenever user types in those fields and if we update them directly in searchContext then it will cause the render of whole app for each input. To avoid it we have created local state and once user clicks on search button we will use Search Context's function to set state values in serchcontext.
   */
  const [destination, setDestination] = useState<string>(search.destination);
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
  const [adultCount, setAdultCount] = useState<number>(search.adultCount);
  const [childCount, setChildCount] = useState<number>(search.childCount);

  function isBefore(date1: Date, date2: Date): boolean {
    return date1.getTime() < date2.getTime();
  }

  useEffect(() => {
    setDestination(search.destination);
    setCheckIn(search.checkIn);
    setCheckOut(search.checkOut);
    setAdultCount(search.adultCount);
    setChildCount(search.childCount);
  }, [search]);

  //As discussed above update the values in SearchContext when user clicks search button.
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (checkIn && checkOut && isBefore(checkOut, checkIn)) {
      toast.error("Check-In & Check-Out Dates Invalid");
      return;
    }

    search.saveSearchValues(
      destination,
      checkIn,
      checkOut,
      adultCount,
      childCount
    );
    navigate("/search");
  };

  const handleClearClick = (event: FormEvent) => {
    event.preventDefault();

    search.saveSearchValues("", new Date(), new Date(), 1, 0);
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1); // Setting max date for check-in 1 year from today's date

  return (
    <form
      onSubmit={handleSubmit}
      className="-mt-8 p-1 bg-orange-300 rounded-md shadow-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 items-center gap-2"
    >
      <div className="flex flex-row items-center flex-1 bg-white p-3 rounded-md">
        <MdTravelExplore size={25} className="mr-2" />
        <input
          placeholder="Where are you going?"
          className="text-md w-full focus:outline-none"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
        />
      </div>

      <div className="flex justify-center bg-white p-2 px-3  gap-2 rounded-md">
        <label className="items-center flex text-l">
          Adults:
          <input
            className="w-full p-1 focus:outline-none font-bold"
            type="number"
            min={1}
            max={20}
            value={adultCount}
            onChange={(event) => setAdultCount(parseInt(event.target.value))}
          />
        </label>
        <label className="items-center flex text-l">
          Children:
          <input
            className="w-full p-1 focus:outline-none font-bold"
            type="number"
            min={0}
            max={20}
            value={childCount}
            onChange={(event) => setChildCount(parseInt(event.target.value))}
          />
        </label>
      </div>
      <div>
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date as Date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          dateFormat="dd/MM/yyyy"
          placeholderText="Check-in Date"
          className="min-w-full bg-white p-3 rounded-md focus:outline-none"
          wrapperClassName="w-full"
        />
      </div>
      <div>
        <DatePicker
          selected={checkOut}
          onChange={(date) => {
            // Ensure checkOut date is not less than checkIn date
            if (date && isBefore(date, checkIn)) {
              toast.error("Check-In & Check-Out Dates Invalid");
              return;
            }
            setCheckOut(date as Date);
          }}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          dateFormat="dd/MM/yyyy"
          placeholderText="Check-out Date"
          className="min-w-full bg-white p-3 rounded-md focus:outline-none"
          wrapperClassName="min-w-full"
        />
      </div>
      <div className="flex gap-1">
        <button className="w-2/3 bg-blue-600 text-white h-full p-3 font-bold text-lg sm:text-xl hover:bg-blue-500 rounded-md">
          Search
        </button>
        <button
          onClick={handleClearClick}
          className="w-1/3 bg-red-600 text-white h-full p-3 font-bold text-lg sm:text-xl hover:bg-red-500 rounded-md"
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
