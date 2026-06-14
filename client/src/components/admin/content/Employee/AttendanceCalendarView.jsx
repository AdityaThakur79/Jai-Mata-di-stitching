import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Coffee, Clock, Loader2 } from "lucide-react";

const AttendanceCalendarView = ({ employeeId, month, year, attendanceData }) => {
  if (!attendanceData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const { attendance, stats } = attendanceData.data || {};

  // Generate calendar for the month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);

  // Create attendance map for quick lookup
  const attendanceMap = {};
  attendance?.forEach(record => {
    const date = new Date(record.date);
    const day = date.getDate();
    attendanceMap[day] = record;
  });

  // Create calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  
  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 border-green-500 dark:bg-green-900/20";
      case "absent":
        return "bg-red-100 border-red-500 dark:bg-red-900/20";
      case "leave":
        return "bg-yellow-100 border-yellow-500 dark:bg-yellow-900/20";
      case "half-day":
        return "bg-blue-100 border-blue-500 dark:bg-blue-900/20";
      default:
        return "bg-gray-100 border-gray-300 dark:bg-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "absent":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "leave":
        return <Coffee className="w-4 h-4 text-yellow-600" />;
      case "half-day":
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold">{stats?.totalDays || 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
            <p className="text-2xl font-bold text-green-600">{stats?.present || 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
            <p className="text-2xl font-bold text-red-600">{stats?.absent || 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">Leave</p>
            <p className="text-2xl font-bold text-yellow-600">{stats?.leave || 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">Half Day</p>
            <p className="text-2xl font-bold text-blue-600">{stats?.halfDay || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {monthNames[month]} {year}
        </h3>
        
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map(day => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }
            
            const record = attendanceMap[day];
            const hasAttendance = !!record;
            const statusColor = hasAttendance ? getStatusColor(record.status) : "bg-white dark:bg-gray-900 border border-gray-200";
            
            return (
              <div
                key={day}
                className={`aspect-square border-2 rounded-lg p-2 transition-all hover:shadow-md ${statusColor}`}
              >
                <div className="flex flex-col items-center justify-between h-full">
                  <span className="text-sm font-semibold">{day}</span>
                  
                  {hasAttendance ? (
                    <div className="flex flex-col items-center gap-1">
                      {getStatusIcon(record.status)}
                      {record.checkInTime && (
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {record.checkInTime}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-500" />
          <span className="text-sm">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 border-2 border-red-500" />
          <span className="text-sm">Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-100 border-2 border-yellow-500" />
          <span className="text-sm">Leave</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-500" />
          <span className="text-sm">Half Day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white border-2 border-gray-200" />
          <span className="text-sm">No Record</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendarView;
