import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <div className="bg-blue-800 py-6">
      <div className="flex justify-between mx-auto w-4/5">
        <span className="sm:text-3xl text-2xl mr-2 text-white font-bold tracking-tight">
          <Link to="/">EasyBook</Link>
        </span>
        <span className="flex gap-1 text-xs sm:space-x-2 sm:text-base">
          {/* check if user is logged in and render links accordingly */}
          {isLoggedIn ? (
            <>
              <Link
                className="flex items-center text-white sm:px-4 px-2 font-bold hover:bg-blue-600 hover:rounded"
                to="/my-bookings"
              >
                My Bookings
              </Link>
              <Link
                className="flex items-center text-white sm:px-4 px-2 font-bold hover:bg-blue-600 hover:rounded sm:border-0 border border-slate-400 rounded"
                to="/my-hotels"
              >
                List Your Property
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100 rounded"
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
