import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

type Props = {
  onEditPage: boolean;
};

const DetailsSection = ({ onEditPage }: Props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div className="flex flex-col gap-4 max-w-4xl  mx-auto">
      <h1 className="text-3xl font-bold mb-3">
        {onEditPage ? "Edit Property" : "Add Property"}
      </h1>
      <label className="text-gray-700 text-sm  font-bold flex-1">
        Name
        <input
          type="text"
          className="border rounded w-full py-2 px-2 font-normal focus:outline-black focus:outline-4"
          {...register("name", { required: "This field is required" })}
        ></input>
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}
      </label>
      <div className="flex gap-4 ">
        <label className="text-gray-700 text-sm  font-bold flex-1">
          City
          <input
            type="text"
            className="border rounded w-full py-2 px-2 font-normal focus:outline-black focus:outline-4"
            {...register("city", { required: "This field is required" })}
          ></input>
          {errors.city && (
            <span className="text-red-500">{errors.city.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm  font-bold flex-1">
          Country
          <input
            type="text"
            className="border rounded w-full py-2 px-2 font-normal focus:outline-black focus:outline-4"
            {...register("country", { required: "This field is required" })}
          ></input>
          {errors.country && (
            <span className="text-red-500">{errors.country.message}</span>
          )}
        </label>
      </div>
      <label className="text-gray-700 text-sm  font-bold flex-1">
        Description
        <textarea
          rows={10}
          className="border rounded w-full py-2 px-2 font-normal focus:outline-black focus:outline-4 resize-none"
          {...register("description", { required: "This field is required" })}
        ></textarea>
        {errors.description && (
          <span className="text-red-500">{errors.description.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold max-w-lg  ">
        Price Per Night
        <input
          min={1}
          type="number"
          className="pricePerNight border rounded w-full py-2 px-2 font-normal focus:outline-black focus:outline-4 appearance-none"
          {...register("pricePerNight", { required: "This field is required" })}
        ></input>
        {errors.pricePerNight && (
          <span className="text-red-500">{errors.pricePerNight.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm mb-7 font-bold max-w-lg  ">
        Star Rating
        <select
          {...register("starRating", { required: "This field is required" })}
          className="border rounded w-full p-2  font-normal"
        >
          <option value="" className="text-sm font-bold">
            Select a Rating
          </option>
          {[1, 2, 3, 4, 5].map((num, index) => (
            <option key={`option-${index}`} value={num}>
              {num}
            </option>
          ))}
        </select>
        {errors.starRating && (
          <span className="text-red-500">{errors.starRating.message}</span>
        )}
      </label>
    </div>
  );
};

export default DetailsSection;
