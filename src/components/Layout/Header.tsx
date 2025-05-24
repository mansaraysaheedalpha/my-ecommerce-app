import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const Header: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const totalItemsInCart = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl  font-bold text-blue-600">
            ShopSphere
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
              {/* <Link>
              for profile login
              </Link> */}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
