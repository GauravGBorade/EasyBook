import { useForm } from "react-hook-form";
import {
  PaymentIntentResponse,
  UserType,
} from "../../../../backend/src/shared/types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import * as apiClient from "../../api-client";
import { StripeCardElement } from "@stripe/stripe-js";
import { useSearchContext } from "../../contexts/SearchContext";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "react-query";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  currentUser: UserType;
  paymentIntent: PaymentIntentResponse;
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  totalCost: number;
  paymentIntentId: string;
};

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const search = useSearchContext();
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  //mutate i.e. bookRoom will be called when payment status is succeeded. this will call api createRoomBooking with formData which is required for room booking
  const { mutate: bookRoom } = useMutation(apiClient.createRoomBooking, {
    onSuccess: () => {
      toast.success("Booking Confirmed!");
      setIsLoading(false);
      navigate("/my-bookings");
    },
    onError: () => {
      toast.error("Error Saving Booking");
      setIsLoading(false);
      return;
    },
  });

  const { register, handleSubmit } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      adultCount: search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      hotelId: hotelId,
      totalCost: paymentIntent.totalCost,
      paymentIntentId: paymentIntent.paymentIntentId,
    },
  });

  //when form submited handleSubmit from useForm is called which processes form data and gives us in below function
  const onSubmit = async (formData: BookingFormData) => {
    setIsLoading(true);
    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement) as StripeCardElement,
      },
    });

    if (result.paymentIntent?.status === "succeeded") {
      bookRoom({ ...formData, paymentIntentId: result.paymentIntent.id });
    } else {
      toast.error("Error Processing Payment");
      setIsLoading(false);
      return;
    }
  };

  return (
    <form
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <span className="text-3xl font-bold">Confirm Your Details</span>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal cursor-not-allowed"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal cursor-not-allowed"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal cursor-not-allowed"
            type="text"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your Price Summary</h2>
        <div className="bg-blue-200 rounded-md p-4">
          <div className="font-semibold text-lg">
            Total Cost: ₹ {paymentIntent.totalCost.toFixed(2)}
          </div>
          <div className="text-xs">Including Taxes and Charges</div>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Payment Details</h3>
        <CardElement
          id="payment-element"
          className="border rounded-lg p-4 text-5xl focus:outline-none focus:border-blue-500"
        />
        <div className="text-sm text-slate-500">
          Test Card: Success - 4242424242424242 04/24 242 42424
        </div>
        <div className="text-sm text-slate-500">
          Test Card: Decline - 4000000000000002 04/24 242 42424
        </div>
      </div>
      <div className="flex justify-end">
        <button
          disabled={isLoading}
          type="submit"
          className={`bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500 cursor-${
            isLoading ? "not-allowed" : "pointer"
          }`}
        >
          {isLoading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
