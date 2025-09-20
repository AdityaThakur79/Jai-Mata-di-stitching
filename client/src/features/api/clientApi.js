import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/BaseUrl.jsx";

const CLIENT_API = `${BASE_URL}/client`;

const baseQuery = fetchBaseQuery({
  baseUrl: CLIENT_API,
  credentials: "include",
});

export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery,
  tagTypes: ["Client"],
  endpoints: (builder) => ({
    // Create client
    createClient: builder.mutation({
      query: (formData) => ({
        url: "/create",
        method: "POST",
        body: formData,
        credentials: "include",
      }),
      invalidatesTags: ["Client"],
    }),

    // Get all clients
    getAllClients: builder.query({
      query: ({ page = 1, limit = 10, search = "", city = "", state = "", isActive = "" }) => ({
        url: "/all",
        params: { page, limit, search, city, state, isActive },
        credentials: "include",
      }),
      providesTags: ["Client"],
    }),

    // Get client by ID
    getClientById: builder.mutation({
      query: (clientId) => ({
        url: "/get-by-id",
        method: "POST",
        body: { clientId },
        credentials: "include",
      }),
    }),

    // Update client
    updateClient: builder.mutation({
      query: (formData) => ({
        url: "/update",
        method: "PUT",
        body: formData,
        credentials: "include",
      }),
      invalidatesTags: ["Client"],
    }),

    // Delete client
    deleteClient: builder.mutation({
      query: (clientId) => ({
        url: "/delete",
        method: "DELETE",
        body: { clientId },
        credentials: "include",
      }),
      invalidatesTags: ["Client"],
    }),

    // Get client statistics
    getClientStats: builder.query({
      query: () => ({
        url: "/stats",
        credentials: "include",
      }),
    }),

    // Get all branches
    getAllBranches: builder.query({
      query: () => ({
        url: "/branches",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateClientMutation,
  useGetAllClientsQuery,
  useGetClientByIdMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useGetClientStatsQuery,
  useGetAllBranchesQuery,
} = clientApi;
