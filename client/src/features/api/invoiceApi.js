import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const INVOICE_API = "http://localhost:8080/api/invoice";
const INVOICE_API = "https://jai-mata-di-stitching.onrender.com/api/invoice";
export const invoiceApi = createApi({
  reducerPath: "invoiceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: INVOICE_API,
    credentials: "include",
  }),
  tagTypes: ["Invoice"],
  endpoints: (builder) => ({
    createInvoice: builder.mutation({
      query: (formData) => ({
        url: "/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Invoice"],
    }),

    getAllInvoices: builder.query({
      query: ({ page = 1, limit = 10, search = "", status = "" }) => ({
          url: '/all',
          method: "GET",
          params: { page, limit, search, status },
        }),
   
      providesTags: ["Invoice"],
    }),

    getInvoiceById: builder.query({
      query: (invoiceId) => ({
        url: `/${invoiceId}`,
        method: "GET",
      }),
      providesTags: ["Invoice"],
    }),

    updateInvoice: builder.mutation({
      query: ({ invoiceId, formData }) => ({
        url: `/${invoiceId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Invoice"],
    }),

    generateInvoicePDF: builder.mutation({
      query: (invoiceId) => ({
        url: `/${invoiceId}/pdf`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `invoice-${invoiceId}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          return { success: true };
        },
      }),
      invalidatesTags: ["Invoice"],
    }),

    updatePaymentStatus: builder.mutation({
      query: ({ invoiceId, paymentData }) => ({
        url: `/${invoiceId}/payment`,
        method: "PATCH",
        body: paymentData,
      }),
      invalidatesTags: ["Invoice"],
    }),

    deleteInvoice: builder.mutation({
      query: (invoiceId) => ({
        url: `/${invoiceId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invoice"],
    }),
  }),
});

export const {
  useCreateInvoiceMutation,
  useGetAllInvoicesQuery,
  useGetInvoiceByIdQuery,
  useUpdateInvoiceMutation,
  useGenerateInvoicePDFMutation,
  useUpdatePaymentStatusMutation,
  useDeleteInvoiceMutation,
} = invoiceApi; 