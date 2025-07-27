import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  identifier: string | null;
  token: string | null;
}

const initialState: AuthState = {
  identifier: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ identifier: string; token: string }>) {
      state.identifier = action.payload.identifier;
      state.token = action.payload.token;
    },
    logout(state) {
      state.identifier = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
