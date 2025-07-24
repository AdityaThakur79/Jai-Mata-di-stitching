import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils/BaseUrl";

const ENQUIRY_API = `${BASE_URL}/enquiry`;

export const enquiryApi = createApi({
  reducerPath: "enquiryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ENQUIRY_API,
    credentials: "include",
  }),
  tagTypes: ["Enquiry"],
  endpoints: (builder) => ({
    createEnquiry: builder.mutation({
      query: (enquiryData) => ({
        url: "/create",
        method: "POST",
        body: enquiryData,
      }),
      invalidatesTags: ["Enquiry"],
    }),

    getAllEnquiries: builder.query({
      query: ({ page = 1, limit = 10, search = "", status = "", priority = "", source = "" }) => ({
        url: "/all",
        method: "GET",
        params: { page, limit, search, status, priority, source },
      }),
      providesTags: ["Enquiry"],
    }),

    getEnquiryById: builder.mutation({
      query: (enquiryId) => ({
        url: "/view",
        method: "POST",
        body: { enquiryId },
      }),
      providesTags: ["Enquiry"],
    }),

    updateEnquiry: builder.mutation({
      query: (enquiryData) => ({
        url: "/update",
        method: "PUT",
        body: enquiryData,
      }),
      invalidatesTags: ["Enquiry"],
    }),

    deleteEnquiry: builder.mutation({
      query: (enquiryId) => ({
        url: "/delete",
        method: "DELETE",
        body: { enquiryId },
      }),
      invalidatesTags: ["Enquiry"],
    }),

    getEnquiryStats: builder.query({
      query: () => ({
        url: "/stats",
        method: "GET",
      }),
      providesTags: ["Enquiry"],
    }),
  }),
});

export const {
  useCreateEnquiryMutation,
  useGetAllEnquiriesQuery,
  useGetEnquiryByIdMutation,
  useUpdateEnquiryMutation,
  useDeleteEnquiryMutation,
  useGetEnquiryStatsQuery,
} = enquiryApi; 