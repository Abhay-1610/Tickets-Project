import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  userId: null,
  role: null,
  email: null,
  isAuthenticated: false,
  hasCheckedAuth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      const { accessToken, userId, role, email } = action.payload;

      state.accessToken = accessToken;
      state.userId = userId;
      state.role = role;
      state.email = email;
      state.isAuthenticated = true;
      state.hasCheckedAuth= true;

    },

    clearAuth(state) {
      state.accessToken = null;
      state.userId = null;
      state.role = null;
      state.email = null;
      state.isAuthenticated = false;
      state.hasCheckedAuth= false;
    },
     markAuthChecked(state) {
      state.hasCheckedAuth = true;
    },
  },
});

export const { setAuth, clearAuth,markAuthChecked  } = authSlice.actions;
export default authSlice.reducer;
