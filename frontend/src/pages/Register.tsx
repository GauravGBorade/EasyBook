import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const Register = () => {
  const { showToast, isLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Get the queryClient

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  // Destructure methods and properties from useForm hook
  const {
    register, // Function to register input fields with the form
    watch, // Function to watch the values of other input fields
    handleSubmit, // Function to handle form submission
    formState: { errors }, // Object containing form validation errors
  } = useForm<RegisterFormData>();

  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({ message: "Registration Successful!", type: "SUCCESS" });
      //! Call verifyToken api again using usequery's method so that we can set user as logged in.
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  // Callback function to execute when the form is submitted
  const onSubmit = handleSubmit((data) => {
    //handle submit will first verify all the form data. and if all good then will return the validated data to call function. then call mutate function to call fetch function using obtained data.
    mutation.mutate(data);
  });

  // Custom validation function for password to ensure it contains at least one symbol
  const validatePassword = (value: string) => {
    return (
      /^(?=.*[!@#$%^&*])/.test(value) ||
      "Password must contain at least one symbol"
    );
  };

  return (
    <form className="flex flex-col max-w-5xl gap-5 mx-auto" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Create an Account</h2>
      <div className="flex flex-col md:flex-row max-w-4xl gap-5">
        {/* First Name input field */}
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="border rounded w-full  py-2 px-2 font-normal focus:outline-black"
            {...register("firstName", { required: "This field is required" })}
          ></input>
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>

        {/* Last Name input field */}
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="border rounded w-full py-2 px-2 font-normal focus:outline-black"
            {...register("lastName", { required: "This field is required" })}
          ></input>
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>

      {/* Email input field */}
      <label className="text-gray-700 text-sm max-w-4xl font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-2 px-2 font-normal focus:outline-black "
          {...register("email", { required: "This field is required" })}
        ></input>
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>

      {/* Password input field */}
      <label className="text-gray-700 text-sm max-w-4xl font-bold flex-1">
        Password
        <input
          type="password"
          className="border rounded w-full py-2 px-2 font-normal focus:outline-black"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
            validate: validatePassword,
          })}
        ></input>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>

      {/* Confirm Password input field */}
      <label className="text-gray-700 text-sm max-w-4xl font-bold flex-1">
        Confirm Password
        <input
          type="password"
          className="border rounded w-full py-2 px-2 font-normal focus:outline-black"
          {...register("confirmPassword", {
            validate: (val) => {
              if (!val) {
                return "This field is required";
              } else if (watch("password") !== val) {
                return "Your Passwords do not match";
              }
            },
          })}
        ></input>
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>

      {/* Submit button */}
      <span>
        <button
          type="submit"
          className="rounded-md bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Create Account
        </button>
      </span>
    </form>
  );
};

export default Register;
