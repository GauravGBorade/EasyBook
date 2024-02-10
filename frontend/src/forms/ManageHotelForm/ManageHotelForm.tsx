import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import Typesection from "./Typesection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  adultCount: number;
  childCount: number;
  imageFiles: FileList;
  facilities: string[];
};

//set type for onSave and loading prop which we will get from add-hotel component
type Props = {
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
};

const ManageHotelForm = ({ onSave, isLoading }: Props) => {
  const formMethods = useForm<HotelFormData>(); //get all the values in formMethods
  // Then pass them to child forms using FormProvider

  const { handleSubmit } = formMethods;

  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    //create new FormData object using FormData which will covert the json fields to object to multipart/form-data
    const formData = new FormData();
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    formData.append("starRating", formDataJson.starRating.toString());
    formData.append("adultCount", formDataJson.adultCount.toString());
    formData.append("childCount", formDataJson.childCount.toString());

    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile);
    });

    //call onSave func which we got in props from add-hotel.
    onSave(formData);
  });

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit}>
        <DetailsSection />
        <Typesection />
        <FacilitiesSection />
        <GuestsSection />
        <ImagesSection />
        <span className="flex max-w-4xl mx-auto justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hove:bg-blue-500 text-xl disabled:bg-gray-500"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;
