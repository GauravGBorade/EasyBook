import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";

//types -

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

//this will type the value we pass while creating the provider
type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
};

//creating context with above created type and default value as undefined
const AppContext = React.createContext<AppContext | undefined>(undefined); //undefined in brackets is initial value of the context.

//export context provider with which we can wrap our app component so that we can use above context
export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  //* query the verify token to update isLoggedIn.
  const { isError } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
    onSuccess: () => {
      setIsLoggedIn(true);
    },
  });

  return (
    <AppContext.Provider
      value={{
        //note that toastMessage is an object with message and type properties in it.
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn: !isError && isLoggedIn,
      }}
    >
      {/* we are rending toast compone here along with all other children component app component will have. toast will be set to undefined by onclose from Toast componet when timer runs out. So below code wont run as toast is undefined and will be treated as falsly value. */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

//creat a hook to easily access app context without repetadely calling useContext hook from each component.
export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContext;
};
