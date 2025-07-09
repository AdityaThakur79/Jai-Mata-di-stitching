import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils/BaseUrl";

const CUSTOMER_API = `${BASE_URL}/customer`;

export const customerApi = createApi({
    reducerPath: "customerApi",
    baseQuery: fetchBaseQuery({
        baseUrl: CUSTOMER_API,
        credentials: "include",
    }),
    tagTypes: ["Customer"],
    endpoints: (builder) => ({
        createCustomer: builder.mutation({
            query: (formData) => ({
                url: "/create",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Customer"],
        }),

        getAllCustomers: builder.query({
            query: ({ page = 1, limit = 10, search = "" }) => ({
                url: "/all",
                method: "GET",
                params: { page, limit, search },
            }),
            providesTags: ["Customer"],
        }),

        getCustomerById: builder.mutation({
            query: (customerId) => ({
                url: "/view",
                method: "POST",
                body: { customerId },
            }),
            providesTags: ["Customer"],
        }),

        updateCustomer: builder.mutation({
            query: (formData) => ({
                url: "/update",
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["Customer"],
        }),

        deleteCustomer: builder.mutation({
            query: (customerId) => ({
                url: "/delete",
                method: "DELETE",
                body: { customerId },
            }),
            invalidatesTags: ["Customer"],
        }),
    }),
});

export const {
    useCreateCustomerMutation,
    useGetAllCustomersQuery,
    useGetCustomerByIdMutation,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
} = customerApi;
