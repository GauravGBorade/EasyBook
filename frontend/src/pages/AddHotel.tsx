import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import * as apiClient from "../api-client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddHotel = () => {
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      toast.success("Hotel Added Successfully");
      navigate("/my-hotels");
    },
    onError: () => {
      toast.error("Error Saving Hotel");
    },
  });

  //call to above mutate function
  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };
  const onEditPage = false;
  return (
    <ManageHotelForm
      onSave={handleSave}
      isLoading={isLoading}
      onEditPage={onEditPage}
    />
  ); //Pass above function as props to ManageHotelForm component so that when we will create formData object we can call this fucntion and call the api through above mutate function.
};

export default AddHotel;
