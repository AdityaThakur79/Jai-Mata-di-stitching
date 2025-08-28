import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Loader2, 
  Plus, 
  Trash2, 
  Eye, 
  DollarSign, 
  FileText, 
  Calendar, 
  User, 
  Download, 
  Receipt, 
  Mail, 
  ArrowLeft,
  Search,
  Filter,
  QrCode,
  Phone,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetEmployeeByIdMutation,
  useGetFilteredEmployeeDetailsQuery,
  useAddEmployeeAdvanceMutation,
  useDeleteEmployeeAdvanceMutation,
  useGenerateSalarySlipMutation,
  useSendSalarySlipEmailMutation,
  useDownloadEmployeeSalarySlipMutation,
} from "@/features/api/employeeApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/Debounce";

const EmployeeDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const employeeId = location.state?.employeeId;

  // State management
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [slipFilter, setSlipFilter] = useState("all"); // all, generated, not-generated
  const [advanceFilter, setAdvanceFilter] = useState("all"); // all, with-advance, no-advance
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedMonth("all");
    setSearchQuery("");
    setSlipFilter("all");
    setAdvanceFilter("all");
    // Clear local monthly data and refetch from backend
    setMonthlyData({});
    refetchFiltered();
  };
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailForm, setEmailForm] = useState({
    email: "",
    month: "",
  });
  const [generatingSlipMonthKey, setGeneratingSlipMonthKey] = useState(null);

  // Form states
  const [advanceForm, setAdvanceForm] = useState({
    employeeId: "",
    amount: "",
    reason: "",
    date: new Date().toISOString().split('T')[0],
  });

  // API hooks
  const [getEmployeeById, { isLoading: isLoadingEmployee }] = useGetEmployeeByIdMutation();
  const [addAdvance, { isLoading: isAdding }] = useAddEmployeeAdvanceMutation();
  const [deleteAdvance, { isLoading: isDeleting }] = useDeleteEmployeeAdvanceMutation();
  const [generateSalarySlip, { isLoading: isGeneratingSlip }] = useGenerateSalarySlipMutation();
  const [sendSalarySlipEmail, { isLoading: isSendingEmail }] = useSendSalarySlipEmailMutation();
  const [downloadSalarySlip, { isLoading: isDownloadingSlip }] = useDownloadEmployeeSalarySlipMutation();

  // Create debounced search query for smooth filtering
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Backend filtered data hook - sends all filter parameters to backend for efficient filtering
  const { data: filteredData, isLoading: isLoadingFiltered, refetch: refetchFiltered } = useGetFilteredEmployeeDetailsQuery({
    employeeId,
    year: selectedYear,
    month: selectedMonth,
    search: debouncedSearchQuery,
    slipFilter,
    advanceFilter,
  }, {
    skip: !employeeId,
    refetchOnMountOrArgChange: true,
  });

  // Data states
  const [employeeData, setEmployeeData] = useState(null);
  const [monthlyData, setMonthlyData] = useState({});

  // Get years for filter (from joining year to current year)
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const joiningYear = employeeData ? new Date(employeeData.joiningDate).getFullYear() : currentYear;
    const years = [];
    
    // Start from joining year, go up to current year
    for (let year = joiningYear; year <= currentYear; year++) {
      years.push(year);
    }
    
    // Reverse to show most recent years first
    return years.reverse();
  };

  // Get months for filter
  const getMonthOptions = () => {
    return [
      { value: "all", label: "All Months" },
      { value: "0", label: "January" },
      { value: "1", label: "February" },
      { value: "2", label: "March" },
      { value: "3", label: "April" },
      { value: "4", label: "May" },
      { value: "5", label: "June" },
      { value: "6", label: "July" },
      { value: "7", label: "August" },
      { value: "8", label: "September" },
      { value: "9", label: "October" },
      { value: "10", label: "November" },
      { value: "11", label: "December" },
    ];
  };

  // Get month name by index
  const getMonthName = (monthIndex) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthIndex];
  };

  // Load employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      if (employeeId) {
        console.log("Fetching employee with ID:", employeeId);
        try {
          const result = await getEmployeeById(employeeId).unwrap();
          console.log("Employee data received:", result);
          
          if (!result.employee) {
            throw new Error("No employee data in response");
          }
          
          setEmployeeData(result.employee);
          
          // Set the selected year to the joining year if it's available
          const joiningYear = new Date(result.employee.joiningDate).getFullYear();
          setSelectedYear(joiningYear);
          
          processMonthlyData(result.employee);
        } catch (error) {
          console.error("Error fetching employee:", error);
          toast.error(error?.data?.message || "Failed to fetch employee data");
          navigate("/employee/employee-advance");
        }
      } else {
        console.error("No employeeId provided");
        toast.error("No employee ID provided");
        navigate("/employee/employee-advance");
      }
    };
    
    fetchEmployee();
  }, [employeeId, getEmployeeById, navigate]);

  // Effect to handle year changes and trigger backend refetch
  useEffect(() => {
    if (employeeId && selectedYear) {
      // Clear local monthly data when year changes
      setMonthlyData({});
      // Manually refetch backend data with the new year
      refetchFiltered();
    }
  }, [selectedYear, employeeId, refetchFiltered]);

  // Process monthly data for the selected year (used for initial load and fallback)
  const processMonthlyData = (employee) => {
    if (!employee) {
      console.error("No employee data provided to processMonthlyData");
      return;
    }

    const monthlyData = {};
    
    // Get joining month and year
    const joiningDate = new Date(employee.joiningDate);
    const joiningYear = joiningDate.getFullYear();
    const joiningMonth = joiningDate.getMonth();
    
    // Check if the selected year is before the joining year
    if (selectedYear < joiningYear) {
      // Employee wasn't working in this year, return empty data
      setMonthlyData({});
      return;
    }
    
    // Initialize months starting from joining month if it's the joining year
    let startMonth = 0;
    let endMonth = 11;
    
    if (selectedYear === joiningYear) {
      startMonth = joiningMonth;
    }
    
    for (let i = startMonth; i <= endMonth; i++) {
      const monthKey = `${selectedYear}-${String(i + 1).padStart(2, '0')}`;
      const monthName = getMonthName(i);
      
      monthlyData[monthKey] = {
        month: monthName,
        monthIndex: i,
        monthKey: monthKey,
        year: selectedYear,
        baseSalary: employee.baseSalary || 0,
        advances: [],
        totalAdvance: 0,
        remainingAmount: employee.baseSalary || 0,
        salarySlip: null,
        advanceCount: 0,
        salarySlipGenerated: false,
        isJoiningMonth: (selectedYear === joiningYear && i === joiningMonth)
      };
    }

    // Process advances (handle case where advancePayments might not exist)
    if (employee.advancePayments && Array.isArray(employee.advancePayments)) {
      employee.advancePayments.forEach(advance => {
        const advanceDate = new Date(advance.date);
        const advanceYear = advanceDate.getFullYear();
        const advanceMonth = advanceDate.getMonth();
        
        if (advanceYear === selectedYear) {
          const monthKey = `${advanceYear}-${String(advanceMonth + 1).padStart(2, '0')}`;
          if (monthlyData[monthKey]) {
            monthlyData[monthKey].advances.push(advance);
            monthlyData[monthKey].totalAdvance += advance.amount;
            monthlyData[monthKey].remainingAmount = employee.baseSalary - monthlyData[monthKey].totalAdvance;
            monthlyData[monthKey].advanceCount = monthlyData[monthKey].advances.length;
          }
        }
      });
    }

    // Process salary slips (handle case where salarySlips might not exist)
    if (employee.salarySlips && Array.isArray(employee.salarySlips)) {
      employee.salarySlips.forEach(slip => {
        const slipDate = new Date(slip.generatedAt);
        const slipYear = slipDate.getFullYear();
        const slipMonth = slipDate.getMonth();
        
        if (slipYear === selectedYear) {
          const monthKey = `${slipYear}-${String(slipMonth + 1).padStart(2, '0')}`;
          if (monthlyData[monthKey]) {
            monthlyData[monthKey].salarySlip = slip;
            monthlyData[monthKey].salarySlipGenerated = true; // Mark as generated
          }
        }
      });
    }

    setMonthlyData(monthlyData);
  };

  // Local filtering fallback (used when backend filtering is not available)
  const getFilteredMonthlyData = () => {
    let filtered = Object.values(monthlyData);

    // Month filter
    if (selectedMonth !== "all") {
      filtered = filtered.filter(month => month.monthIndex === parseInt(selectedMonth));
    }

    // Search filter - search in month name, advances reason, and employee details
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(month => {
        // Search in month name
        if (month.month.toLowerCase().includes(query)) return true;
        
        // Search in advances reason
        if (month.advances.some(advance => 
          advance.reason.toLowerCase().includes(query)
        )) return true;
        
        // Search in employee name and ID
        if (employeeData?.name?.toLowerCase().includes(query)) return true;
        if (employeeData?.employeeId?.toLowerCase().includes(query)) return true;
        
        return false;
      });
    }

    // Slip filter
    if (slipFilter === "generated") {
      filtered = filtered.filter(month => month.salarySlipGenerated);
    } else if (slipFilter === "not-generated") {
      filtered = filtered.filter(month => !month.salarySlipGenerated);
    }

    // Advance filter
    if (advanceFilter === "with-advance") {
      filtered = filtered.filter(month => month.advanceCount > 0);
    } else if (advanceFilter === "no-advance") {
      filtered = filtered.filter(month => month.advanceCount === 0);
    }

    return filtered.sort((a, b) => a.monthIndex - b.monthIndex);
  };

  // Handle year change
  const handleYearChange = (year) => {
    setSelectedYear(year);
    // Clear local monthly data when year changes to force backend filtering
    setMonthlyData({});
    // The backend will automatically refetch data for the new year
  };

  // Handle add advance
  const handleAddAdvance = async (e) => {
    e.preventDefault();
    if (!advanceForm.amount || !advanceForm.reason) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const result = await addAdvance(advanceForm).unwrap();
      toast.success(result.message || "Advance added successfully");
      setShowAddDialog(false);
      setAdvanceForm({
        employeeId: employeeId,
        amount: "",
        reason: "",
        date: new Date().toISOString().split('T')[0],
      });
      
      // Refresh employee data
      const updatedResult = await getEmployeeById(employeeId).unwrap();
      setEmployeeData(updatedResult.employee);
      processMonthlyData(updatedResult.employee);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add advance");
    }
  };

  // Handle delete advance
  const handleDeleteAdvance = async (advanceId) => {
    try {
      const result = await deleteAdvance({ employeeId, advanceId }).unwrap();
      toast.success(result.message || "Advance deleted successfully");
      
      // Refresh employee data
      const updatedResult = await getEmployeeById(employeeId).unwrap();
      setEmployeeData(updatedResult.employee);
      processMonthlyData(updatedResult.employee);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete advance");
    }
  };

  // Handle generate salary slip
  const handleGenerateSalarySlip = async (monthKey) => {
    if (monthlyData[monthKey]?.salarySlipGenerated) return; // Prevent duplicate generation
    setGeneratingSlipMonthKey(monthKey);
    try {
      // Extract month index and year from monthKey
      const monthData = monthlyData[monthKey];
      const monthIndex = monthData?.monthIndex; // 0-11
      const year = monthData?.year; // 2025, 2026, etc.
      
      const result = await generateSalarySlip({ 
        employeeId, 
        month: monthIndex, // Send month as number (0-11)
        year: year         // Send year as number
      }).unwrap();
      toast.success(result.message || "Salary slip generated successfully");
      
      // Refresh employee data
      const updatedResult = await getEmployeeById(employeeId).unwrap();
      setEmployeeData(updatedResult.employee);
      processMonthlyData(updatedResult.employee);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to generate salary slip");
    } finally {
      setGeneratingSlipMonthKey(null);
    }
  };

  // Handle send email
  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailForm.email || !emailForm.month) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // emailForm.month now contains the monthKey (e.g., "2025-08")
      const result = await sendSalarySlipEmail({ 
        employeeId, 
        month: emailForm.month, // Send monthKey directly
        email: emailForm.email
      }).unwrap();
      toast.success(result.message || "Salary slip sent successfully");
      setShowEmailDialog(false);
      setEmailForm({
        email: "",
        month: "",
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send email");
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    return status === "active" ? "default" : "secondary";
  };

  // Get role badge variant
  const getRoleVariant = (role) => {
    const variants = {
      "admin": "destructive",
      "manager": "default",
      "tailor": "secondary",
      "biller": "outline",
      "director": "destructive",
      "other": "secondary"
    };
    return variants[role] || "secondary";
  };

  if (isLoadingEmployee || isLoadingFiltered) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {isLoadingEmployee ? "Loading employee data..." : "Filtering data..."}
          </p>
        </div>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Employee not found</p>
          <Button 
            onClick={() => navigate("/employee/employee-advance")}
            className="mt-4"
          >
            Back to Employees
          </Button>
        </div>
      </div>
    );
  }

  // Ensure employeeData has required fields with fallbacks
  const safeEmployeeData = {
    name: employeeData.name || "Unknown",
    employeeId: employeeData.employeeId || "Unknown",
    role: employeeData.role || "Unknown",
    status: employeeData.status || "active",
    designation: employeeData.designation || "Not specified",
    joiningDate: employeeData.joiningDate || new Date(),
    baseSalary: employeeData.baseSalary || 0,
    mobile: employeeData.mobile || "Not provided",
    email: employeeData.email || "Not provided",
    address: employeeData.address || "Not provided",
    profileImage: employeeData.profileImage || "",
    bankDetails: employeeData.bankDetails || {},
    emergencyContact: employeeData.emergencyContact || {},
    ...employeeData
  };

  // Use backend filtered data if available, otherwise fall back to local filtering
  // When backend filtering is active, we should use that data directly
  const filteredMonthlyData = filteredData?.monthlyData || getFilteredMonthlyData();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 rounded-3xl shadow-2xl bg-gradient-to-br from-orange-100 via-white to-blue-100 dark:from-orange-900/40 dark:via-gray-900 dark:to-blue-900/40 px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden border border-orange-200/50 dark:border-orange-800/30">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-2xl"></div>
          
          <div className="flex items-center gap-6">
            {/* <Button
              onClick={() => navigate("/employee/employee-advance")}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold shadow-xl rounded-full px-6 py-3 hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-300 border-0"
              size="lg"
            >
              <ArrowLeft className="w-5 h-5 " />
          
            </Button> */}
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-orange-600 dark:text-orange-400 tracking-tight mb-2">
                Employee Details
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 font-semibold">
                Salary & Advance Management
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setAdvanceForm(prev => ({ ...prev, employeeId }));
              setShowAddDialog(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-xl rounded-2xl px-8 py-4 hover:from-orange-600 hover:to-orange-700 hover:scale-105 transition-all duration-300 border-0"
            size="lg"
          >
            <Plus className="w-6 h-6" />
            Add Advance
          </Button>
        </div>

        {/* Profile Header Card */}
        <Card className="mb-6 relative overflow-hidden shadow-2xl border border-orange-200/50 dark:border-orange-800/30 rounded-3xl bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-orange-900/40 dark:via-gray-900 dark:to-blue-900/40">
          {/* Decorative Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-200/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-full blur-2xl"></div>
          </div>
          
          <CardHeader className="z-10 relative">
            <CardTitle className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl border-4 border-white dark:border-gray-950 -mt-6 relative">
                {safeEmployeeData.profileImage ? (
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={safeEmployeeData.profileImage} />
                    <AvatarFallback className="text-3xl">
                      {safeEmployeeData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  safeEmployeeData.name.split(' ').map(n => n[0]).join('')
                )}
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400/30 to-blue-500/30 blur-xl"></div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{safeEmployeeData.name}</div>
                <div className="flex items-center gap-3">
                  <Badge variant={getRoleVariant(safeEmployeeData.role)} className="text-sm px-3 py-1.5 font-semibold shadow-lg">
                    {safeEmployeeData.role.toUpperCase()}
                  </Badge>
                  <Badge variant={getStatusVariant(safeEmployeeData.status)} className="text-sm px-3 py-1.5 font-semibold shadow-lg">
                    {safeEmployeeData.status}
                  </Badge>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="bg-white/80 dark:bg-gray-950/80 rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Basic Info */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Employee ID:</span>
                    <span className="font-medium">{safeEmployeeData.employeeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Designation:</span>
                    <span className="font-medium">{safeEmployeeData.role.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Joining Date:</span>
                    <span className="font-medium">{formatDate(safeEmployeeData.joiningDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Base Salary:</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {formatCurrency(safeEmployeeData.baseSalary)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Mobile:</span>
                    <span className="font-medium">{safeEmployeeData.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="font-medium">{safeEmployeeData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Address:</span>
                    <span className="font-medium">{safeEmployeeData.address}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Emergency Contact</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Name:</span>
                    <span className="font-medium">
                      {safeEmployeeData.emergencyContact?.name || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Mobile:</span>
                    <span className="font-medium">
                      {safeEmployeeData.emergencyContact?.mobile || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Bank Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Bank:</span>
                    <span className="font-medium">
                      {safeEmployeeData.bankDetails?.bankName || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Account:</span>
                    <span className="font-medium">
                      {safeEmployeeData.bankDetails?.accountNumber || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">IFSC:</span>
                    <span className="font-medium">
                      {safeEmployeeData.bankDetails?.ifsc || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters Panel */}
        <Card className="mb-6 relative overflow-hidden shadow-2xl border border-orange-200/50 dark:border-orange-800/30 rounded-3xl bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-orange-900/40 dark:via-gray-900 dark:to-blue-900/40">
          {/* Decorative Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-full blur-2xl"></div>
          </div>
          
          <CardHeader className="z-10 relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                    <Filter className="w-6 h-6 text-white" />
                  </div>
                  Filters & Search
                </CardTitle>
                {employeeData && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
                    Valid years: {new Date(employeeData.joiningDate).getFullYear()} - {new Date().getFullYear()}
                  </div>
                )}
              </div>
              <Button
                onClick={resetFilters}
                variant="outline"
                size="sm"
                className="bg-white/80 hover:bg-white text-orange-600 border-orange-300 hover:border-orange-400 font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
              >
                Reset Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="bg-white/90 dark:bg-gray-950/90 rounded-2xl shadow-lg p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
              {/* Year Filter */}
              <div>
                <Label>Year</Label>
                <Select value={selectedYear.toString()} onValueChange={(value) => handleYearChange(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getYearOptions().map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Month Filter */}
              <div>
                <Label>Month</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getMonthOptions().map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search */}
              <div>
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search month, advances, employee..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Slip Filter */}
              <div>
                <Label>Salary Slip</Label>
                <Select value={slipFilter} onValueChange={setSlipFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="all-slips" value="all">All Months</SelectItem>
                    <SelectItem key="generated-slips" value="generated">Slip Generated</SelectItem>
                    <SelectItem key="not-generated-slips" value="not-generated">No Slip</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Advance Filter */}
              <div>
                <Label>Advances</Label>
                <Select value={advanceFilter} onValueChange={setAdvanceFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="all-advances" value="all">All Months</SelectItem>
                    <SelectItem key="with-advances" value="with-advance">With Advances</SelectItem>
                    <SelectItem key="no-advances" value="no-advance">No Advances</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Summary */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-orange-600 dark:text-orange-400">{filteredMonthlyData.length}</span> month{filteredMonthlyData.length !== 1 ? 's' : ''} 
            {searchQuery && ` for "${searchQuery}"`}
            {slipFilter !== "all" && ` (${slipFilter === "generated" ? "Slip Generated" : "No Slip"})`}
            {advanceFilter !== "all" && ` (${advanceFilter === "with-advance" ? "With Advances" : "No Advances"})`}
            {isLoadingFiltered && (
              <span className="ml-2 text-orange-500">
                <Loader2 className="w-3 h-3 animate-spin inline mr-1" />
                Filtering...
              </span>
            )}
          </div>
          {filteredMonthlyData.length !== (filteredData?.monthlyData ? filteredData.monthlyData.length : Object.keys(monthlyData).length) && (
            <Button
              onClick={resetFilters}
              variant="ghost"
              size="sm"
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 w-full sm:w-auto"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Monthly Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredMonthlyData.map((month) => (
            <Card key={month.monthKey} className="relative overflow-hidden shadow-2xl border border-orange-200/50 dark:border-orange-800/30 rounded-3xl bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-orange-900/40 dark:via-gray-900 dark:to-blue-900/40 transition-all duration-300 hover:scale-[1.03] hover:shadow-3xl group">
              {/* Joining Month Indicator */}
              {month.isJoiningMonth && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-2 text-sm font-bold z-10">
                  🎉 Joining Month
                </div>
              )}
              
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-200/30 to-transparent rounded-bl-full"></div>
              
              <CardHeader className={month.isJoiningMonth ? "pt-12" : ""}>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{month.month}</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 font-medium">{month.year}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    {month.salarySlip ? (
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                    ) : (
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                        <XCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Main Content Area with semi-transparent white */}
                <div className="bg-white/80 dark:bg-gray-950/80 rounded-xl shadow p-4 space-y-2">
                  {/* Salary Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Base Salary:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {formatCurrency(month.baseSalary)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Advances:</span>
                      <span className="font-medium text-orange-500 dark:text-orange-400">
                        {formatCurrency(month.totalAdvance)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Final Payable:</span>
                      <span className={`${month.remainingAmount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(month.remainingAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Advance Count */}
                  <div className="text-center">
                    <Badge variant={month.advanceCount > 0 ? "default" : "secondary"}>
                      {month.advanceCount} Advance{month.advanceCount !== 1 ? 's' : ''}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {!month.salarySlipGenerated && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border-blue-300 hover:border-blue-400 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                        onClick={() => {
                          setAdvanceForm(prev => ({ ...prev, employeeId, date: `${selectedYear}-${String(month.monthIndex + 1).padStart(2, '0')}-01` }));
                          setShowAddDialog(true);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Advance
                      </Button>
                    )}
                    {month.salarySlipGenerated && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 font-medium rounded-xl cursor-not-allowed"
                        disabled
                        title="Cannot add advance after salary slip is generated for this month"
                      >
                        Add Advance
                      </Button>
                    )}
                    {/* View Advances Button */}
                    {month.advanceCount > 0 && (
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 border-orange-300 hover:border-orange-400 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                            <Eye className="w-4 h-4 mr-2" />
                            View Advances ({month.advanceCount})
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>{month.month} {month.year} - Advances</SheetTitle>
                            <SheetDescription>
                              {employeeData.name} ({employeeData.employeeId})
                            </SheetDescription>
                          </SheetHeader>
                          <div className="mt-6 space-y-4">
                            {month.advances.map((advance, index) => (
                              <Card key={index}>
                                <CardContent className="pt-4">
                                  <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                      <div className="font-medium text-orange-500 dark:text-orange-400">
                                        {formatCurrency(advance.amount)}
                                      </div>
                                      <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {advance.reason}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {formatDate(advance.date)}
                                      </div>
                                    </div>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button size="sm" variant="destructive">
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Advance</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete this advance payment of {formatCurrency(advance.amount)}?
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteAdvance(advance._id)}
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </SheetContent>
                      </Sheet>
                    )}
                    {/* Salary Slip Actions */}
                    <div className="space-y-2">
                      {month.salarySlip ? (
                        <>
                          <Button size="sm" className="w-full" disabled>
                            <CheckCircle className="w-5 h-4 mr-2 text-green-500" />
                            Slip Generated
                          </Button>
                          <Button
                            size="sm"
                            className="w-full mt-2 flex items-center justify-center"
                            variant="outline"
                            onClick={async () => {
                              try {
                                const blob = await downloadSalarySlip({ employeeId, month: month.monthKey }).unwrap();
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', `SalarySlip-${month.month}-${month.year}.pdf`);
                                document.body.appendChild(link);
                                link.click();
                                link.parentNode.removeChild(link);
                              } catch (error) {
                                toast.error("Failed to download slip");
                              }
                            }}
                            disabled={isDownloadingSlip}
                          >
                            {isDownloadingSlip ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4 mr-2" />
                            )}
                            Download Slip
                          </Button>
                          
                          {/* Send Email Button */}
                          <Button
                            size="sm"
                            className="w-full mt-2 flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl px-4 py-3 hover:from-green-600 hover:to-green-700 hover:scale-105 transition-all duration-300 border-0"
                            onClick={() => {
                              setEmailForm({
                                email: employeeData?.email || "",
                                month: month.monthKey,
                              });
                              setShowEmailDialog(true);
                            }}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-xl rounded-xl px-4 py-3 hover:from-orange-600 hover:to-orange-700 hover:scale-105 transition-all duration-300 border-0"
                          onClick={() => handleGenerateSalarySlip(month.monthKey)}
                          disabled={generatingSlipMonthKey === month.monthKey}
                        >
                          {generatingSlipMonthKey === month.monthKey ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <FileText className="w-4 h-4 mr-2" />
                          )}
                          Generate Salary Slip
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredMonthlyData.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {selectedYear < (employeeData ? new Date(employeeData.joiningDate).getFullYear() : selectedYear) 
                ? "Employee not yet joined" 
                : "No data found"}
            </h3>
            <p className="text-gray-500">
              {selectedYear < (employeeData ? new Date(employeeData.joiningDate).getFullYear() : selectedYear)
                ? `${employeeData?.name} joined in ${new Date(employeeData?.joiningDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}. Select ${new Date(employeeData?.joiningDate).getFullYear()} or later to view data.`
                : "Try adjusting your filters or select a different year."}
            </p>
          </div>
        )}
      </div>

      {/* Add Advance Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Employee Advance</DialogTitle>
            <DialogDescription>
              Add a new advance payment for {employeeData?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAdvance} className="space-y-4">
            <div>
              <Label>Amount (₹) *</Label>
              <Input
                type="number"
                value={advanceForm.amount}
                onChange={(e) => setAdvanceForm(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Enter amount"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <Label>Reason *</Label>
              <Input
                value={advanceForm.reason}
                onChange={(e) => setAdvanceForm(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Enter reason for advance"
              />
            </div>

            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={advanceForm.date}
                onChange={(e) => setAdvanceForm(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isAdding}>
                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Advance"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Send Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Salary Slip via Email</DialogTitle>
            <DialogDescription>
              Send the salary slip for {emailForm.month ? `${getMonthName(parseInt(emailForm.month.split('-')[1]) - 1)} ${emailForm.month.split('-')[0]}` : ''} to the employee.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div>
              <Label>Email Address *</Label>
              <Input
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>

            <div>
              <Label>Month</Label>
              <Input
                value={emailForm.month ? `${getMonthName(parseInt(emailForm.month.split('-')[1]) - 1)} ${emailForm.month.split('-')[0]}` : ''}
                disabled
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEmailDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSendingEmail}>
                {isSendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Email"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeDetail; 