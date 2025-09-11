import React from "react";
import { useSelector } from "react-redux";
import { useGetEmployeeSalarySlipsQuery } from "@/features/api/employeeApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const { employee, isEmployeeAuthenticated } = useSelector((state) => state.auth);
  const { data: salaryData, isLoading, error } = useGetEmployeeSalarySlipsQuery();
  const navigate = useNavigate();

  console.log("Employee Dashboard - Auth State:", { employee, isEmployeeAuthenticated });
  console.log("Employee Dashboard - API State:", { salaryData, isLoading, error });
  console.log(salaryData)

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  
  // Show error state if API fails
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Data</h3>
          <p className="text-red-600 mt-1">
            {error?.data?.message || error?.message || "Failed to load salary data"}
          </p>
          <p className="text-sm text-red-500 mt-2">
            Status: {error?.status} | Data: {JSON.stringify(error?.data)}
          </p>
        </div>
      </div>
    );
  }
  
  // Calculate current month salary info
  const currentMonthSlip = salaryData?.salarySlips?.find(slip => 
    slip.month === currentMonth
  );
  
  const currentMonthAdvances = salaryData?.advancePayments?.filter(advance => {
    const advanceDate = new Date(advance.date);
    return advanceDate.getMonth() === currentDate.getMonth() && 
           advanceDate.getFullYear() === currentDate.getFullYear();
  }) || [];

  const totalCurrentMonthAdvance = currentMonthAdvances.reduce((sum, advance) => sum + advance.amount, 0);
  const remainingSalary = (salaryData?.baseSalary || 0) - totalCurrentMonthAdvance;

  const stats = [
    {
      title: "Base Salary",
      value: `₹${salaryData?.baseSalary?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "This Month Advances",
      value: `₹${totalCurrentMonthAdvance.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Remaining Salary",
      value: `₹${remainingSalary.toLocaleString()}`,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Salary Slips",
      value: salaryData?.salarySlips?.length || 0,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#f77f2f] to-[#fca16a] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {employee?.name}!</h1>
            <p className="text-white/80 mt-2">
              Employee ID: {employee?.employeeId} • Role: {employee?.role?.charAt(0).toUpperCase() + employee?.role?.slice(1)}
              {Array.isArray(employee?.secondaryRoles) && employee.secondaryRoles.length > 0 && (
                <span className="ml-2 text-sm opacity-90">(Secondary: {employee.secondaryRoles.join(", ")})</span>
              )}
            </p>
            <p className="text-white/80">
              Joined: {new Date(employee?.joiningDate).toLocaleDateString()}
            </p>
          </div>
          <div className="hidden md:block">
            <User className="w-16 h-16 text-white/20" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Month Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {currentMonth} Status
            </CardTitle>
            <CardDescription>
              Your salary and advance payment status for this month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Base Salary:</span>
              <span className="font-bold text-green-600">
                ₹{salaryData?.baseSalary?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Advances Taken:</span>
              <span className="font-bold text-orange-600">
                ₹{totalCurrentMonthAdvance.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">Remaining Amount:</span>
              <span className="font-bold text-blue-600">
                ₹{remainingSalary.toLocaleString()}
              </span>
            </div>
            {currentMonthSlip && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-green-800 font-medium">Salary Slip Generated</span>
                  <Button
                    size="sm"
                    onClick={() => navigate("/employee/salary")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Advances
            </CardTitle>
            <CardDescription>
              Your recent advance payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentMonthAdvances.length > 0 ? (
              <div className="space-y-3">
                {currentMonthAdvances.slice(0, 3).map((advance, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{advance.reason || "Advance Payment"}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(advance.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-bold text-orange-600">
                      ₹{advance.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                {currentMonthAdvances.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{currentMonthAdvances.length - 3} more advances
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No advances taken this month</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Access frequently used features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate("/employee/salary")}
              className="flex items-center gap-2 h-auto p-4"
            >
              <FileText className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">View Salary Slips</div>
                <div className="text-sm opacity-80">Download your salary slips</div>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/employee/profile")}
              variant="outline"
              className="flex items-center gap-2 h-auto p-4"
            >
              <User className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">My Profile</div>
                <div className="text-sm opacity-80">View and update profile</div>
              </div>
            </Button>
            {employee?.role === "biller" && (
              <Button
                onClick={() => navigate("/employee/billing")}
                variant="outline"
                className="flex items-center gap-2 h-auto p-4"
              >
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Billing</div>
                  <div className="text-sm opacity-80">Manage billing tasks</div>
                </div>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard; 