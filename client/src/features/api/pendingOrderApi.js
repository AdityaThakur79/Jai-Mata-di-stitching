import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const PENDING_ORDER_API = "http://localhost:8080/api/pending-order";
const PENDING_ORDER_API = "https://jai-mata-di-stitching.onrender.com/api/pending-order"


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
} = pendingOrderApi;
