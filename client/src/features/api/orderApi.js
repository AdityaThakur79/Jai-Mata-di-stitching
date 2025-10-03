import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/BaseUrl.jsx";

const ORDER_API = `${BASE_URL}/order`;

const baseQuery = fetchBaseQuery({
  baseUrl: ORDER_API,
  credentials: "include",
});

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery,
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    // Create new order
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/create",
        method: "POST",
        body: orderData,
        credentials: "include",
      }),
      invalidatesTags: ["Order"],
    }),

    // Get all orders
    getAllOrders: builder.query({
      query: ({ page, limit, status, orderType, priority, search }) => ({
        url: "/all",
        params: { page, limit, status, orderType, priority, search },
        credentials: "include",
      }),
      providesTags: ["Order"],
    }),

    // Get order by ID
    getOrderById: builder.mutation({
      query: (orderId) => ({
        url: "/get-by-id",
        method: "POST",
        body: { orderId },
        credentials: "include",
      }),
    }),

    // Update order
    updateOrder: builder.mutation({
      query: ({ orderId, orderData }) => ({
        url: `/update/${orderId}`,
        method: "PUT",
        body: orderData,
        credentials: "include",
      }),
      invalidatesTags: ["Order"],
    }),

    // Delete order
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: "/delete",
        method: "DELETE",
        body: { orderId },
        credentials: "include",
      }),
      invalidatesTags: ["Order"],
    }),

    // Generate bill
    generateBill: builder.mutation({
      query: (billData) => ({
        url: "/generate-bill",
        method: "POST",
        body: billData,
        credentials: "include",
      }),
      invalidatesTags: ["Order"],
    }),

    // Get order statistics
    getOrderStats: builder.query({
      query: () => ({
        url: "/stats",
        credentials: "include",
      }),
    }),

    // Get completed orders statistics
    getCompletedOrdersStats: builder.query({
      query: () => ({
        url: "/completed-stats",
        credentials: "include",
      }),
    }),

    // Get all orders statistics
    getAllOrdersStats: builder.query({
      query: () => ({
        url: "/all-stats",
        credentials: "include",
      }),
    }),

    // Update order status
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status, notes }) => ({
        url: `/update-status/${orderId}`,
        method: "PUT",
        body: { status, notes },
        credentials: "include",
      }),
      invalidatesTags: ["Order"],
    }),

    // Update payment status
    updatePaymentStatus: builder.mutation({
      query: ({ orderId, paymentStatus, paymentAmount, paymentMethod, paymentNotes }) => ({
        url: `/update-payment/${orderId}`,
        method: "PUT",
        body: { paymentStatus, paymentAmount, paymentMethod, paymentNotes },
        credentials: "include",
      }),
      invalidatesTags: ["Order"],
    }),

    // Update bill payment status
    updateBillPaymentStatus: builder.mutation({
      query: ({ orderId, paymentStatus, paymentAmount, paymentMethod, paymentNotes }) => ({
        url: `/update-bill-payment/${orderId}`,
        method: "PUT",
        body: { paymentStatus, paymentAmount, paymentMethod, paymentNotes },
        credentials: "include",
      }),
      invalidatesTags: ["Order"],
    }),

    // Get order data for invoice generation
    getOrderForInvoice: builder.mutation({
      query: (orderId) => ({
        url: `/invoice-data/${orderId}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    // Track order by order number (public endpoint)
    trackOrder: builder.query({
      query: (orderNumber) => `/track/${orderNumber}`,
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGenerateBillMutation,
  useGetOrderStatsQuery,
  useGetCompletedOrdersStatsQuery,
  useGetAllOrdersStatsQuery,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
  useUpdateBillPaymentStatusMutation,
  useGetOrderForInvoiceMutation,
  useTrackOrderQuery,
} = orderApi;
