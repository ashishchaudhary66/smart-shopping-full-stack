import { configureStore } from "@reduxjs/toolkit";
import { CartSlice } from "./Slices/cartSlice";
import { AuthenticationSlice } from "./Slices/authenticationSlice";
import { wishlistSlice } from "./Slices/wishList";


export const store=configureStore({
    reducer:{
        cart:CartSlice.reducer,
        login:AuthenticationSlice.reducer,
        wishlist:wishlistSlice.reducer
    }
})
