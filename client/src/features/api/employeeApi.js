import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils/BaseUrl";

const EMPLOYEE_API = `${BASE_URL}/employee`;

export const employeeApi = createApi({
    reducerPath: "employeeApi",
    baseQuery: fetchBaseQuery({
        baseUrl: EMPLOYEE_API,
        credentials: "include",
    }),
    tagTypes: ["Employee"],
    endpoints: (builder) => ({
        createEmployee: builder.mutation({
            query: (formData) => ({
                url: "/create",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Employee"],
        }),

        getAllEmployees: builder.query({
            query: ({ page = 1, limit = 10, search = "" }) => ({
                url: "/all",
                method: "GET",
                params: { page, limit, search },
            }),
            providesTags: ["Employee"],
        }),

        getEmployeeById: builder.mutation({
            query: (employeeId) => ({
                url: "/get",
                method: "POST",
                body: { employeeId },
            }),
            providesTags: ["Employee"],
        }),

        updateEmployee: builder.mutation({
            query: (formData) => ({
                url: "/update",
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["Employee"],
        }),

        deleteEmployee: builder.mutation({
            query: (employeeId) => ({
                url: "/delete",
                method: "DELETE",
                body: { employeeId },
            }),
            invalidatesTags: ["Employee"],
        }),

        downloadEmployeeIdCard: builder.mutation({
            query: (employeeId) => ({
                url: "/idcard-pdf",
                method: "POST",
                body: { employeeId },
                responseHandler: (response) => response.blob(),
            }),
        }),
    }),
});

export const {
    useCreateEmployeeMutation,
    useGetAllEmployeesQuery,
    useGetEmployeeByIdMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
    useDownloadEmployeeIdCardMutation,
} = employeeApi;
