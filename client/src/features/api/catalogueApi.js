import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/BaseUrl.jsx";

const CATALOGUE_API = `${BASE_URL}/catalogue`;

export const catalogueApi = createApi({
  reducerPath: "catalogueApi",
  baseQuery: fetchBaseQuery({ baseUrl: CATALOGUE_API, credentials: "include" }),
  tagTypes: ["Catalogue"],
  endpoints: (builder) => ({
    getCatalogues: builder.query({
      query: ({ page = 1, limit = 20, type, search } = {}) => ({
        url: `/`,
        params: { page, limit, type, search },
        credentials: "include",
      }),
      providesTags: (result) =>
        result?.catalogues
          ? [
              ...result.catalogues.map((c) => ({ type: "Catalogue", id: c._id })),
              { type: "Catalogue", id: "LIST" },
            ]
          : [{ type: "Catalogue", id: "LIST" }],
    }),
    getCatalogueById: builder.query({
      query: (id) => ({ url: `/${id}`, credentials: "include" }),
      providesTags: (result, _e, id) => [{ type: "Catalogue", id }],
    }),
    createCatalogue: builder.mutation({
      query: (payload) => ({ url: `/`, method: "POST", body: payload }),
      invalidatesTags: [{ type: "Catalogue", id: "LIST" }],
    }),
    updateCatalogue: builder.mutation({
      query: ({ id, payload }) => ({ url: `/${id}`, method: "PUT", body: payload }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "Catalogue", id }, { type: "Catalogue", id: "LIST" }],
    }),
    deleteCatalogue: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Catalogue", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCataloguesQuery,
  useGetCatalogueByIdQuery,
  useCreateCatalogueMutation,
  useUpdateCatalogueMutation,
  useDeleteCatalogueMutation,
} = catalogueApi;


