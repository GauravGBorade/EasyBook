import { useEffect } from "react";

type ToastProps = {
  message: string;
  type: "SUCCESS" | "ERROR";
  onClose: () => void;
};

const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);
  //create styles depending on if type is success or error -

  //-right-20

  const styles =
    type === "SUCCESS"
      ? "fixed top-10 right-4 z-50 px-6 py-2 rounded-md bg-green-600 text-white max-w-md"
      : "fixed top-10 right-4 z-50 px-6 py-2 rounded-md bg-red-600 text-white max-w-md animate-slideIn";
  return (
    <div className={styles}>
      <div className="flex justify-center items-center">
        <span className="text-lg font-semibold">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
