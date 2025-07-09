import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils/BaseUrl";

const FABRIC_API = `${BASE_URL}/fabric`;

export const fabricApi = createApi({
  reducerPath: "fabricApi",
  baseQuery: fetchBaseQuery({
    baseUrl: FABRIC_API,
    credentials: "include",
  }),
  tagTypes: ["Fabric"],
  endpoints: (builder) => ({
    createFabric: builder.mutation({
      query: (formData) => ({
        url: "/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Fabric"],
    }),

    getAllFabrics: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/all",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: ["Fabric"],
    }),

    getFabricById: builder.mutation({
      query: (fabricId) => ({
        url: "/view",
        method: "POST",
        body: { fabricId },
      }),
      providesTags: ["Fabric"],
    }),

    updateFabric: builder.mutation({
      query: (formData) => ({
        url: "/update",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Fabric"],
    }),

    deleteFabric: builder.mutation({
      query: (fabricId) => ({
        url: "/delete",
        method: "DELETE",
        body: { fabricId },
      }),
      invalidatesTags: ["Fabric"],
    }),
  }),
});

export const {
  useCreateFabricMutation,
  useGetAllFabricsQuery,
  useGetFabricByIdMutation,
  useUpdateFabricMutation,
  useDeleteFabricMutation,
} = fabricApi;
