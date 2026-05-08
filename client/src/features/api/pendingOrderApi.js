import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils/BaseUrl";

const PENDING_ORDER_API = `${BASE_URL}/pending-order`;

export const pendingOrderApi = createApi({
  reducerPath: "pendingOrderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: PENDING_ORDER_API,
    credentials: "include",
  }),
  tagTypes: ["PendingOrder"],
  endpoints: (builder) => ({
    createPendingOrder: builder.mutation({
      query: (formData) => ({
        url: "/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["PendingOrder"],
    }),

    updatePendingOrder: builder.mutation({
      query: (formData) => ({
        url: "/update",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["PendingOrder"],
    }),

    getAllPendingOrders: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/all",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: ["PendingOrder"],
    }),

    getRecentPendingOrders: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/recent",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: ["PendingOrder"],
    }),

    getPendingOrderById: builder.mutation({
      query: (orderId) => ({
        url: "/view",
        method: "POST",
        body: { orderId },
      }),
      providesTags: ["PendingOrder"],
    }),

    deletePendingOrder: builder.mutation({
      query: (orderId) => ({
        url: "/delete",
        method: "DELETE",
        body: { orderId },
      }),
      invalidatesTags: ["PendingOrder"],
    }),

    updatePendingOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/update-status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["PendingOrder"],
    }),

    getPrintSlipByItemCode: builder.query({
      query: (itemCode) => ({
        url: `/slip/${itemCode}`,
        method: "GET",
      }),
      providesTags: ["PendingOrder"],
    }),
    getTailorSlips: builder.query({
      query: ({ page = 1, limit = 10, search = "", status = "all", scannedOnly = false }) => ({
        url: "/slips",
        method: "GET",
        params: { page, limit, search, status, scannedOnly },
      }),
      providesTags: ["PendingOrder"],
    }),
    getTailorSlipStats: builder.query({
      query: () => ({
        url: "/slips/stats",
        method: "GET",
      }),
      providesTags: ["PendingOrder"],
    }),
    printTailorSlip: builder.mutation({
      query: (slipId) => ({
        url: `/slips/${slipId}/print`,
        method: "POST",
      }),
      invalidatesTags: ["PendingOrder"],
    }),
    scanTailorSlip: builder.mutation({
      query: (barcodeValue) => ({
        url: "/slips/scan",
        method: "POST",
        body: { barcodeValue },
      }),
      invalidatesTags: ["PendingOrder"],
    }),
    getSlipWorkDetails: builder.mutation({
      query: (barcodeValue) => ({
        url: "/slips/work-details",
        method: "POST",
        body: { barcodeValue },
      }),
      invalidatesTags: ["PendingOrder"],
    }),
    updatePendingOrderItemWork: builder.mutation({
      query: ({ orderId, itemCode, payload }) => ({
        url: `/orders/${orderId}/items/${itemCode}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["PendingOrder"],
    }),
    updateTailorSlipStatus: builder.mutation({
      query: ({ slipId, status }) => ({
        url: `/slips/${slipId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["PendingOrder"],
    }),
    getPendingOrderStockBuckets: builder.query({
      query: () => ({
        url: "/stocks/buckets",
        method: "GET",
      }),
      providesTags: ["PendingOrder"],
    }),
  }),
});

export const {
  useCreatePendingOrderMutation,
  useUpdatePendingOrderMutation,
  useGetAllPendingOrdersQuery,
  useGetRecentPendingOrdersQuery,
  useGetPendingOrderByIdMutation,
  useDeletePendingOrderMutation,
  useUpdatePendingOrderStatusMutation,
  useGetPrintSlipByItemCodeQuery,
  useGetTailorSlipsQuery,
  useGetTailorSlipStatsQuery,
  usePrintTailorSlipMutation,
  useScanTailorSlipMutation,
  useGetSlipWorkDetailsMutation,
  useUpdatePendingOrderItemWorkMutation,
  useUpdateTailorSlipStatusMutation,
  useGetPendingOrderStockBucketsQuery,
} = pendingOrderApi;
