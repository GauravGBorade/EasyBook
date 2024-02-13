import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";

const EditHotel = () => {
  const { hotelId } = useParams();
  const { showToast } = useAppContext();
  //fetch hotelData from api
  const { data: hotel } = useQuery(
    "getHotelById",
    () => apiClient.getHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );

  const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
    onSuccess: () => {
      showToast({ message: "Hotel Updated!", type: "SUCCESS" });
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    onError: () => {
      showToast({ message: "Something Went Wrong!", type: "ERROR" });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };
  const onEditPage = true;

  return (
    <ManageHotelForm
      hotel={hotel}
      onSave={handleSave}
      isLoading={isLoading}
      onEditPage={onEditPage}
    />
  );
};

export default EditHotel;
