//src/store/features/auth/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface AuthState {
  userInfo: UserInfo | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  userInfo: null,
  accessToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //Action to set credentials after login/registeration
    setCredentials: (
      state,
      action: PayloadAction<{
        user: UserInfo;
        accessToken: string;
      }>
    ) => {
      state.userInfo = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },

    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      if (action.payload && state.userInfo) {
        state.isAuthenticated = true;
      }
    },

    // Action to clear credentials on logout
    clearCredentials: (state) => {
      state.userInfo = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, updateAccessToken, clearCredentials } =
  authSlice.actions;

export default authSlice.reducer;
