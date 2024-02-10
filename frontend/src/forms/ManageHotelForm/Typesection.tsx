import { useFormContext } from "react-hook-form";
import { hotelTypes } from "../../config/hotel-options-config";
import { HotelFormData } from "./ManageHotelForm";

const Typesection = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<HotelFormData>();
  const typeWatch = watch("type"); //get the type which is currently selected by user

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto mb-7">
      <h2 className="text-2xl font-bold mb-3">Type</h2>
      <div className="grid grid-cols-5 gap-3 ">
        {hotelTypes.map((hotelType, index) => (
          <label
            key={`hotelType-${index}`}
            // If the selected type is same as current type then we render blue bubble else render gray bubble
            className={
              typeWatch === hotelType
                ? "cursor-pointer bg-blue-300 text-sm rounded-full px-3 py-2 font-semibold text-center"
                : "cursor-pointer bg-gray-200 text-sm rounded-full px-3 py-2 font-semibold text-center"
            }
          >
            <input
              type="radio"
              value={hotelType}
              {...register("type", { required: "This field is required" })}
              className="hidden"
            />
            <span>{hotelType}</span>
          </label>
        ))}
      </div>
      {errors.type && (
        <span className="text-red-500">{errors.type.message}</span>
      )}
    </div>
  );
};

export default Typesection;
