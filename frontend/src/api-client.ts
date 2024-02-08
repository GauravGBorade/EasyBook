import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""; //  || "" will tell server to use same url for fetch requests in build as we are combining both for deployment

//* Register the User
export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message);
  }
};

//* Sign in the User
export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message);
  }
  console.log(responseData);

  return responseData;
};

//* Validate the token for Logged in User
export const validateToken = async () => {
  console.log("called validate token");

  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include", //this will ensure we are sending cookie with the request.
  });

  if (!response.ok) {
    throw new Error("Token Invalid");
  }
  return response.json();
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};
