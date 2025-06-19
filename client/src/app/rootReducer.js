import { authApi } from "@/features/api/authApi.js";
import authReducer from "../features/authSlice.js";
import { combineReducers } from "@reduxjs/toolkit";
import { customerApi } from "@/features/api/customerApi.js";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [customerApi.reducerPath]:customerApi.reducer,
  auth: authReducer,
});

export default rootReducer;
