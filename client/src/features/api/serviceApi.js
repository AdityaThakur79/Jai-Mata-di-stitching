import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils/BaseUrl";

const SERVICE_API = `${BASE_URL}/website-services`;

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: SERVICE_API,
    credentials: "include",
  }),
  tagTypes: ["Service"],
  endpoints: (builder) => ({
    createService: builder.mutation({
      query: (formData) => ({
        url: "/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Service"],
    }),

    getAllServices: builder.query({
      query: ({ page = 1, limit = 10, search = "", gender = "", category = "", subcategory = "", status = "", isPopular = "", isFeatured = "" }) => ({
        url: "/all",
        method: "GET",
        params: { page, limit, search, gender, category, subcategory, status, isPopular, isFeatured },
      }),
      providesTags: ["Service"],
    }),

    getServiceById: builder.mutation({
      query: (serviceId) => ({
        url: "/view",
        method: "POST",
        body: { serviceId },
      }),
      providesTags: ["Service"],
    }),

    updateService: builder.mutation({
      query: (formData) => ({
        url: "/update",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Service"],
    }),

    deleteService: builder.mutation({
      query: (serviceId) => ({
        url: "/delete",
        method: "DELETE",
        body: { serviceId },
      }),
      invalidatesTags: ["Service"],
    }),
  }),
});

export const {
  useCreateServiceMutation,
  useGetAllServicesQuery,
  useGetServiceByIdMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApi; 