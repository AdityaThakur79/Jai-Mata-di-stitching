import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils/BaseUrl";

const GALLERY_API = `${BASE_URL}/gallery`;

export const galleryApi = createApi({
  reducerPath: "galleryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: GALLERY_API,
    credentials: "include",
  }),
  tagTypes: ["Gallery"],
  endpoints: (builder) => ({
    getAllGallery: builder.query({
      query: () => ({
        url: "/all",
        method: "GET",
      }),
      providesTags: ["Gallery"],
    }),
    getGalleryById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: ["Gallery"],
    }),
    createGallery: builder.mutation({
      query: (data) => ({
        url: "/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Gallery"],
    }),
    updateGallery: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Gallery"],
    }),
    deleteGallery: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Gallery"],
    }),
  }),
});

export const {
  useGetAllGalleryQuery,
  useGetGalleryByIdQuery,
  useCreateGalleryMutation,
  useUpdateGalleryMutation,
  useDeleteGalleryMutation,
} = galleryApi; 