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

  // Data states
  const [employeeData, setEmployeeData] = useState(null);
  const [monthlyData, setMonthlyData] = useState({});

  // Get years for filter (current year + 10 years back)
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i <= 10; i++) {
      years.push(currentYear - i);
    }
    return years;
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
          processMonthlyData(result.employee);
        } catch (error) {
          console.error("Error fetching employee:", error);
          toast.error(error?.data?.message || "Failed to fetch employee data");
          navigate("/admin/employee-advance");
        }
      } else {
        console.error("No employeeId provided");
        toast.error("No employee ID provided");
        navigate("/admin/employee-advance");
      }
    };
    
    fetchEmployee();
  }, [employeeId, getEmployeeById, navigate]);

  // Process monthly data for the selected year
  const processMonthlyData = (employee) => {
    if (!employee) {
      console.error("No employee data provided to processMonthlyData");
      return;
    }

    const monthlyData = {};
    
    // Initialize all 12 months
    for (let i = 0; i < 12; i++) {
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
        salarySlipGenerated: false // New field to track if slip is generated
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

  // Filter monthly data based on current filters
  const getFilteredMonthlyData = () => {
    let filtered = Object.values(monthlyData);

    // Month filter
    if (selectedMonth !== "all") {
      filtered = filtered.filter(month => month.monthIndex === parseInt(selectedMonth));
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(month => 
        month.advances.some(advance => 
          advance.reason.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
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
    if (employeeData) {
      processMonthlyData(employeeData);
    }
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
      const monthName = `${monthlyData[monthKey]?.month} ${monthlyData[monthKey]?.year}`;
      const result = await generateSalarySlip({ 
        employeeId, 
        month: monthName 
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
      const monthName = emailForm.month;
      const result = await sendSalarySlipEmail({ 
        employeeId, 
        month: monthName,
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

  if (isLoadingEmployee) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
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
            onClick={() => navigate("/admin/employee-advance")}
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

  const filteredMonthlyData = getFilteredMonthlyData();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 rounded-2xl shadow-xl bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-orange-900/30 dark:via-gray-900 dark:to-blue-900/30 px-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-6">
            <Button
              onClick={() => navigate("/admin/employee-advance")}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-orange-400 text-white font-semibold shadow-lg rounded-full px-5 py-2 hover:from-blue-600 hover:to-orange-500 transition"
              size="lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Employees
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">
                Employee Details
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                Salary & Advance Management
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setAdvanceForm(prev => ({ ...prev, employeeId }));
              setShowAddDialog(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-blue-500 text-white font-semibold shadow-lg rounded-full px-6 py-3 hover:from-orange-500 hover:to-blue-600 transition"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            Add Advance
          </Button>
        </div>

        {/* Profile Header Card */}
        <Card className="mb-6 relative overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800 rounded-2xl bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-orange-900/30 dark:via-gray-900 dark:to-blue-900/30">
          <div className="absolute inset-0 z-0" />
          <CardHeader className="z-10 relative">
            <CardTitle className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white dark:border-gray-950 -mt-4">
                {safeEmployeeData.profileImage ? (
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={safeEmployeeData.profileImage} />
                    <AvatarFallback className="text-2xl">
                      {safeEmployeeData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  safeEmployeeData.name.split(' ').map(n => n[0]).join('')
                )}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{safeEmployeeData.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getRoleVariant(safeEmployeeData.role)} className="text-xs px-2 py-1">
                    {safeEmployeeData.role}
                  </Badge>
                  <Badge variant={getStatusVariant(safeEmployeeData.status)} className="text-xs px-2 py-1">
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
                    <span className="font-medium">{safeEmployeeData.designation}</span>
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
        <Card className="mb-6 relative overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800 rounded-2xl bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-orange-900/30 dark:via-gray-900 dark:to-blue-900/30">
          <div className="absolute inset-0 z-0" />
          <CardHeader className="z-10 relative">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
              <Filter className="w-5 h-5 text-orange-500" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="bg-white/80 dark:bg-gray-950/80 rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                    placeholder="Search advances..."
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

        {/* Monthly Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMonthlyData.map((month) => (
            <Card key={month.monthKey} className="relative overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800 rounded-2xl bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-orange-900/30 dark:via-gray-900 dark:to-blue-900/30 transition-transform hover:scale-[1.02] group">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{month.month}</CardTitle>
                    <CardDescription>{month.year}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    {month.salarySlip ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
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
                  <div className="space-y-2">
                    {!month.salarySlipGenerated && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
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
                        className="w-full"
                        disabled
                        title="Cannot add advance after salary slip is generated for this month"
                        style={{ opacity: 0.5 }}
                      >
                        Add Advance
                      </Button>
                    )}
                    {/* View Advances Button */}
                    {month.advanceCount > 0 && (
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full">
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
                                const blob = await downloadSalarySlip({ employeeId, month: `${month.month} ${month.year}` }).unwrap();
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
                        </>
                      ) : (
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-orange-400 to-blue-500 text-white font-semibold shadow-lg rounded-full px-6 py-3 hover:from-orange-500 hover:to-blue-600 transition"
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
              No data found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or select a different year.
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
              Send the salary slip for {emailForm.month} to the employee.
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
                value={emailForm.month}
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