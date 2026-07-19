import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  total: localStorage.getItem("total")
    ? JSON.parse(localStorage.getItem("total"))
    : 0,
  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const course = action.payload;
      const existingIndex = state.cart.findIndex((item) => item._id === course._id);

      if (existingIndex >= 0) {
        return;
      }

      state.cart.push(course);
      state.totalItems += 1;
      state.total += Number(course.price || 0);

      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", JSON.stringify(state.total));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
    },
    removeFromCart: (state, action) => {
      const courseId = action.payload;
      const existingIndex = state.cart.findIndex((item) => item._id === courseId);

      if (existingIndex < 0) {
        return;
      }

      const coursePrice = Number(state.cart[existingIndex]?.price || 0);
      state.cart.splice(existingIndex, 1);
      state.totalItems = Math.max(0, state.totalItems - 1);
      state.total = Math.max(0, state.total - coursePrice);

      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", JSON.stringify(state.total));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
    },
    setCart: (state, action) => {
      state.cart = action.payload;
      state.total = state.cart.reduce((acc, item) => acc + Number(item?.price || 0), 0);
      state.totalItems = state.cart.length;

      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", JSON.stringify(state.total));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
    },
    setTotal: (state, action) => {
      state.total = Number(action.payload || 0);
      localStorage.setItem("total", JSON.stringify(state.total));
    },
    setTotalItems: (state, action) => {
      state.totalItems = action.payload;
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
    },
    resetCart: (state) => {
      state.cart = [];
      state.total = 0;
      state.totalItems = 0;
      localStorage.removeItem("cart");
      localStorage.removeItem("total");
      localStorage.removeItem("totalItems");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  setCart,
  setTotal,
  setTotalItems,
  resetCart,
} = cartSlice.actions;
export default cartSlice.reducer;
