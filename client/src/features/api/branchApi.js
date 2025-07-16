import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/BaseUrl.jsx";

export const branchApi = createApi({
  reducerPath: "branchApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL + "/branch" }),
  tagTypes: ["Branch"],
  endpoints: (builder) => ({
    createBranch: builder.mutation({
      query: (data) => ({
        url: "/create",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Branch"],
    }),
    getAllBranches: builder.query({
      query: (params) => ({
        url: `/all?${new URLSearchParams(params).toString()}`,
        credentials: "include",
      }),
      providesTags: ["Branch"],
    }),
    getBranchById: builder.mutation({
      query: (data) => ({
        url: "/get",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      providesTags: ["Branch"],
    }),
    updateBranch: builder.mutation({
      query: (data) => ({
        url: "/update",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Branch"],
    }),
    deleteBranch: builder.mutation({
      query: (data) => ({
        url: "/delete",
        method: "DELETE",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Branch"],
    }),
  }),
});

export const {
  useCreateBranchMutation,
  useGetAllBranchesQuery,
  useGetBranchByIdMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} = branchApi; 