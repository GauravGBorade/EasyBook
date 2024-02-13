import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";
import { useNavigate } from "react-router-dom";

const AddHotel = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      showToast({ message: "Hotel Added Successfully", type: "SUCCESS" });
      navigate("/my-hotels");
    },
    onError: () => {
      showToast({ message: "Error Saving Hotel", type: "ERROR" });
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
