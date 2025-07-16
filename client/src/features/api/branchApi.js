import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils/BaseUrl";

const BRANCH_API = `${BASE_URL}/branch`;

export const branchApi = createApi({
  reducerPath: "branchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BRANCH_API,
    credentials: "include",
  }),
  tagTypes: ["Branch"],
  endpoints: (builder) => ({
    getAllBranches: builder.query({
      query: () => ({
        url: "/all",
        method: "GET",
      }),
      providesTags: ["Branch"],
    }),
    getBranchById: builder.query({
      query: (branchId) => ({
        url: "/get",
        method: "POST",
        body: { branchId },
      }),
      providesTags: ["Branch"],
    }),
    createBranch: builder.mutation({
      query: (formData) => ({
        url: "/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Branch"],
    }),
    updateBranch: builder.mutation({
      query: (formData) => ({
        url: "/update",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Branch"],
    }),
    deleteBranch: builder.mutation({
      query: (branchId) => ({
        url: "/delete",
        method: "DELETE",
        body: { branchId },
      }),
      invalidatesTags: ["Branch"],
    }),
  }),
});

export const {
  useGetAllBranchesQuery,
  useGetBranchByIdQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} = branchApi; 