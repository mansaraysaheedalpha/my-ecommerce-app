import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "../store/features/cart/cartSlice";

export const rootReducer = combineReducers({
  cart: cartReducer,
});
