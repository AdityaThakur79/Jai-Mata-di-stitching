import { authApi } from "@/features/api/authApi.js";
import authReducer from "../features/authSlice.js";
import { combineReducers } from "@reduxjs/toolkit";
import { customerApi } from "@/features/api/customerApi.js";
import { itemMasterApi } from "@/features/api/itemApi.js";
import { fabricApi } from "@/features/api/fabricApi.js";
import { masterApi } from "@/features/api/masterApi.js";
import { salesmanApi } from "@/features/api/salesmanApi.js";
import { styleApi } from "@/features/api/styleApi.js";
import { pendingOrderApi } from "@/features/api/pendingOrderApi.js";
import { invoiceApi } from "@/features/api/invoiceApi.js";
import { employeeApi } from "@/features/api/employeeApi.js";
import { branchApi } from "@/features/api/branchApi.js";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [customerApi.reducerPath]: customerApi.reducer,
  [itemMasterApi.reducerPath]: itemMasterApi.reducer,
  [fabricApi.reducerPath]: fabricApi.reducer,
  [masterApi.reducerPath]: masterApi.reducer,
  [salesmanApi.reducerPath]:salesmanApi.reducer,
  [styleApi.reducerPath]:styleApi.reducer,
  [pendingOrderApi.reducerPath]:pendingOrderApi.reducer,
  [invoiceApi.reducerPath]:invoiceApi.reducer,
  [employeeApi.reducerPath]: employeeApi.reducer,
  [branchApi.reducerPath]: branchApi.reducer,
  auth: authReducer,
});

export default rootReducer;
