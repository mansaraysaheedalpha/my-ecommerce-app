import { useDispatch, useSelector } from "react-redux";

import { Link as RouterLink } from "react-router-dom";

import type { RootState } from "../store/store";

import {
  decrementQuantity,
  incrementQuantity,
  removeItemFromCart,
  type CartItem,
} from "../store/features/cart/cartSlice";

const CartPage = () => {
  const cartItems: CartItem[] = useSelector(
    (state: RootState) => state.cart.items
  );

  const dispatch = useDispatch();

  const handleIncrement = (itemId: CartItem["id"]) => {
    dispatch(incrementQuantity(itemId));
  };

  const handleDecrement = (itemId: CartItem["id"]) => {
    dispatch(decrementQuantity(itemId));
  };

  const handleRemoveItem = (itemId: CartItem["id"]) => {
    dispatch(removeItemFromCart(itemId));
  };

  const calculateSubtotal = (item: CartItem) => {
    return item.price * item.quantity;
  };

  const handleGrandTotal = () => {
    return cartItems.reduce(
      (total, item) => total + calculateSubtotal(item),

      0
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-5 text-center">
        <h1 className="text-3xl text-slate-700 font-semibold mb-5">
          Your Cart is Empty
        </h1>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="md:w-64 md:h-64 mx-auto text-slate-500 mb-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>

        <p className="text-slate-400 text-md mb-10">
          Looks like you haven't added anything to your cart yet.
        </p>

        <RouterLink
          to="/products"
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white text-md font-semibold px-8 py-4 rounded-md "
        >
          Continue Shopping
        </RouterLink>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-4 lg:px-6 py-8">
      <h1 className="text-3xl text-slate-800 font-bold mb-3">
        Your Shopping Cart
      </h1>

      <div className="bg-white shadow-xl rounded-lg p-4 md:p-6">
        {cartItems.map((cartItem) => {
          const { id, imageUrl, name, price, quantity } = cartItem;

          return (
            <div
              className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 py-4 border-b border-slate-200 last:border-b-0"
              key={id}
            >
              <div className="flex items-center grow md:grow-0 md:w-2/5 lg:w-1/2">
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-20 h-20 object-cover rounded-md mr-4"
                />

                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-semibold text-slate-700">
                    {name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    ${price.toFixed(2)} each
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2">
                <button
                  className="px-3 py-1 border border-slate-300 rounded-md hover:bg-slate-100 text-slate-700 transition-colors"
                  aria-label="Decrement quantity"
                  onClick={() => handleDecrement(id)}
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

              <div className="w-full md:w-auto text-center md:text-right">
                <p className="text-lg font-semibold text-slate-800">
                  ${calculateSubtotal(cartItem).toFixed(2)}
                </p>
              </div>

              <div className="w-full md:w-auto flex justify-center md:justify-end mt-2 md:mt-0">
                <button
                  className="text-red-500 hover:text-red-700 font-medium text-sm py-1 px-2 rounded hover:bg-red-50 transition-colors"
                  aria-label="Remove Item"
                  onClick={() => handleRemoveItem(id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}

        <div className="mt-8 pt-6 border-t border-slate-400 text-end">
          <p className="text-2xl font-bold text-slate-800 mb-8">
            Grand Total: ${handleGrandTotal().toFixed(2)}
          </p>

          <div>
            <RouterLink
              to="/checkout"
              className="text-white px-10 py-3 bg-green-600 hover:bg-green-700 font-semibold rounded-md transition-colors text-lg"
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
