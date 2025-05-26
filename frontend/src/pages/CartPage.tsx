import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import toast from "react-hot-toast";
import type { RootState } from "../store/store";
import {
  decrementQuantity,
  incrementQuantity,
  removeItemFromCart,
  type CartItem,
} from "../store/features/cart/cartSlice";

/**
 * @component CartPage
 * @description Displays the user's shopping cart.
 * Allows users to view items, adjust quantities, remove items, see the grand total,
 * and proceed to checkout. Displays an "empty cart" message if no items are present.
 */
const CartPage: React.FC = () => {
  // Select cart items from the Redux store
  const cartItems: CartItem[] = useSelector(
    (state: RootState) => state.cart.items
  );

  const dispatch = useDispatch();

  /**
   * Handles incrementing the quantity of a cart item.
   * @param {CartItem["id"]} itemId - The ID of the item to increment.
   */
  const handleIncrement = (itemId: CartItem["id"]) => {
    dispatch(incrementQuantity(itemId));
  };

  /**
   * Handles decrementing the quantity of a cart item.
   * If quantity becomes 0, the item is removed from the cart by the reducer.
   * @param {CartItem["id"]} itemId - The ID of the item to decrement.
   */
  const handleDecrement = (itemId: CartItem["id"]) => {
    dispatch(decrementQuantity(itemId));
  };

  /**
   * Handles removing an item completely from the cart.
   * @param {CartItem["id"]} itemId - The ID of the item to remove.
   */
  const handleRemoveItem = (
    itemId: CartItem["id"],
    itemName: CartItem["name"]
  ) => {
    dispatch(removeItemFromCart(itemId));
    toast.success(`${itemName} removed from cart.`, {
      icon: "🗑️",
    });
  };

  /**
   * Calculates the subtotal for a single cart item.
   * @param {CartItem} item - The cart item.
   * @returns {number} The calculated subtotal (price * quantity).
   */
  const calculateSubtotal = (item: CartItem) => {
    return item.price * item.quantity;
  };

  /**
   * Calculates the grand total for all items in the cart.
   * @returns {number} The calculated grand total.
   */
  const handleGrandTotal = () => {
    return cartItems.reduce(
      (total, item) => total + calculateSubtotal(item),
      0
    );
  };

  // Conditional rendering: Display empty cart view or cart items list
  if (cartItems.length === 0) {
    return (
      // Empty Cart View
      <div className="container mx-auto px-4 py-10 text-center">
        {" "}
        {/* Increased py for more vertical space */}
        <h1 className="text-3xl text-slate-700 font-semibold mb-6">
          {" "}
          {/* Increased mb */}
          Your Cart is Empty
        </h1>
        {/* Empty Cart SVG Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5} // Using 1.5 for a slightly thinner stroke, common in modern UIs
          stroke="currentColor"
          // Added explicit mobile size, then responsive md size
          className="w-48 h-48 md:w-64 md:h-64 mx-auto text-slate-400 mb-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>
        <p className="text-slate-500 text-lg mb-10">
          {" "}
          {/* Slightly larger text, adjusted color */}
          Looks like you haven't added anything to your cart yet.
        </p>
        {/* Link to navigate back to product listings */}
        <RouterLink
          to="/products"
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white text-lg font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg" // Enhanced styling
        >
          Continue Shopping
        </RouterLink>
      </div>
    );
  }

  // Cart View with Items
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {" "}
      {/* Consistent page padding */}
      <h1 className="text-3xl text-slate-800 font-bold mb-8">
        {" "}
        {/* Increased mb */}
        Your Shopping Cart
      </h1>
      {/* Container for cart items and summary */}
      <div className="bg-white shadow-xl rounded-lg p-4 md:p-6">
        {/* Mapping through cart items to display each one */}
        {cartItems.map((cartItem) => {
          const { id, imageUrl, name, price, quantity } = cartItem;

          return (
            // Container for a single cart item row
            <div
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 py-6 border-b border-slate-200 last:border-b-0" // Increased py
              key={id}
            >
              {/* Product Information (Image, Name, Price per unit) */}
              <div className="flex items-center grow md:grow-0 md:w-2/5 lg:w-1/2">
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-20 h-20 object-cover rounded-md mr-4 shadow-sm" // Added shadow-sm
                />
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                    {" "}
                    {/* Added hover, adjusted color */}
                    <RouterLink to={`/products/${id}`}>{name}</RouterLink>{" "}
                    {/* Link to product page */}
                  </h3>
                  <p className="text-sm text-slate-500">
                    ${price.toFixed(2)} each
                  </p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-center md:justify-start space-x-2">
                {" "}
                {/* Changed to md:justify-start */}
                <button
                  className="px-3 py-1 border border-slate-300 rounded-md hover:bg-slate-100 text-slate-700 transition-colors disabled:opacity-50"
                  aria-label="Decrement quantity"
                  onClick={() => handleDecrement(id)}
                  disabled={quantity <= 1} // Disable if quantity is 1 (or handle in reducer to remove)
                >
                  -
                </button>
                <span className="text-md font-medium text-slate-700 w-8 text-center">
                  {quantity}
                </span>
                <button
                  className="px-3 py-1 border border-slate-300 rounded-md hover:bg-slate-100 text-slate-700 transition-colors"
                  aria-label="Increment quantity"
                  onClick={() => handleIncrement(id)}
                >
                  +
                </button>
              </div>

              {/* Item Subtotal */}
              <div className="w-full md:w-auto text-center md:text-right mt-2 md:mt-0">
                {" "}
                {/* Added mt for mobile */}
                <p className="text-lg font-semibold text-slate-800">
                  ${calculateSubtotal(cartItem).toFixed(2)}
                </p>
              </div>

              {/* Remove Item Button */}
              <div className="w-full md:w-auto flex justify-center md:justify-end mt-2 md:mt-0">
                <button
                  className="text-red-500 hover:text-red-700 font-medium text-sm py-1 px-2 rounded hover:bg-red-50 transition-colors"
                  aria-label="Remove Item"
                  onClick={() => handleRemoveItem(id, name)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}

        {/* Cart Summary Section (Grand Total & Checkout Button) */}
        <div className="mt-8 pt-6 border-t border-slate-300 flex flex-col items-end">
          <div className="w-full max-w-xs sm:max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl md:text-2xl font-bold text-slate-800">
                Grand Total:
              </p>
              <p className="text-xl md:text-2xl font-bold text-slate-800">
                ${handleGrandTotal().toFixed(2)}
              </p>
            </div>
            <RouterLink
              to="/checkout" // Placeholder for future checkout page
              className="block w-full text-center bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg shadow-md hover:shadow-lg"
            >
              Proceed to Checkout
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
