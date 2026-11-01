import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./Slices/cartSlice";
import { AuthenticationSlice } from "./Slices/authenticationSlice";
import wishlistReducer from "./Slices/wishList";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    login: AuthenticationSlice.reducer,
    wishlist: wishlistReducer,
  },
});
