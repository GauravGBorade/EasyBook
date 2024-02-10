import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const GuestsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto mb-7">
      <h2 className="text-2xl font-bold mb-3">Guests</h2>
      <div className="flex gap-5 bg-gray-200 px-3 py-4">
        <label className="text-gray-700 text-sm font-bold flex-1">
          Adults
          <input
            type="number"
            min={1}
            className="border rounded w-full py-2 px-2 font-normal focus:outline-black"
            {...register("adultCount", { required: "This field is required" })}
          ></input>
          {errors.adultCount && (
            <span className="text-red-500">{errors.adultCount.message}</span>
          )}
        </label>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Children
          <input
            type="number"
            min={0}
            className="border rounded w-full py-2 px-2 font-normal focus:outline-black focus"
            {...register("childCount", { required: "This field is required" })}
          ></input>
          {errors.childCount && (
            <span className="text-red-500">{errors.childCount.message}</span>
          )}
        </label>
      </div>
    </div>
  );
};

export default GuestsSection;
