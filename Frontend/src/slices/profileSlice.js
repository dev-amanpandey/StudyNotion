import { createSlice } from "@reduxjs/toolkit";

const getInitialUser = () => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  try {
    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser || parsedUser === "undefined" || parsedUser === "null") {
      return null;
    }
    return parsedUser;
  } catch {
    return null;
  }
};

const initialState = {
  user: getInitialUser(),
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = profileSlice.actions;
export default profileSlice.reducer;
