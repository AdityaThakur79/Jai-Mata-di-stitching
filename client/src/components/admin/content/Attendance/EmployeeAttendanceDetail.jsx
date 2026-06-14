import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  ArrowLeft,
  Calendar,
  Download,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useGetEmployeeAttendanceQuery } from "@/features/api/attendanceApi";
import toast from "react-hot-toast";
import { pdf } from "@react-pdf/renderer";
import AttendanceSheet from "./AttendanceSheet";

const EmployeeAttendanceDetail = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Fetch employee attendance
  const { data: attendanceData, isLoading } = useGetEmployeeAttendanceQuery({
    employeeId,
    month: selectedMonth,
    year: selectedYear,
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const years = [];
  for (let i = currentDate.getFullYear(); i >= currentDate.getFullYear() - 5; i--) {
    years.push(i);
  }

  // Export attendance sheet
  const handleExport = async () => {
    if (!attendanceData?.data) return;

    try {
      toast.loading("Generating PDF...");
      
      const blob = await pdf(
        <AttendanceSheet
          employee={attendanceData.data.employee}
          attendance={attendanceData.data.attendance}
          stats={attendanceData.data.stats}
          month={months[selectedMonth]}
          year={selectedYear}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Attendance_${attendanceData.data.employee.name}_${months[selectedMonth]}_${selectedYear}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success("Attendance sheet exported successfully!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to export attendance sheet");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const { employee, attendance, stats } = attendanceData?.data || {};

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/employee/attendance")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {employee?.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {employee?.employeeId} • {employee?.role}
            </p>
          </div>
        </div>
        <Button
          onClick={handleExport}
          className="bg-gradient-to-r from-orange-500 to-orange-600"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Sheet
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Days</p>
            <p className="text-2xl font-bold">{stats?.totalDays || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Present</p>
            <p className="text-2xl font-bold text-green-600">{stats?.present || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Absent</p>
            <p className="text-2xl font-bold text-red-600">{stats?.absent || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Leave</p>
            <p className="text-2xl font-bold text-yellow-600">{stats?.leave || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Half Day</p>
            <p className="text-2xl font-bold text-blue-600">{stats?.halfDay || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records - {months[selectedMonth]} {selectedYear}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance && attendance.length > 0 ? (
                attendance.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>
                      {new Date(record.date).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell>
                      {new Date(record.date).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          record.status === "present"
                            ? "bg-green-100 text-green-700"
                            : record.status === "absent"
                            ? "bg-red-100 text-red-700"
                            : record.status === "leave"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }
                      >
                        {record.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {record.checkInTime || "-"}
                    </TableCell>
                    <TableCell>
                      {record.checkOutTime || "-"}
                    </TableCell>
                    <TableCell>{record.notes || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">No attendance records found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeAttendanceDetail;
