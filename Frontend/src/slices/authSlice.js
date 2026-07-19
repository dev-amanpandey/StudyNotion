import { createSlice } from "@reduxjs/toolkit";

const getInitialToken = () => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) return null;

  try {
    const parsedToken = JSON.parse(storedToken);
    if (!parsedToken || parsedToken === "undefined" || parsedToken === "null") {
      return null;
    }
    return parsedToken;
  } catch {
    return null;
  }
};

const initialState = {
  signupData: null,
  token: getInitialToken(),
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSignupData: (state, action) => {
      state.signupData = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setSignupData, setToken, setLoading } = authSlice.actions;
export default authSlice.reducer;
