import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: [],
  reducers: {
    addWishlist: (state, action) => {
      const exists = state.some((item) => item._id === action.payload._id);
      if (!exists) state.push(action.payload);
    },
    removeWishlist: (state, action) => state.filter((item) => item._id !== action.payload),
    clearWishlist: () => [],
  },
});

export const { addWishlist, removeWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
