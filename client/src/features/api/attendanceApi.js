import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils/BaseUrl";

const ATTENDANCE_API = `${BASE_URL}/attendance`;

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ATTENDANCE_API,
    credentials: "include",
  }),
  tagTypes: ["Attendance"],
  endpoints: (builder) => ({
    // Mark attendance (bulk)
    markAttendance: builder.mutation({
      query: (data) => ({
        url: "/mark",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Attendance"],
    }),

    // Get attendance by date
    getAttendanceByDate: builder.query({
      query: (date) => ({
        url: "/date",
        method: "GET",
        params: { date },
      }),
      providesTags: ["Attendance"],
    }),

    // Get employee attendance
    getEmployeeAttendance: builder.query({
      query: ({ employeeId, startDate, endDate, month, year }) => ({
        url: `/employee/${employeeId}`,
        method: "GET",
        params: { startDate, endDate, month, year },
      }),
      providesTags: ["Attendance"],
    }),

    // Get all employees attendance summary
    getAllEmployeesAttendanceSummary: builder.query({
      query: ({ month, year, startDate, endDate }) => ({
        url: "/summary",
        method: "GET",
        params: { month, year, startDate, endDate },
      }),
      providesTags: ["Attendance"],
    }),

    // Update attendance
    updateAttendance: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Attendance"],
    }),

    // Delete attendance
    deleteAttendance: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Attendance"],
    }),

    // Update attendance by date (for superadmin/director)
    updateAttendanceByDate: builder.mutation({
      query: (data) => ({
        url: "/update-by-date",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Attendance"],
    }),

    // Auto-mark absent
    autoMarkAbsent: builder.mutation({
      query: (data) => ({
        url: "/auto-mark-absent",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Attendance"],
    }),
  }),
});

export const {
  useMarkAttendanceMutation,
  useGetAttendanceByDateQuery,
  useGetEmployeeAttendanceQuery,
  useGetAllEmployeesAttendanceSummaryQuery,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
  useUpdateAttendanceByDateMutation,
  useAutoMarkAbsentMutation,
} = attendanceApi;
