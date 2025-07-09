import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils/BaseUrl";

const MASTER_API = `${BASE_URL}/master`;

export const masterApi = createApi({
  reducerPath: "masterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: MASTER_API,
    credentials: "include",
  }),
  tagTypes: ["Master"],
  endpoints: (builder) => ({
    createMaster: builder.mutation({
      query: (formData) => ({
        url: "/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Master"],
    }),

    getAllMasters: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: '/all',
        method: "GET",
         params: { page, limit, search },
      }),
      providesTags: ["Master"],
    }),

    getMasterById: builder.mutation({
      query: (masterId) => ({
        url: `/view`,
        method: "POST",
        body: { masterId },
      }),
        invalidatesTags: ["Master"],
    }),

    updateMaster: builder.mutation({
      query: (formData) => ({
        url: "/update",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Master"],
    }),

    deleteMaster: builder.mutation({
      query: (masterId) => ({
        url: "/delete",
        method: "DELETE",
        body: { masterId },
      }),
      invalidatesTags: ["Master"],
    }),
  }),
});

export const {
  useCreateMasterMutation,
  useGetAllMastersQuery,
  useGetMasterByIdMutation,
  useUpdateMasterMutation,
  useDeleteMasterMutation,
} = masterApi;
