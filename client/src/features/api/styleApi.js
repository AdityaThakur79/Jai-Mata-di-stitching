import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils/BaseUrl";

const STYLE_API = `${BASE_URL}/style`;

export const styleApi = createApi({
  reducerPath: "styleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: STYLE_API,
    credentials: "include",
  }),
  tagTypes: ["Style"],
  endpoints: (builder) => ({
    createStyle: builder.mutation({
      query: (formData) => ({
        url: "/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Style"],
    }),

    getAllStyles: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/all",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: ["Style"],
    }),

    getStyleById: builder.mutation({
      query: (styleId) => ({
        url: "/view",
        method: "POST",
        body: { styleId },
      }),
      providesTags: ["Style"],
    }),

    updateStyle: builder.mutation({
      query: (formData) => ({
        url: "/update",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Style"],
    }),

    deleteStyle: builder.mutation({
      query: (styleId) => ({
        url: "/delete",
        method: "DELETE",
        body: { styleId },
      }),
      invalidatesTags: ["Style"],
    }),
  }),
});

export const {
  useCreateStyleMutation,
  useGetAllStylesQuery,
  useGetStyleByIdMutation,
  useUpdateStyleMutation,
  useDeleteStyleMutation,
} = styleApi;
