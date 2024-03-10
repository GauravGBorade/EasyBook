import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { toast } from "sonner";

const EditHotel = () => {
  const { hotelId } = useParams();
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
      toast.success("Property Details Updated!");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    onError: () => {
      toast.error("Something Went Wrong");
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
