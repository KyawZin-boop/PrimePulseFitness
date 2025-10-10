import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  productID: string;
  name: string;
  imageUrl?: string;
  discountedPrice: number;
  sellingPrice: number;
  discount: number;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Helper to calculate discounted price (reusable)
const calculateDiscountedPrice = (price: number, discount: number): number => {
  return price - (price * discount) / 100;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<
        Omit<
          CartItem,
          "quantity" | "discountedPrice" | "totalItems" | "totalPrice"
        >
      >
    ) => {
      const itemToAdd = {
        ...action.payload,
        discountedPrice: calculateDiscountedPrice(
          action.payload.sellingPrice,
          action.payload.discount
        ), // Computed here using sellingPrice
        quantity: 1, // Default quantity
      };

      // Check if item exists
      const existingItem = state.items.find(
        (item) => item.productID === itemToAdd.productID
      );
      if (existingItem) {
        // Update quantity if stock allows
        const newQuantity = existingItem.quantity + 1;
        if (newQuantity <= existingItem.stock) {
          existingItem.quantity = newQuantity;
        }
      } else {
        // Add new item if stock > 0
        if (itemToAdd.stock > 0) {
          state.items.push(itemToAdd);
        }
      }

      // Recalculate totals
      state.totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.discountedPrice * item.quantity,
        0
      );
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productID: string; quantity: number }>
    ) => {
      const { productID, quantity } = action.payload;
      const itemIndex = state.items.findIndex(
        (item) => item.productID === productID
      );
      if (itemIndex !== -1) {
        if (quantity > 0 && quantity <= state.items[itemIndex].stock) {
          state.items[itemIndex].quantity = quantity;
        } else if (quantity <= 0) {
          // Remove item if quantity <= 0
          state.items.splice(itemIndex, 1);
        }
        // Recalculate totals
        state.totalItems = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        state.totalPrice = state.items.reduce(
          (sum, item) => sum + item.discountedPrice * item.quantity,
          0
        );
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productID !== action.payload
      );
      // Recalculate totals
      state.totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.discountedPrice * item.quantity,
        0
      );
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
