import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import Typesection from "./Typesection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../backend/src/shared/types";
import { useEffect } from "react";

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
  imageUrls: string[];
  facilities: string[];
};

//set type for onSave and loading prop which we will get from add-hotel component
type Props = {
  hotel?: HotelType;
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
};

const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
  const formMethods = useForm<HotelFormData>(); //get all the values in formMethods
  // Then pass them to child forms using FormProvider

  //whenever component mounts or resets form will be filled with Given hotel values.
  const { handleSubmit, reset } = formMethods;
  useEffect(() => {
    reset(hotel);
  }, [hotel, reset]);

  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    //create new FormData object using FormData which will covert the json fields to object to multipart/form-data
    const formData = new FormData();

    //if hotel exists means we are on editing page. so need to provide the id in formData as we are using it in fetch request. We Got Hotel from editHotel page. EditHotel page got it from useQuery's reponse to getHotelById
    if (hotel) {
      formData.append("hotelId", hotel._id);
    }
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

    // if formdatajson i.e. current form contains image urls then while making update request we need to send those images too in req as they needs to be added too if user keeps them while updating the hotel.
    // to do this loop over image urls and for each image append it to imageUrls array using formData.append
    // also before submitting form is user deletes a image then imagesection will handle this and remove that image form imageUrls array. so we have updated url before saving.

    if (formDataJson.imageUrls) {
      formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url); //e.g. imageUrls[2]:"asdfkajhsdfjklafalsdkjf".
      });
    }

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
