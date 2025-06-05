import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useLogoutUserMutation } from "../../store/api/apiSlice";
import { clearCredentials } from "../../store/features/auth/authSlice";
import toast from "react-hot-toast";

const Header: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItemsInCart = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const currentUser = useSelector((state: RootState) => state.auth.userInfo);
  const navigate = useNavigate();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();

  const handleLogout = async () => {

    try {
      await logoutUser().unwrap();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err: any) {
      console.error("Failed to logout", err);
      toast.error(err.data?.message || "Logout failed. Please try again");
      navigate("/login");
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl  font-bold text-blue-600">
            SaloneAmazon
          </Link>
          <div className="space-x-6 items-center">
            <Link to="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-blue-600">
              Products
            </Link>
            <Link
              to="/cart"
              className="text-gray-600 hover:text-blue-600 relative"
            >
              Cart
              {totalItemsInCart > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItemsInCart}
                </span>
              )}
            </Link>

            {isAuthenticated && currentUser ? (
              <>
                <span className="text-slate-700">
                  Hi, {currentUser.name.split(" ")[0]}!
                </span>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
                {/* Optionally, add a link to a user profile page here later */}
                {/* <Link to="/profile" className="text-gray-600 hover:text-blue-600">Profile</Link> */}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
