import { createSlice } from "@reduxjs/toolkit";


export const wishlistSlice=createSlice({
    name:"wishlist",
    initialState:[],
    reducers:{
        addWishlist:(state,actions)=>{
            let isIncludes = false;
            state.map((item)=>{
                if(item._id === actions.payload._id){
                    isIncludes = true;
                }
            })
            if(!isIncludes){
                state.push(actions.payload);
            }
        },
        removeWishlist:(state,actions)=>{
            return state.filter((item)=>item._id!==actions.payload)
        },
        clearWishlist:(state)=>{
            state.length=0;
        }
    }
})

export const{addWishlist,removeWishlist,clearWishlist} =wishlistSlice.actions;
export default wishlistSlice.reducer; 