import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Download,
  Search,
  Calendar,
  Loader2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useGetAllEmployeesAttendanceSummaryQuery } from "@/features/api/attendanceApi";
import toast from "react-hot-toast";

const AttendanceList = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch attendance summary
  const { data: summaryData, isLoading } =
    useGetAllEmployeesAttendanceSummaryQuery({
      month: selectedMonth,
      year: selectedYear,
    });

  // Filter employees based on search
  const filteredEmployees =
    summaryData?.data?.filter(
      (item) =>
        item.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // Calculate overall stats
  const totalPresent = filteredEmployees.reduce(
    (sum, item) => sum + item.stats.present,
    0
  );
  const totalAbsent = filteredEmployees.reduce(
    (sum, item) => sum + item.stats.absent,
    0
  );
  const avgAttendance =
    filteredEmployees.length > 0
      ? (
          filteredEmployees.reduce(
            (sum, item) => sum + parseFloat(item.attendancePercentage),
            0
          ) / filteredEmployees.length
        ).toFixed(2)
      : 0;

  // Get month options
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get year options
  const years = [];
  for (let i = currentDate.getFullYear(); i >= currentDate.getFullYear() - 5; i--) {
    years.push(i);
  }

  // View employee details
  const viewDetails = (employeeId) => {
    navigate(`/employee/attendance/employee/${employeeId}`);
  };

  // Export attendance (placeholder for now)
  const exportAttendance = (employee) => {
    toast.success(`Exporting attendance for ${employee.name}...`);
    // Will implement export functionality later
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Attendance Records
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and manage employee attendance records
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Month Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Employees
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Employees
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filteredEmployees.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Present
                </p>
                <p className="text-2xl font-bold text-green-600">{totalPresent}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Absent
                </p>
                <p className="text-2xl font-bold text-red-600">{totalAbsent}</p>
              </div>
              <Calendar className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Avg Attendance
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {avgAttendance}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Employee Attendance - {months[selectedMonth]} {selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-center">Present</TableHead>
                  <TableHead className="text-center">Absent</TableHead>
                  <TableHead className="text-center">Leave</TableHead>
                  <TableHead className="text-center">Total Days</TableHead>
                  <TableHead className="text-center">Attendance %</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((item) => (
                    <TableRow key={item.employee.employeeId}>
                      <TableCell className="font-medium">
                        {item.employee.name}
                      </TableCell>
                      <TableCell>{item.employee.employeeId}</TableCell>
                      <TableCell>{item.employee.role}</TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-green-100 text-green-700">
                          {item.stats.present}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-red-100 text-red-700">
                          {item.stats.absent}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-yellow-100 text-yellow-700">
                          {item.stats.leave}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.stats.totalDays}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={
                            parseFloat(item.attendancePercentage) >= 90
                              ? "bg-green-100 text-green-700"
                              : parseFloat(item.attendancePercentage) >= 75
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }
                        >
                          {item.attendancePercentage}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewDetails(item.employee.employeeId)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => exportAttendance(item.employee)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <p className="text-gray-500">No employees found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceList;
