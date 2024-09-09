// src/redux/slices/authenticationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  id: number | null;
  name: string | null;
  email: string | null;
  phone_number: string | null;
  role: Role | null;
 
}

// Define the initial state using that type
const initialState: AuthState = {
  id: null,
  name: "",
  email: "",
  phone_number: "",
  role: null,
 
};

const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: AuthState }>) => {
      // state.token = action.payload.token;
      state.id = action.payload.user.id;
      state.name = action.payload.user.name;
      state.email = action.payload.user.email;
      state.phone_number = action.payload.user.phone_number;
      state.role = action.payload.user.role;
    },
    logout: (state) => {
      // state.token = null;
      state.id = null;
      state.name = null;
      state.email = null;
      state.phone_number = null;
      state.role = null;
    },
  },
});

export const { setCredentials, logout } = authenticationSlice.actions;

export default authenticationSlice.reducer;
