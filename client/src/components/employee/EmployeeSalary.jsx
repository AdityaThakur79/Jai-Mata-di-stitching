import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetEmployeeSalarySlipsQuery, useDownloadEmployeeSalarySlipMutation } from "@/features/api/employeeApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Button,
} from "@/components/ui/button";
import {
  FileText,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

const EmployeeSalary = () => {
  const { employee } = useSelector((state) => state.auth);
  const { data: salaryData, isLoading } = useGetEmployeeSalarySlipsQuery();
  const [downloadSalarySlip, { isLoading: isDownloading }] = useDownloadEmployeeSalarySlipMutation();
  const [selectedMonth, setSelectedMonth] = useState(null);

  const handleDownload = async (month) => {
    try {
      const blob = await downloadSalarySlip(month).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `salary-slip-${employee?.name}-${month}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Salary slip downloaded successfully");
    } catch (error) {
      toast.error("Failed to download salary slip");
    }
  };

  const handleViewSlip = (month) => {
    setSelectedMonth(selectedMonth === month ? null : month);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentMonth = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  const currentMonthSlip = salaryData?.salarySlips?.find(slip => slip.month === currentMonth);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Salary & Payments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and download your salary slips
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base Salary</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{salaryData?.baseSalary?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-gray-500">Monthly base salary</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Advances</CardTitle>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ₹{salaryData?.advancePayments?.reduce((sum, advance) => sum + advance.amount, 0)?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-gray-500">Total advances taken</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salary Slips</CardTitle>
            <FileText className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {salaryData?.salarySlips?.length || 0}
            </div>
            <p className="text-xs text-gray-500">Generated slips</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Month Status */}
      {currentMonthSlip && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <Calendar className="w-5 h-5" />
              {currentMonth} - Salary Slip Available
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              Your salary slip for this month has been generated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-sm text-green-600 dark:text-green-400">Basic Salary</div>
                <div className="text-lg font-bold text-green-800 dark:text-green-200">
                  ₹{currentMonthSlip.basicSalary?.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-orange-600 dark:text-orange-400">Advances Deducted</div>
                <div className="text-lg font-bold text-orange-800 dark:text-orange-200">
                  ₹{currentMonthSlip.advancesDeducted?.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-blue-600 dark:text-blue-400">Final Payable</div>
                <div className="text-lg font-bold text-blue-800 dark:text-blue-200">
                  ₹{currentMonthSlip.finalPayable?.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">Generated On</div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {new Date(currentMonthSlip.generatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleDownload(currentMonth)}
                disabled={isDownloading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? "Downloading..." : "Download Slip"}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleViewSlip(currentMonth)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Salary Slips Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            All Salary Slips
          </CardTitle>
          <CardDescription>
            View and download your salary slips by month
          </CardDescription>
        </CardHeader>
        <CardContent>
          {salaryData?.salarySlips?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Advances Deducted</TableHead>
                  <TableHead>Final Payable</TableHead>
                  <TableHead>Generated On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salaryData.salarySlips.map((slip, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{slip.month}</TableCell>
                    <TableCell>₹{slip.basicSalary?.toLocaleString()}</TableCell>
                    <TableCell>₹{slip.advancesDeducted?.toLocaleString()}</TableCell>
                    <TableCell className="font-bold text-green-600">
                      ₹{slip.finalPayable?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(slip.generatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleDownload(slip.month)}
                          disabled={isDownloading}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewSlip(slip.month)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No salary slips available
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Salary slips will appear here once they are generated by the administrator.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advance Payments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Advance Payments History
          </CardTitle>
          <CardDescription>
            Track your advance payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {salaryData?.advancePayments?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salaryData.advancePayments.map((advance, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(advance.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-bold text-orange-600">
                      ₹{advance.amount?.toLocaleString()}
                    </TableCell>
                    <TableCell>{advance.reason || "Advance Payment"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">No advance payments found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeSalary; 