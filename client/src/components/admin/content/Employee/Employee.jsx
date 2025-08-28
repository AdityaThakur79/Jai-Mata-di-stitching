import React, { useEffect, useState, useMemo } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { GrPowerCycle } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetAllEmployeesQuery,
  useDeleteEmployeeMutation,
  useGetEmployeeByIdMutation,
} from "@/features/api/employeeApi";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, EyeIcon, DollarSign, ExternalLink, FileText, Download, Plus } from "lucide-react";
import { useDebounce } from "@/hooks/Debounce";
import { Drawer } from "antd";
import EmployeeIdCard from "./EmployeeIdCard";
import EmployeeIdCardPreview from "./EmployeeIdCardPreview";
import { PDFDownloadLink } from "@react-pdf/renderer";
import axios from "axios";

const Employee = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data, isLoading, refetch } = useGetAllEmployeesQuery({
    page: currentPage,
    limit,
    search: debouncedSearchQuery,
    status: statusFilter === "all" ? "" : statusFilter,
  });

  const [deleteEmployee, { isSuccess, isError }] = useDeleteEmployeeMutation();

  // Drawer for viewing employee details
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [getEmployeeById, { isLoading: getEmployeeLoading }] =
    useGetEmployeeByIdMutation();

  // Preview modal state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewEmployee, setPreviewEmployee] = useState(null);

  const handleViewEmployee = async (employeeId) => {
    setDrawerOpen(true);
    setSelectedEmployee(null);
    try {
      const { data } = await getEmployeeById(employeeId);
      if (data?.success) {
        setSelectedEmployee(data?.employee);
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  const handlePreviewIdCard = (employee) => {
    setPreviewEmployee(employee);
    setPreviewOpen(true);
    setDrawerOpen(false); // Close drawer when opening preview
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewEmployee(null);
  };

  // Memoize the PDF document to prevent unnecessary re-renders
  const pdfDocument = useMemo(() => {
    if (!selectedEmployee) return null;
    return <EmployeeIdCard employee={selectedEmployee} />;
  }, [selectedEmployee]);



  // Create a function that returns the document for PDFDownloadLink
  const createPdfDocument = () => {
    if (!selectedEmployee) return null;
    
    // Create logo data URL (you can replace this with your actual logo)
    const logoDataUrl = "data:image/svg+xml;base64," + btoa(`
      <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" fill="#FF6B35" rx="60"/>
        <text x="60" y="75" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">JMD</text>
      </svg>
    `);
    
    // Profile image conversion is handled in the preview component
    
    // Create barcode data URL (placeholder)
    // const barcodeDataUrl = "data:image/svg+xml;base64," + btoa(`
    //   <svg width="300" height="80" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
    //     <rect width="300" height="80" fill="white"/>
    //     <rect x="10" y="10" width="8" height="60" fill="black"/>
    //     <rect x="25" y="10" width="2" height="60" fill="black"/>
    //     <rect x="30" y="10" width="6" height="60" fill="black"/>
    //     <rect x="40" y="10" width="2" height="60" fill="black"/>
    //     <rect x="45" y="10" width="4" height="60" fill="black"/>
    //     <rect x="55" y="10" width="8" height="60" fill="black"/>
    //     <rect x="70" y="10" width="2" height="60" fill="black"/>
    //     <rect x="75" y="10" width="6" height="60" fill="black"/>
    //     <rect x="85" y="10" width="2" height="60" fill="black"/>
    //     <rect x="90" y="10" width="4" height="60" fill="black"/>
    //     <rect x="100" y="10" width="8" height="60" fill="black"/>
    //     <rect x="115" y="10" width="2" height="60" fill="black"/>
    //     <rect x="120" y="10" width="6" height="60" fill="black"/>
    //     <rect x="130" y="10" width="2" height="60" fill="black"/>
    //     <rect x="135" y="10" width="4" height="60" fill="black"/>
    //     <rect x="145" y="10" width="8" height="60" fill="black"/>
    //     <rect x="160" y="10" width="2" height="60" fill="black"/>
    //     <rect x="165" y="10" width="6" height="60" fill="black"/>
    //     <rect x="175" y="10" width="2" height="60" fill="black"/>
    //     <rect x="180" y="10" width="4" height="60" fill="black"/>
    //     <rect x="190" y="10" width="8" height="60" fill="black"/>
    //     <rect x="205" y="10" width="2" height="60" fill="black"/>
    //     <rect x="210" y="10" width="6" height="60" fill="black"/>
    //     <rect x="220" y="10" width="2" height="60" fill="black"/>
    //     <rect x="225" y="10" width="4" height="60" fill="black"/>
    //     <rect x="235" y="10" width="8" height="60" fill="black"/>
    //     <rect x="250" y="10" width="2" height="60" fill="black"/>
    //     <rect x="255" y="10" width="6" height="60" fill="black"/>
    //     <rect x="265" y="10" width="2" height="60" fill="black"/>
    //     <rect x="270" y="10" width="4" height="60" fill="black"/>
    //     <rect x="280" y="10" width="8" height="60" fill="black"/>
    //     <rect x="295" y="10" width="2" height="60" fill="black"/>
    //   </svg>
    // `);
    
    return (
      <EmployeeIdCard 
        employee={selectedEmployee} 
        logoDataUrl={logoDataUrl}
        // barcodeDataUrl={barcodeDataUrl}
      />
    );
  };

  const handleDelete = async (employeeId) => {
    await deleteEmployee(employeeId);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (data?.totalPage || 1)) {
      setCurrentPage(newPage);
    }
  };

  const handleLimitChange = (value) => {
    setLimit(Number(value));
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const totalPages = data?.totalPage || 1;
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    let end = Math.min(start + 4, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Employee Deleted Successfully");
      refetch();
    } else if (isError) {
      toast.error("Failed to delete employee");
    }
  }, [isSuccess, isError]);

  const renderEmployeeDetails = (emp) => {
    if (!emp) return null;

    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case "active":
          return "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700";
        case "inactive":
          return "text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700";
        default:
          return "text-gray-600 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700";
      }
    };

    return (
      <div className="space-y-8 md:px-6 md:py-6 px-4">
        {/* Enhanced Header Section */}
        <div className="relative dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-xl border border-orange-100 dark:border-gray-700 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-300 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-200 rounded-full translate-y-24 -translate-x-24"></div>
          </div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Profile Image */}
              <div className="relative">
                {emp.profileImage ? (
                  <img
                    src={emp.profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-2xl"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-orange-200 to-orange-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center border-4 border-white shadow-2xl">
                    <svg
                      className="w-16 h-16 text-orange-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Employee Info */}
              <div className="flex-1">
                <div className="flex flex-col items-center justify-center lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {emp.name}
                    </h1>
                    <div className="flex items-center gap-3 mb-2">
                      <svg
                        className="w-5 h-5 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-lg text-gray-600 dark:text-gray-300 capitalize">
                        {emp.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        #
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Employee ID: {emp.employeeId}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div
                      className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                        emp.status
                      )}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-current rounded-full"></div>
                        {emp.status || "Unknown"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Joined{" "}
                      {emp.joiningDate
                        ? new Date(emp.joiningDate).toLocaleDateString()
                        : "—"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Details Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { icon: "phone", label: "Mobile", value: emp.mobile },
                { icon: "email", label: "Email", value: emp.email },
                { icon: "user", label: "Gender", value: emp.gender },
                { icon: "location", label: "Address", value: emp.address },
                {
                  icon: "card",
                  label: "Aadhaar Number",
                  value: emp.aadhaarNumber,
                },
                {
                  icon: "calendar",
                  label: "Date of Birth",
                  value: emp.dob
                    ? new Date(emp.dob).toLocaleDateString()
                    : null,
                },
                {
                  icon: "droplet",
                  label: "Blood Group",
                  value: emp.bloodGroup,
                },
                { icon: "star", label: "Grade", value: emp.grade },
                {
                  icon: "dollar",
                  label: "Base Salary",
                  value: emp.baseSalary ? `₹${emp.baseSalary}` : null,
                },
                {
                  icon: "calendar-check",
                  label: "Validity Date",
                  value: emp.validityDate
                    ? new Date(emp.validityDate).toLocaleDateString()
                    : null,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center mt-1">
                    {item.icon === "phone" && (
                      <svg
                        className="w-4 h-4 text-gray-600 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    )}
                    {item.icon === "email" && (
                      <svg
                        className="w-4 h-4 text-gray-600 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                    {item.icon === "user" && (
                      <svg
                        className="w-4 h-4 text-gray-600 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    )}
                    {item.icon === "location" && (
                      <svg
                        className="w-4 h-4 text-gray-600 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                    {item.icon === "card" && (
                      <svg
                        className="w-4 h-4 text-gray-600 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    )}
                    {item.icon === "calendar" && (
                      <svg
                        className="w-4 h-4 text-gray-600 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                    {item.icon === "droplet" && (
                      <svg
                        className="w-4 h-4 text-gray-600 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                    )}
                    {item.icon === "star" && (
                      <svg
                        className="w-4 h-4 text-gray-600 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    )}
                    {item.icon === "dollar" && (
                      <svg
                        className="w-4 h-4 text-gray-600 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    )}
                    {item.icon === "calendar-check" && (
                      <svg
                        className="w-4 h-4 text-gray-600 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      {item.label}
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white break-words">
                      {item.value || <span className="text-gray-400">—</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-orange-600 dark:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Professional Details
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-orange-600 dark:text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  <div>
                    <div className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                      Current Role
                    </div>
                    <div className="text-lg font-bold text-orange-900 dark:text-orange-100 capitalize">
                      {emp.role}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Join Date
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {emp.joiningDate
                        ? new Date(emp.joiningDate).toLocaleDateString()
                        : "—"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {emp.status || "—"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bank Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Bank Details
            </h2>
          </div>

          {emp.bankDetails ? (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-3 mb-2">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <div className="text-xs font-semibold text-green-700 dark:text-green-300 uppercase tracking-wider">
                    Bank Name
                  </div>
                </div>
                <div className="text-sm font-medium text-green-900 dark:text-green-100">
                  {emp.bankDetails.bankName || (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-3 mb-2">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <div className="text-xs font-semibold text-green-700 dark:text-green-300 uppercase tracking-wider">
                    Account Number
                  </div>
                </div>
                <div className="text-sm font-medium text-green-900 dark:text-green-100">
                  {emp.bankDetails.accountNumber || (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    #
                  </span>
                  <div className="text-xs font-semibold text-green-700 dark:text-green-300 uppercase tracking-wider">
                    IFSC Code
                  </div>
                </div>
                <div className="text-sm font-medium text-green-900 dark:text-green-100">
                  {emp.bankDetails.ifsc || (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <span className="text-gray-400">No bank details available</span>
            </div>
          )}
        </div>

        {/* Aadhaar Card Image */}
        {emp.aadhaarImage && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Aadhaar Card Image
              </h2>
            </div>
            <div className="flex justify-center">
              <img
                src={emp.aadhaarImage}
                alt="Aadhaar Card"
                className="max-w-full h-auto rounded-lg border-2 border-purple-200 dark:border-purple-700 shadow-lg"
                style={{ maxHeight: "300px" }}
              />
            </div>
          </div>
        )}

        {/* Enhanced Emergency Contact */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Emergency Contact
            </h2>
          </div>

          {emp.emergencyContact ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
                <div className="flex items-center gap-3 mb-2">
                  <svg
                    className="w-5 h-5 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <div className="text-xs font-semibold text-red-700 dark:text-red-300 uppercase tracking-wider">
                    Name
                  </div>
                </div>
                <div className="text-sm font-medium text-red-900 dark:text-red-100">
                  {emp.emergencyContact.name || (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
                <div className="flex items-center gap-3 mb-2">
                  <svg
                    className="w-5 h-5 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div className="text-xs font-semibold text-red-700 dark:text-red-300 uppercase tracking-wider">
                    Mobile
                  </div>
                </div>
                <div className="text-sm font-medium text-red-900 dark:text-red-100">
                  {emp.emergencyContact.mobile || (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <span className="text-gray-400">
                No emergency contact available
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="  dark:bg-gray-900 min-h-[100vh] rounded-md">
      <div className="md:p-6 p-2">
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
          <h2 className="md:text-xl font-semibold text-gray-700 text-center dark:text-white">
            All Employees
          </h2>

          <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="text"
              placeholder="Search by name, mobile, email, role"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm w-full sm:w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder:text-gray-500"
            />
            <div className="flex">
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={limit.toString()}
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex md:gap-4 gap-2 justify-center items-center">
              <Button 
                onClick={() => navigate("/employee/create-employee")}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Employee
              </Button>
              
              <Button
                onClick={() => navigate("/employee/employee-advance")}
                variant="outline"
                className="flex items-center gap-2 bg-white hover:bg-orange-50 text-orange-600 hover:text-orange-700 border-2 border-orange-500 hover:border-orange-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <DollarSign className="w-5 h-5" />
                Manage Advances
              </Button>
              
              <Button 
                className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0" 
                onClick={() => refetch()}
              >
                <GrPowerCycle className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-900 text-left">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center">
                    <Loader2 className="mx-auto animate-spin" />
                  </td>
                </tr>
              ) : data?.employees?.length > 0 ? (
                data?.employees?.map((employee, i) => (
                  <tr key={employee._id} className="text-left">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {(currentPage - 1) * limit + i + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.profileImage ? (
                        <img
                          src={employee.profileImage}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="inline-block w-10 h-10 rounded-full bg-gray-200" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {employee.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {employee.mobile}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {employee.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {employee.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <span
                        className={
                          employee.status?.toLowerCase() === "active"
                            ? "inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-300"
                            : employee.status?.toLowerCase() === "inactive"
                            ? "inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold border border-red-300"
                            : "inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-300"
                        }
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap flex  items-center justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          navigate("/employee/employee-detail", {
                            state: { employeeId: employee.employeeId },
                          })
                        }
                        aria-label="View Details"
                      >
                        <ExternalLink className="w-5 h-5 text-blue-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleViewEmployee(employee.employeeId)}
                      >
                        <EyeIcon className="w-5 h-5 text-orange-500" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          navigate("/employee/update-employee", {
                            state: { employeeId: employee.employeeId },
                          })
                        }
                      >
                        <MdOutlineEdit className="w-5 h-5 text-blue-600" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <FaRegTrashCan className="w-5 h-5 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the employee.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(employee.employeeId)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-10 text-center text-gray-500 dark:text-white"
                  >
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
            <thead className="bg-gray-50 dark:bg-gray-900 text-left">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {getPageNumbers().map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    isActive={pageNum === currentPage}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={
                    currentPage === (data?.totalPage || 1)
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      {/* Drawer for employee details */}
      <Drawer
        title={
          <span className="font-bold text-orange-600">Employee Details</span>
        }
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={800}
        footer={
          selectedEmployee && (
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => handlePreviewIdCard(selectedEmployee)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2 shadow"
              >
                Preview ID Card
              </Button>
              
              {pdfDocument && (
                <PDFDownloadLink
                  document={createPdfDocument()}
                  fileName={`JMD-Employee-ID-${selectedEmployee.employeeId}.pdf`}
                  className="inline-block"
                >
                  {({ loading, error }) => (
                    <Button
                      disabled={loading}
                      className="bg-[#f77f2f] hover:bg-[#ff943f] text-white font-semibold rounded-lg px-6 py-2 shadow"
                      onClick={() => {
                        console.log("Download button clicked");
                        if (error) {
                          console.error("PDF generation error:", error);
                          toast.error("Failed to generate PDF");
                        }
                      }}
                    >
                      {loading ? "Generating..." : error ? "Error - Retry" : "Download ID Card"}
                    </Button>
                  )}
                </PDFDownloadLink>
              )}
            </div>
          )
        }
      >
        {getEmployeeLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : (
          <>
            {renderEmployeeDetails(selectedEmployee)}
          </>
        )}
      </Drawer>

      {/* Preview Modal */}
      {previewOpen && (
        <EmployeeIdCardPreview
          employee={previewEmployee}
          onClose={handleClosePreview}
        />
      )}
    </section>
  );
};

export default Employee;
