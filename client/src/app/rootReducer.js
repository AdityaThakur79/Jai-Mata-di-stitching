import { authApi } from "@/features/api/authApi.js";
import authReducer from "../features/authSlice.js";
import { combineReducers } from "@reduxjs/toolkit";
import { customerApi } from "@/features/api/customerApi.js";
import { itemMasterApi } from "@/features/api/itemApi.js";
import { fabricApi } from "@/features/api/fabricApi.js";
import { masterApi } from "@/features/api/masterApi.js";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [customerApi.reducerPath]: customerApi.reducer,
  [itemMasterApi.reducerPath]: itemMasterApi.reducer,
  [fabricApi.reducerPath]: fabricApi.reducer,
  [masterApi.reducerPath]: masterApi.reducer,
  auth: authReducer,
});

export default rootReducer;
