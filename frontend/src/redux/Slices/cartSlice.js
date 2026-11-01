import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    add: (state, action) => {
      const exists = state.some((item) => item._id === action.payload._id);
      if (!exists) state.push(action.payload);
    },
    remove: (state, action) => state.filter((item) => item._id !== action.payload),
    clear: () => [],
  },
});

export const { add, remove, clear } = cartSlice.actions;
export default cartSlice.reducer;
