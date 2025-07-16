import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils/BaseUrl";

const ITEM_MASTER_API = `${BASE_URL}/item`;

export const itemMasterApi = createApi({
  reducerPath: "itemMasterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ITEM_MASTER_API,
    credentials: "include",
  }),
  tagTypes: ["ItemMaster"],
  endpoints: (builder) => ({
    createItemMaster: builder.mutation({
      query: (data) => ({
        url: "/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ItemMaster"],
    }),

    getAllItemMasters: builder.query({
      query: ({ page = 1, limit = 10, search = "", category = "" }) => ({
        url: "/all",
        method: "GET",
        params: { page, limit, search, ...(category ? { category } : {}) },
      }),
      providesTags: ["ItemMaster"],
    }),

    getItemMasterById: builder.mutation({
      query: (itemId) => ({
        url: "/view",
        method: "POST",
        body: { itemId },
      }),
      providesTags: ["ItemMaster"],
    }),

    updateItemMaster: builder.mutation({
      query: (data) => ({
        url: "/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ItemMaster"],
    }),

    deleteItemMaster: builder.mutation({
      query: (itemId) => ({
        url: "/delete",
        method: "DELETE",
        body: { itemId },
      }),
      invalidatesTags: ["ItemMaster"],
    }),
  }),
});

export const {
  useCreateItemMasterMutation,
  useGetAllItemMastersQuery,
  useGetItemMasterByIdMutation,
  useUpdateItemMasterMutation,
  useDeleteItemMasterMutation,
} = itemMasterApi;
