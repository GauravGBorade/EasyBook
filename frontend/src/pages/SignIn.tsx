import { MouseEventHandler } from "react";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export type SignInFormData = {
  email: string;
  password: string;
};

export const SignIn = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Get the queryClient
  const location = useLocation();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<SignInFormData>();

  //* make call to signIn function which will call the api end point
  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      toast.success("Sign In Successful");
      // showToast({ message: "Sign In Successful", type: "SUCCESS" });
      //! call the verifyToken useQuery again to set the user as loggedIn
      await queryClient.invalidateQueries("validateToken");

      navigate(location.state?.from?.pathname || "/");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  const signInAsGuest: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    setValue("email", "test@t.com");
    setValue("password", "11111!");
  };

  return (
    <form
      className="flex flex-col max-w-3xl gap-5 mx-auto background-style p-16"
      onSubmit={onSubmit}
    >
      <h2 className="text-3xl font-bold">Sign In</h2>
      <label className="text-gray-700 text-sm max-w-3xl font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-2 px-2 font-normal focus:outline-black focus:outline-4"
          {...register("email", { required: "This field is required" })}
        ></input>
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>

      {/* Password input field */}
      <label className="text-gray-700 text-sm max-w-3xl font-bold flex-1 ">
        Password
        <input
          type="password"
          className="border rounded w-full py-2 px-2 font-normal focus:outline-black focus:outline-4"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        ></input>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      {/* Submit button */}
      <span className="flex items-center justify-between max-w-3xl">
        <span className="sm:text-sm text-xs">
          Not Registered ?
          <div className="underline underline-offset-2 text-blue-900">
            <Link to="/register">Create an account here</Link>
          </div>
        </span>
        <button
          type="submit"
          className="rounded-md bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md sm:text-xl"
        >
          Login
        </button>
      </span>
      <div className="flex items-center justify-center w-full mt-5">
        <button
          className="w-[60%] rounded-md bg-blue-700 p-2 text-white hover:bg-blue-600 text-md sm:text-xl"
          onClick={signInAsGuest}
        >
          Sign in as guest
        </button>
      </div>
    </form>
  );
};

export default SignIn;
