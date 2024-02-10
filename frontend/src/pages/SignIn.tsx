import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";

export type SignInFormData = {
  email: string;
  password: string;
};

export const SignIn = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Get the queryClient

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();

  //* make call to signIn function which will call the api end point
  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      showToast({ message: "Sign In Successful", type: "SUCCESS" });
      //! call the verifyToken useQuery again to set the user as loggedIn
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col max-w-3xl gap-5 mx-auto" onSubmit={onSubmit}>
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
        <span className="text-sm">
          Not Registered ?
          <span className=" px-2 underline underline-offset-2 text-blue-900">
            <Link to="/register">Create an account here</Link>
          </span>
        </span>
        <button
          type="submit"
          className="rounded-md bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Login
        </button>
      </span>
    </form>
  );
};

export default SignIn;
