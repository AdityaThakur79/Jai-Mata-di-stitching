import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UserCheck,
  UserX,
  Search,
  Calendar,
  Save,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useGetAllEmployeesQuery } from "@/features/api/employeeApi";
import {
  useMarkAttendanceMutation,
  useGetAttendanceByDateQuery,
} from "@/features/api/attendanceApi";
import toast from "react-hot-toast";

const MarkAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [attendanceData, setAttendanceData] = useState({});

  // Fetch all active employees
  const { data: employeesData, isLoading: isLoadingEmployees } =
    useGetAllEmployeesQuery({
      page: 1,
      limit: 1000,
      search: "",
      status: "active",
    });

  // Fetch existing attendance for selected date
  const { data: existingAttendance, isLoading: isLoadingAttendance } =
    useGetAttendanceByDateQuery(selectedDate, {
      skip: !selectedDate,
    });

  // Mark attendance mutation
  const [markAttendance, { isLoading: isMarking }] = useMarkAttendanceMutation();

  // Initialize attendance data when employees or existing attendance changes
  useEffect(() => {
    if (employeesData?.employees && existingAttendance?.data) {
      const newAttendanceData = {};

      employeesData.employees.forEach((employee) => {
        // Check if attendance already exists
        const existing = existingAttendance.data.find(
          (att) => att.employeeId === employee.employeeId
        );

        newAttendanceData[employee.employeeId] = {
          employeeId: employee.employeeId,
          employeeName: employee.name,
          status: existing ? existing.status : null,
          checkInTime: existing ? existing.checkInTime : "",
          checkOutTime: existing ? existing.checkOutTime : "",
          notes: existing ? existing.notes : "",
        };
      });

      setAttendanceData(newAttendanceData);
    } else if (employeesData?.employees) {
      // Initialize with null status
      const newAttendanceData = {};
      employeesData.employees.forEach((employee) => {
        newAttendanceData[employee.employeeId] = {
          employeeId: employee.employeeId,
          employeeName: employee.name,
          status: null,
          checkInTime: "",
          checkOutTime: "",
          notes: "",
        };
      });
      setAttendanceData(newAttendanceData);
    }
  }, [employeesData, existingAttendance]);

  // Mark employee status
  const markEmployee = (employeeId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        status,
        checkInTime: status === "present" ? prev[employeeId].checkInTime || "09:00" : "",
      },
    }));
  };

  // Mark all employees as present/absent
  const markAll = (status) => {
    const updatedData = {};
    Object.keys(attendanceData).forEach((employeeId) => {
      updatedData[employeeId] = {
        ...attendanceData[employeeId],
        status,
        checkInTime: status === "present" ? "09:00" : "",
      };
    });
    setAttendanceData(updatedData);
  };

  // Submit attendance
  const handleSubmit = async () => {
    // Filter only employees with status marked
    const markedAttendance = Object.values(attendanceData).filter(
      (att) => att.status !== null
    );

    if (markedAttendance.length === 0) {
      toast.error("Please mark attendance for at least one employee");
      return;
    }

    try {
      const result = await markAttendance({
        attendanceData: markedAttendance,
        date: selectedDate,
      }).unwrap();

      const { success, updated, failed } = result.data;

      if (success.length > 0 || updated.length > 0) {
        toast.success(
          `Attendance marked successfully for ${success.length + updated.length} employees`
        );
      }

      if (failed.length > 0) {
        toast.error(`Failed to mark attendance for ${failed.length} employees`);
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error(error?.data?.message || "Failed to mark attendance");
    }
  };

  // Filter employees based on search
  const filteredEmployees = employeesData?.employees?.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Calculate stats
  const totalEmployees = filteredEmployees.length;
  const presentCount = Object.values(attendanceData).filter(
    (att) => att.status === "present"
  ).length;
  const absentCount = Object.values(attendanceData).filter(
    (att) => att.status === "absent"
  ).length;
  const unmarkedCount = Object.values(attendanceData).filter(
    (att) => att.status === null
  ).length;

  if (isLoadingEmployees) {
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
            Mark Attendance
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Mark daily attendance for all employees
          </p>
        </div>
      </div>

      {/* Date and Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Date Picker */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Search */}
            <div className="flex-1">
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

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                onClick={() => markAll("present")}
                variant="outline"
                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark All Present
              </Button>
              <Button
                onClick={() => markAll("absent")}
                variant="outline"
                className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Mark All Absent
              </Button>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalEmployees}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
                <p className="text-2xl font-bold text-green-600">{presentCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
                <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unmarked</p>
                <p className="text-2xl font-bold text-gray-600">{unmarkedCount}</p>
              </div>
              <UserX className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Employees ({filteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredEmployees.map((employee) => {
              const attendance = attendanceData[employee.employeeId];
              const isPresent = attendance?.status === "present";
              const isAbsent = attendance?.status === "absent";

              return (
                <div
                  key={employee.employeeId}
                  className="flex flex-col p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                        {employee.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {employee.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {employee.employeeId} • {employee.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {attendance?.status && (
                        <Badge
                          variant={isPresent ? "success" : "destructive"}
                          className={
                            isPresent
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        >
                          {attendance.status.toUpperCase()}
                        </Badge>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={isPresent ? "default" : "outline"}
                          onClick={() => markEmployee(employee.employeeId, "present")}
                          className={
                            isPresent
                              ? "bg-green-600 hover:bg-green-700"
                              : "border-green-300 text-green-700 hover:bg-green-50"
                          }
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant={isAbsent ? "default" : "outline"}
                          onClick={() => markEmployee(employee.employeeId, "absent")}
                          className={
                            isAbsent
                              ? "bg-red-600 hover:bg-red-700"
                              : "border-red-300 text-red-700 hover:bg-red-50"
                          }
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Absent
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Check-in, Check-out, and Notes - shown when marked */}
                  {attendance?.status && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-16">
                      {/* Check-in Time */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Check In
                        </label>
                        <Input
                          type="time"
                          value={attendance.checkInTime}
                          onChange={(e) =>
                            setAttendanceData((prev) => ({
                              ...prev,
                              [employee.employeeId]: {
                                ...prev[employee.employeeId],
                                checkInTime: e.target.value,
                              },
                            }))
                          }
                          className="h-9 text-sm"
                          disabled={attendance.status === "absent"}
                        />
                      </div>

                      {/* Check-out Time */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Check Out
                        </label>
                        <Input
                          type="time"
                          value={attendance.checkOutTime}
                          onChange={(e) =>
                            setAttendanceData((prev) => ({
                              ...prev,
                              [employee.employeeId]: {
                                ...prev[employee.employeeId],
                                checkOutTime: e.target.value,
                              },
                            }))
                          }
                          className="h-9 text-sm"
                          disabled={attendance.status === "absent"}
                        />
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Notes
                        </label>
                        <Input
                          type="text"
                          placeholder="Optional notes..."
                          value={attendance.notes}
                          onChange={(e) =>
                            setAttendanceData((prev) => ({
                              ...prev,
                              [employee.employeeId]: {
                                ...prev[employee.employeeId],
                                notes: e.target.value,
                              },
                            }))
                          }
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isMarking || unmarkedCount === totalEmployees}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              {isMarking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Attendance
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarkAttendance;
