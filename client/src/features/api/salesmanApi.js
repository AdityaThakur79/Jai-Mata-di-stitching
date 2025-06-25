import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const SALESMAN_API = "https://jai-mata-di-stitching.onrender.com/api/salesman"
// const SALESMAN_API = "http://localhost:8080/api/salesman";

export const salesmanApi = createApi({
  reducerPath: "salesmanApi",
  baseQuery: fetchBaseQuery({
    baseUrl: SALESMAN_API,
    credentials: "include",
  }),
  tagTypes: ["Salesman"],
  endpoints: (builder) => ({
    createSalesman: builder.mutation({
      query: (formData) => ({
        url: "/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Salesman"],
    }),

    getAllSalesmen: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/all",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: ["Salesman"],
    }),

    getSalesmanById: builder.mutation({
      query: (salesmanId) => ({
        url: "/view",
        method: "POST",
        body: { salesmanId },
      }),
      invalidatesTags: ["Salesman"],
    }),

    updateSalesman: builder.mutation({
      query: (formData) => ({
        url: "/update",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Salesman"],
    }),

    deleteSalesman: builder.mutation({
      query: (salesmanId) => ({
        url: "/delete",
        method: "DELETE",
        body: { salesmanId },
      }),
      invalidatesTags: ["Salesman"],
    }),
  }),
});

export const {
  useCreateSalesmanMutation,
  useGetAllSalesmenQuery,
  useGetSalesmanByIdMutation,
  useUpdateSalesmanMutation,
  useDeleteSalesmanMutation,
} = salesmanApi;
