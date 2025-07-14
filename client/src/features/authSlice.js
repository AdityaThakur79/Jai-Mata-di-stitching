import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  employee: null,
  isEmployeeAuthenticated: false,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    userLoggedOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    employeeLoggedIn: (state, action) => {
      state.employee = action.payload.employee;
      state.isEmployeeAuthenticated = true;
    },
    employeeLoggedOut: (state) => {
      state.employee = null;
      state.isEmployeeAuthenticated = false;
    },
  },
});

export const { userLoggedIn, userLoggedOut, employeeLoggedIn, employeeLoggedOut } = authSlice.actions;

export const selectUserRole = (state) => state.auth.user?.role;
export const selectEmployeeRole = (state) => state.auth.employee?.role;

export default authSlice.reducer;
