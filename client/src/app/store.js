import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer.js";
import { authApi } from "@/features/api/authApi.js";
import { customerApi } from "@/features/api/customerApi.js";
import { itemMasterApi } from "@/features/api/itemApi.js";
import { fabricApi } from "@/features/api/fabricApi.js";
import { masterApi } from "@/features/api/masterApi.js";
import { salesmanApi } from "@/features/api/salesmanApi.js";
import { styleApi } from "@/features/api/styleApi.js";
import { pendingOrderApi } from "@/features/api/pendingOrderApi.js";
import { invoiceApi } from "@/features/api/invoiceApi.js";

export const appStore = configureStore({
  reducer: rootReducer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(
      authApi.middleware,
      customerApi.middleware,
      itemMasterApi.middleware,
      fabricApi.middleware,
      masterApi.middleware,
      salesmanApi.middleware,
      styleApi.middleware,
      pendingOrderApi.middleware,
      invoiceApi.middleware,
    ),
});

const initializeApp = async () => {
  await appStore.dispatch(
    authApi.endpoints.loadUser.initiate({}, { forceRefetch: true })
  );
};
initializeApp();
