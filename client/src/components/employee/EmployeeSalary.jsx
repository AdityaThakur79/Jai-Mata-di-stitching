import React, { useState, useEffect } from "react";
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
import { pdf } from '@react-pdf/renderer';
import SalarySlip from '../admin/content/Employee/SalarySlip';
import { PDFViewer } from '@react-pdf/renderer';

const EmployeeSalary = () => {
  const { employee } = useSelector((state) => state.auth);
  const { data: salaryData, isLoading } = useGetEmployeeSalarySlipsQuery();
  const [downloadSalarySlip, { isLoading: isDownloading }] = useDownloadEmployeeSalarySlipMutation();
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState(null);

  // Load logo on component mount
  useEffect(() => {
    const convertLogoToBase64 = async () => {
      try {
        const logoUrl = "/images/jmd_logo.jpeg";
        const response = await fetch(logoUrl, { cache: "no-store" });
        
        if (response.ok) {
          const blob = await response.blob();
          const reader = new FileReader();
          
          const dataUrl = await new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          
          setLogoDataUrl(dataUrl);
        }
      } catch (error) {
        console.warn('Error loading logo:', error);
      }
    };

    convertLogoToBase64();
  }, []);

  const handleDownload = async (slip) => {
    try {
      // Create the PDF blob using pre-loaded logo
      const blob = await pdf(SalarySlip({ 
        employee: employee, 
        salarySlip: slip,
        logoDataUrl: logoDataUrl
      })).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Salary_Slip_${employee?.name}_${slip.month}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Salary slip downloaded successfully");
    } catch (error) {
      console.error("Error downloading salary slip:", error);
      toast.error("Failed to download salary slip");
    }
  };

  const handleViewSlip = (slip) => {
    setSelectedSlip(slip);
    setShowPreview(true);
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

  // Filter only generated salary slips
  const generatedSlips = salaryData?.salarySlips || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Salary Slips</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and download your generated salary slips
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
            <CardTitle className="text-sm font-medium">Generated Slips</CardTitle>
            <FileText className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {generatedSlips.length}
            </div>
            <p className="text-xs text-gray-500">Available for download</p>
          </CardContent>
        </Card>
      </div>

      {/* Generated Salary Slips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generated Salary Slips
          </CardTitle>
          <CardDescription>
            View and download your generated salary slips
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generatedSlips.length > 0 ? (
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
                {generatedSlips.map((slip, index) => (
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
                          onClick={() => handleDownload(slip)}
                          disabled={isDownloading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewSlip(slip)}
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
                No salary slips generated yet
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

      {/* Salary Slip Preview Modal */}
      {showPreview && selectedSlip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Salary Slip Preview - {selectedSlip.month}</h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleDownload(selectedSlip)}
                  disabled={isDownloading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isDownloading ? "Downloading..." : "Download PDF"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPreview(false);
                    setSelectedSlip(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="h-[calc(95vh-80px)]">
              <PDFViewer width="100%" height="100%">
                <SalarySlip 
                  employee={employee} 
                  salarySlip={selectedSlip}
                  logoDataUrl={logoDataUrl}
                />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSalary; 