import { createSlice } from "@reduxjs/toolkit";

const initialState={
    value:false,
}
export const AuthenticationSlice=createSlice({

    name:"login",
    initialState,
    reducers:{
        loggedIn:(state)=>{
            state.value=true;
        },
        loggedOut:(state)=>{
            state.value=false;
        }
    }
})

export const{loggedIn,loggedOut} =AuthenticationSlice.actions;
export default AuthenticationSlice.reducer; 