import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer.js";
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
import { serviceApi } from "@/features/api/serviceApi.js";
import { enquiryApi } from "@/features/api/enquiryApi.js";
import { galleryApi } from "@/features/api/galleryApi.js";
import { categoriesApi } from "@/features/api/categoriesApi.js";

export const appStore = configureStore({
  reducer: rootReducer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(
      customerApi.middleware,
      itemMasterApi.middleware,
      fabricApi.middleware,
      masterApi.middleware,
      salesmanApi.middleware,
      styleApi.middleware,
      pendingOrderApi.middleware,
      invoiceApi.middleware,
      employeeApi.middleware,
      branchApi.middleware,
      serviceApi.middleware,
      enquiryApi.middleware,
      galleryApi.middleware,
      categoriesApi.middleware,
    ),
});

const initializeApp = async () => {
  await appStore.dispatch(
    employeeApi.endpoints.getEmployeeProfile.initiate({}, { forceRefetch: true })
  );
};
initializeApp();
