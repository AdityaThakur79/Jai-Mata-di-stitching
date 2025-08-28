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
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, Trash2, Eye, DollarSign, FileText, Calendar, User, Download, Receipt, Search } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetAllEmployeesQuery,
  useAddEmployeeAdvanceMutation,
  useGetEmployeeAdvancesMutation,
  useGetAllEmployeeAdvancesQuery,
  useDeleteEmployeeAdvanceMutation,
  useGenerateSalarySlipMutation,
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const EmployeeAdvance = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showSalarySlipDialog, setShowSalarySlipDialog] = useState(false);
  const [advanceForm, setAdvanceForm] = useState({
    employeeId: "",
    amount: "",
    reason: "",
    date: new Date().toISOString().split('T')[0],
  });
  const [salarySlipForm, setSalarySlipForm] = useState({
    employeeId: "",
    month: "",
  });

  // API hooks
  const { data: employeesData, isLoading: employeesLoading } = useGetAllEmployeesQuery({
    page: 1,
    limit: 1000,
    search: "",
  });

  const { data: advancesData, isLoading: advancesLoading, refetch: refetchAdvances } = useGetAllEmployeeAdvancesQuery({
    page: currentPage,
    limit,
    search: searchQuery,
  });

  const [addAdvance, { isLoading: isAdding }] = useAddEmployeeAdvanceMutation();
  const [getEmployeeAdvances, { isLoading: isLoadingEmployeeAdvances }] = useGetEmployeeAdvancesMutation();
  const [deleteAdvance, { isLoading: isDeleting }] = useDeleteEmployeeAdvanceMutation();
  const [generateSalarySlip, { isLoading: isGeneratingSlip }] = useGenerateSalarySlipMutation();

  const [employeeAdvances, setEmployeeAdvances] = useState(null);

  // Get current month name
  const getCurrentMonth = () => {
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Get last 6 months for salary slip generation
  const getLast6Months = () => {
    const months = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }));
    }
    return months;
  };

  const handleAddAdvance = async (e) => {
    e.preventDefault();
    if (!advanceForm.employeeId || !advanceForm.amount || !advanceForm.reason) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const result = await addAdvance(advanceForm).unwrap();
      toast.success(result.message || "Advance added successfully");
      setShowAddDialog(false);
      setAdvanceForm({
        employeeId: "",
        amount: "",
        reason: "",
        date: new Date().toISOString().split('T')[0],
      });
      refetchAdvances();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add advance");
    }
  };

  const handleViewAdvances = async (employeeId) => {
    try {
      const result = await getEmployeeAdvances(employeeId).unwrap();
      setEmployeeAdvances(result.data);
      setShowViewDialog(true);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to fetch advances");
    }
  };

  const handleDeleteAdvance = async (employeeId, advanceId) => {
    try {
      const result = await deleteAdvance({ employeeId, advanceId }).unwrap();
      toast.success(result.message || "Advance deleted successfully");
      refetchAdvances();
      if (showViewDialog) {
        handleViewAdvances(employeeId);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete advance");
    }
  };

  const handleGenerateSalarySlip = async (e) => {
    e.preventDefault();
    if (!salarySlipForm.employeeId || !salarySlipForm.month) {
      toast.error("Please select employee and month");
      return;
    }

    try {
      const result = await generateSalarySlip(salarySlipForm).unwrap();
      toast.success(result.message || "Salary slip generated successfully");
      setShowSalarySlipDialog(false);
      setSalarySlipForm({
        employeeId: "",
        month: "",
      });
      refetchAdvances();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to generate salary slip");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (advancesData?.pagination?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  const getPageNumbers = () => {
    const totalPages = advancesData?.pagination?.totalPages || 1;
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    let end = Math.min(start + 4, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-orange-900/20 min-h-[100vh] rounded-md pt-8 md:pt-12">
      <div className="md:p-6 p-2">
        {/* Enhanced Header */}
        <div className="mb-8 rounded-3xl shadow-2xl bg-gradient-to-br from-orange-100 via-white to-blue-100 dark:from-orange-900/40 dark:via-gray-900 dark:to-blue-900/40 px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden border border-orange-200/50 dark:border-orange-800/30">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-2xl"></div>
          
          <div className="flex items-center gap-6">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-orange-600 dark:text-orange-400 tracking-tight mb-2">
                Employee Salary & Advance Management
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 font-semibold">
                Manage employee advances, salary slips, and financial records
              </p>
            </div>
          </div>
          <div className="flex gap-3">
                          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-xl rounded-2xl px-6 py-3 hover:from-orange-600 hover:to-orange-700 hover:scale-105 transition-all duration-300 border-0">
                    <Plus className="w-5 h-5" />
                    Add Advance
                  </Button>
                </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Employee Advance</DialogTitle>
                  <DialogDescription>
                    Add a new advance payment for an employee.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddAdvance} className="space-y-4">
                  <div>
                    <Label>Employee *</Label>
                    <Select
                      value={advanceForm.employeeId}
                      onValueChange={(value) => setAdvanceForm(prev => ({ ...prev, employeeId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employeesData?.employees?.map((employee) => (
                          <SelectItem key={employee.employeeId} value={employee.employeeId}>
                            {employee.name} - {employee.employeeId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

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

            <Dialog open={showSalarySlipDialog} onOpenChange={setShowSalarySlipDialog}>
            
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Generate Salary Slip</DialogTitle>
                  <DialogDescription>
                    Generate salary slip for an employee for a specific month.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleGenerateSalarySlip} className="space-y-4">
                  <div>
                    <Label>Employee *</Label>
                    <Select
                      value={salarySlipForm.employeeId}
                      onValueChange={(value) => setSalarySlipForm(prev => ({ ...prev, employeeId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employeesData?.employees?.map((employee) => (
                          <SelectItem key={employee.employeeId} value={employee.employeeId}>
                            {employee.name} - {employee.employeeId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Month *</Label>
                    <Select
                      value={salarySlipForm.month}
                      onValueChange={(value) => setSalarySlipForm(prev => ({ ...prev, month: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {getLast6Months().map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowSalarySlipDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isGeneratingSlip}>
                      {isGeneratingSlip ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Slip"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="mb-6 relative overflow-hidden shadow-2xl border border-orange-200/50 dark:border-orange-800/30 rounded-3xl bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-orange-900/40 dark:via-gray-900 dark:to-blue-900/40">
          {/* Decorative Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-full blur-2xl"></div>
          </div>
          
          <CardHeader className="z-10 relative">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <Search className="w-6 h-6 text-white" />
              </div>
              Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="bg-white/90 dark:bg-gray-950/90 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Search Employees</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, ID, or designation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-3 items-end">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Items per page</Label>
                  <Select
                    value={limit.toString()}
                    onValueChange={(value) => setLimit(parseInt(value))}
                  >
                    <SelectTrigger className="w-[100px] border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl transition-colors">
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
                <Button 
                  onClick={() => refetchAdvances()}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg rounded-xl px-4 py-2 hover:from-blue-600 hover:to-blue-700 hover:scale-105 transition-all duration-300 border-0"
                >
                  <Loader2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advancesLoading ? (
            <div className="col-span-full flex justify-center py-10">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-orange-500 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading employee data...</p>
              </div>
            </div>
          ) : advancesData?.data?.length > 0 ? (
            advancesData.data.map((item, index) => (
              <Card key={index} className="relative overflow-hidden shadow-2xl border border-orange-200/50 dark:border-orange-800/30 rounded-3xl bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-orange-900/40 dark:via-gray-900 dark:to-blue-900/40 transition-all duration-300 hover:scale-[1.03] hover:shadow-3xl group">
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-200/30 to-transparent rounded-bl-full"></div>
                
                {/* Profile Image/Avatar */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 ">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl border-4 border-white dark:border-gray-950 relative overflow-hidden">
                    {item.employee.profileImage ? (
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={item.employee.profileImage} />
                        <AvatarFallback className="text-2xl bg-gradient-to-br from-orange-500 to-blue-600 text-white">
                          {item.employee.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                        {item.employee.name?.split(' ').map(n => n[0]).join('').toUpperCase() || <User className="w-10 h-10" />}
                      </div>
                    )}
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400/30 to-blue-500/30 blur-xl"></div>
                  </div>
                </div>
                <div className="pt-32 pb-4 flex flex-col items-center">
                  <CardTitle className="flex flex-col items-center gap-2 text-xl font-bold text-gray-800 dark:text-white">
                    {item.employee.name}
                    <span className="text-sm text-orange-600 dark:text-orange-400 font-semibold bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
                      {item.employee.employeeId}
                    </span>
                  </CardTitle>
                  <CardDescription className="mt-2 text-base text-gray-600 dark:text-gray-300 font-medium">
                    {item.employee.designation || 'Employee'}
                  </CardDescription>
                </div>
                <CardContent className="space-y-4">
                  {/* Main Content Area with semi-transparent white */}
                  <div className="bg-white/80 dark:bg-gray-950/80 rounded-xl shadow p-4">
                    {/* Current Month Summary */}
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {getCurrentMonth()} Summary
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-base">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Base Salary</span>
                        <div className="font-semibold text-blue-600 dark:text-blue-400 text-lg">
                          {formatCurrency(item.employee.baseSalary)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Advances</span>
                        <div className="font-semibold text-orange-500 dark:text-orange-400 text-lg">
                          {formatCurrency(item.currentMonth.totalAdvance)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                        <div className={`font-semibold text-lg ${item.currentMonth.remainingAmount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}> 
                          {formatCurrency(item.currentMonth.remainingAmount)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Advance Count</span>
                        <div className="font-semibold">{item.currentMonth.advanceCount}</div>
                      </div>
                    </div>
                  </div>
                  {/* Monthly History */}
                  <div className="bg-white/60 dark:bg-gray-900/60 rounded-xl shadow p-3">
                    <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-200">Last 3 Months</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {item.monthlyData.slice(0, 3).map((month, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm p-2 bg-gradient-to-r from-orange-100 via-white to-blue-100 dark:from-orange-900/30 dark:via-gray-900 dark:to-blue-900/30 rounded-lg">
                          <span className="font-medium text-gray-700 dark:text-gray-200">{month.month}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-orange-500 dark:text-orange-400 font-semibold">
                              {formatCurrency(month.totalAdvance)}
                            </span>
                            {month.salarySlip && (
                              <Badge variant="secondary" className="text-xs">Slip</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate("/employee/employee-detail", { 
                        state: { employeeId: item.employee.employeeId } 
                      })}
                      className="flex-1 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border-blue-300 hover:border-blue-400 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setAdvanceForm(prev => ({ ...prev, employeeId: item.employee.employeeId }));
                        setShowAddDialog(true);
                      }}
                      className="flex-1 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 border-orange-300 hover:border-orange-400 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Advance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No employees found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria or add new employees</p>
            </div>
          )}
        </div>

        {/* Generated Salary Slips Section */}
        {/* This section has been removed for a cleaner UI */}

        {/* Pagination */}
        {advancesData?.pagination?.totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {getPageNumbers().map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage >= advancesData.pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* View Employee Details Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Employee Salary & Advance Details</DialogTitle>
            <DialogDescription>
              View detailed salary and advance information for {employeeAdvances?.employee?.name}
            </DialogDescription>
          </DialogHeader>
          
          {employeeAdvances && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="monthly">Monthly Details</TabsTrigger>
                <TabsTrigger value="advances">All Advances</TabsTrigger>
                <TabsTrigger value="salary-slips">Salary Slips</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Employee Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <div className="font-medium">{employeeAdvances.employee.name}</div>
                      </div>
                      <div>
                        <Label>Employee ID</Label>
                        <div className="font-medium">{employeeAdvances.employee.employeeId}</div>
                      </div>
                      <div>
                        <Label>Monthly Base Salary</Label>
                        <div className="font-medium text-green-600 dark:text-green-400">
                          {formatCurrency(employeeAdvances.employee.baseSalary)}
                        </div>
                      </div>
                      <div>
                        <Label>Total Advances</Label>
                        <div className="font-medium text-red-600 dark:text-red-400">
                          {employeeAdvances.totalAdvances}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="monthly" className="space-y-4">
                <div className="space-y-4">
                  {employeeAdvances.monthlyData.map((month, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{month.month}</CardTitle>
                          {month.salarySlip && (
                            <Badge variant="secondary">Salary Slip Generated</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <Label>Base Salary</Label>
                            <div className="font-medium text-green-600 dark:text-green-400">
                              {formatCurrency(month.baseSalary)}
                            </div>
                          </div>
                          <div>
                            <Label>Advances</Label>
                            <div className="font-medium text-red-600 dark:text-red-400">
                              {formatCurrency(month.totalAdvance)}
                            </div>
                          </div>
                          <div>
                            <Label>Remaining</Label>
                            <div className={`font-medium ${month.remainingAmount >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                              {formatCurrency(month.remainingAmount)}
                            </div>
                          </div>
                          <div>
                            <Label>Advance Count</Label>
                            <div className="font-medium">{month.advanceCount}</div>
                          </div>
                        </div>
                        
                        {month.salarySlip && (
                          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <h4 className="font-medium mb-2">Salary Slip Details</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Final Payable:</span>
                                <div className="font-medium text-green-600 dark:text-green-400">
                                  {formatCurrency(month.salarySlip.finalPayable)}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Generated:</span>
                                <div className="font-medium">
                                  {formatDate(month.salarySlip.generatedAt)}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="advances" className="space-y-4">
                <div className="space-y-4">
                  {employeeAdvances.monthlyData.map((month, monthIndex) => (
                    <Card key={monthIndex}>
                      <CardHeader>
                        <CardTitle>{month.month} - Advances</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {month.advances.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {month.advances.map((advance, advanceIndex) => (
                                <TableRow key={advanceIndex}>
                                  <TableCell>{formatDate(advance.date)}</TableCell>
                                  <TableCell className="text-red-600 dark:text-red-400 font-medium">
                                    {formatCurrency(advance.amount)}
                                  </TableCell>
                                  <TableCell>{advance.reason}</TableCell>
                                  <TableCell>
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
                                            onClick={() => handleDeleteAdvance(employeeAdvances.employee.employeeId, advance._id)}
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No advances for this month
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="salary-slips" className="space-y-4">
                <div className="space-y-4">
                  {employeeAdvances.monthlyData
                    .filter(month => month.salarySlip)
                    .map((month, monthIndex) => (
                      <Card key={monthIndex}>
                        <CardHeader>
                          <CardTitle>{month.month} - Salary Slip</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* Employee Details */}
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                              <h4 className="font-medium mb-3">Employee Details</h4>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">Name:</span>
                                  <div className="font-medium">{employeeAdvances.employee.name}</div>
                                </div>
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">Employee ID:</span>
                                  <div className="font-medium">{employeeAdvances.employee.employeeId}</div>
                                </div>
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">Month:</span>
                                  <div className="font-medium">{month.month}</div>
                                </div>
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">Generated:</span>
                                  <div className="font-medium">{formatDate(month.salarySlip.generatedAt)}</div>
                                </div>
                              </div>
                            </div>

                            {/* Salary Breakdown */}
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                              <h4 className="font-medium mb-3">Salary Breakdown</h4>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span>Basic Salary:</span>
                                  <span className="font-medium text-green-600 dark:text-green-400">
                                    {formatCurrency(month.salarySlip.basicSalary)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span>Advances Deducted:</span>
                                  <span className="font-medium text-red-600 dark:text-red-400">
                                    -{formatCurrency(month.salarySlip.advancesDeducted)}
                                  </span>
                                </div>
                                <div className="border-t pt-3">
                                  <div className="flex justify-between items-center font-bold text-lg">
                                    <span>Final Payable:</span>
                                    <span className="text-blue-600 dark:text-blue-400">
                                      {formatCurrency(month.salarySlip.finalPayable)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Notes */}
                            {month.salarySlip.notes && (
                              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <h4 className="font-medium mb-2">Notes</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{month.salarySlip.notes}</p>
                              </div>
                            )}

                            {/* Download Button */}
                            <Button 
                              className="w-full" 
                              onClick={() => {
                                // Create a simple text-based salary slip for download
                                const slipContent = `
SALARY SLIP
${month.month}

Employee Details:
Name: ${employeeAdvances.employee.name}
Employee ID: ${employeeAdvances.employee.employeeId}
Month: ${month.month}
Generated: ${formatDate(month.salarySlip.generatedAt)}

Salary Breakdown:
Basic Salary: ${formatCurrency(month.salarySlip.basicSalary)}
Advances Deducted: -${formatCurrency(month.salarySlip.advancesDeducted)}
----------------------------------------
Final Payable: ${formatCurrency(month.salarySlip.finalPayable)}

Notes: ${month.salarySlip.notes || 'No additional notes'}
                                `.trim();

                                const blob = new Blob([slipContent], { type: 'text/plain' });
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `salary-slip-${employeeAdvances.employee.employeeId}-${month.month.replace(' ', '-')}.txt`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                                toast.success('Salary slip downloaded successfully');
                              }}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Salary Slip
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  {employeeAdvances.monthlyData.filter(month => month.salarySlip).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No salary slips generated for this employee yet.
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeAdvance; 