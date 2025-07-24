import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils/BaseUrl";

const CATEGORIES_API = `${BASE_URL}/categories`;

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: CATEGORIES_API,
    credentials: "include",
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => ({
        url: "/all",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    getCategoryById: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryByIdMutation,
} = categoriesApi; 