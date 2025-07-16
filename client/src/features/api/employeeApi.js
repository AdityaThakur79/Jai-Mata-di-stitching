import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils/BaseUrl";
import { employeeLoggedIn } from "../authSlice";

const EMPLOYEE_API = `${BASE_URL}/employee`;

export const employeeApi = createApi({
    reducerPath: "employeeApi",
    baseQuery: fetchBaseQuery({
        baseUrl: EMPLOYEE_API,
        credentials: "include",
    }),
    tagTypes: ["Employee"],
    endpoints: (builder) => ({
        // Employee Login
        employeeLogin: builder.mutation({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: credentials,
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(employeeLoggedIn({ employee: result.data.employee }));
                } catch (error) {
                    console.log("Employee login error:", error);
                }
            },
        }),

        // Employee Profile
        getEmployeeProfile: builder.query({
            query: () => ({
                url: "/profile",
                method: "GET",
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(employeeLoggedIn({ employee: result.data.employee }));
                } catch (error) {
                    console.log(error);
                }
            },
            providesTags: ["Employee"],
        }),

        // Employee Salary Slips
        getEmployeeSalarySlips: builder.query({
            query: () => ({
                url: "/salary-slips",
                method: "GET",
            }),
            providesTags: ["Employee"],
        }),

        // Download Salary Slip
        downloadEmployeeSalarySlip: builder.mutation({
            async queryFn({ employeeId, month }, _queryApi, _extraOptions, fetchWithBQ) {
                const response = await fetchWithBQ({
                    url: "/download-salary-slip",
                    method: "POST",
                    body: { employeeId, month },
                });
                if (response.error) {
                    // Try to parse the error blob as JSON
                    try {
                        const errorText = await response.error.data.text();
                        const errorJson = JSON.parse(errorText);
                        return { error: errorJson };
                    } catch {
                        return { error: { message: "Unknown error" } };
                    }
                }
                // If successful, convert to blob
                const blob = new Blob([response.data], { type: "application/pdf" });
                return { data: blob };
            },
        }),

        // Admin endpoints
        createEmployee: builder.mutation({
            query: (formData) => ({
                url: "/create",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Employee"],
        }),

        getAllEmployees: builder.query({
            query: ({ page = 1, limit = 10, search = "", status = "" }) => ({
                url: "/all",
                method: "GET",
                params: { page, limit, search, status },
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

        // Employee Advance Payment APIs
        addEmployeeAdvance: builder.mutation({
            query: (data) => ({
                url: "/advance",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Employee"],
        }),

        getEmployeeAdvances: builder.mutation({
            query: (employeeId) => ({
                url: "/get-advance",
                method: "POST",
                body: { employeeId },
            }),
            providesTags: ["Employee"],
        }),

        getAllEmployeeAdvances: builder.query({
            query: ({ page = 1, limit = 10, search = "" }) => ({
                url: "/advances",
                method: "GET",
                params: { page, limit, search },
            }),
            providesTags: ["Employee"],
        }),

        deleteEmployeeAdvance: builder.mutation({
            query: (data) => ({
                url: "/delete-advance",
                method: "DELETE",
                body: data,
            }),
            invalidatesTags: ["Employee"],
        }),

        generateSalarySlip: builder.mutation({
            query: (data) => ({
                url: "/generate-salary-slip",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Employee"],
        }),

        sendSalarySlipEmail: builder.mutation({
            query: (data) => ({
                url: "/send-salary-slip-email",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useEmployeeLoginMutation,
    useGetEmployeeProfileQuery,
    useGetEmployeeSalarySlipsQuery,
    useDownloadEmployeeSalarySlipMutation,
    useCreateEmployeeMutation,
    useGetAllEmployeesQuery,
    useGetEmployeeByIdMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
    useDownloadEmployeeIdCardMutation,
    useAddEmployeeAdvanceMutation,
    useGetEmployeeAdvancesMutation,
    useGetAllEmployeeAdvancesQuery,
    useDeleteEmployeeAdvanceMutation,
    useGenerateSalarySlipMutation,
    useSendSalarySlipEmailMutation,
} = employeeApi;
