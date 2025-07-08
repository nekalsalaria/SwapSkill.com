import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    token: null,
    isLoaded: false,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload)); // ✅ Add this
    },

    setToken: (state, action) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload);
      } else {
        localStorage.removeItem("token");
      }
    },
    logout: (state) => {
      state.userData = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    setIsLoaded: (state, action) => {
      state.isLoaded = action.payload;
    },
  },
});

export const { setUserData, setToken, logout, setIsLoaded } = userSlice.actions;
export default userSlice.reducer;
