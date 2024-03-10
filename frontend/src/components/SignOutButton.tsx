import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { toast } from "sonner";

export const SignOutButton = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");

      toast.success("Signed Out", {
        dismissible: true,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };
  return (
    <button
      onClick={handleClick}
      className="rounded text-blue-600 px-2 md:px-3 md:text-base text-xs py-1 md:py-0  font-bold hover:bg-gray-100 bg-white"
    >
      Sign Out
    </button>
  );
};
export default SignOutButton;
