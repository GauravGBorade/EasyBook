import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <div className="bg-blue-800 py-6">
      <div className="flex justify-between mx-auto w-4/5">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">EasyBook</Link>
        </span>
        <span className="flex space-x-2">
          {/* check if user is logged in and render links accordingly */}
          {isLoggedIn ? (
            <>
              <Link
                className="flex items-center text-white px-4 font-bold hover:bg-blue-600 hover:rounded"
                to="/my-bookings"
              >
                My Bookings
              </Link>
              <Link
                className="flex items-center text-white px-4 font-bold hover:bg-blue-600 hover:rounded"
                to="/my-hotels"
              >
                List Your Property
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100"
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;
