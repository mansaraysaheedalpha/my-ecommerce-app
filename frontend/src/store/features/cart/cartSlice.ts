import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../../interfaces/Products";

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<Product>) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.idd === newItem.id);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }
    },
    incrementQuantity: (state, action: PayloadAction<Product["id"]>) => {
      const itemId = action.payload;
      const existingItem = state.items.find((item) => item.id === itemId);

      if (existingItem) {
        existingItem.quantity++;
      }
    },

    decrementQuantity: (state, action: PayloadAction<Product["id"]>) => {
      const itemId = action.payload;
      const existingItem = state.items.find((item) => item.id === itemId);

      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== itemId);
        } else {
          existingItem.quantity--;
        }
      }
    },
    removeItemFromCart: (state, action: PayloadAction<Product["id"]>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
    },
  },
});

// Export the action creator
export const {
  addItemToCart,
  incrementQuantity,
  decrementQuantity,
  removeItemFromCart,
} = cartSlice.actions;

// Export the reducer
export default cartSlice.reducer;
