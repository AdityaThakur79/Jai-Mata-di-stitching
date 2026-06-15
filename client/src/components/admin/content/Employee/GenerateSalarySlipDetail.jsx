import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Save,
  DollarSign,
  Loader2,
  CalendarCheck,
  Info,
  TrendingUp,
  TrendingDown,
  Calculator,
  AlertCircle,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { useGenerateDetailedSalarySlipMutation } from "@/features/api/employeeApi";
import { useGetEmployeeAttendanceQuery } from "@/features/api/attendanceApi";
import AttendanceCalendarView from "./AttendanceCalendarView";

const GenerateSalarySlipDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { employee, month, year } = location.state || {};

  const [formData, setFormData] = useState({
    // Basic
    monthIndex: month || new Date().getMonth(),
    year: year || new Date().getFullYear(),
    
    // Earnings
    basicSalary: employee?.baseSalary || 0,
    hra: 0,
    da: 0,
    conveyanceAllowance: 0,
    medicalAllowance: 0,
    specialAllowance: 0,
    otherEarnings: 0,
    bonus: 0,
    incentive: 0,
    
    // Deductions
    advancesDeducted: 0,
    pf: 0,
    esi: 0,
    tds: 0,
    professionalTax: 0,
    loanDeduction: 0,
    otherDeductions: 0,
    
    // Attendance
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    leaveDays: 0,
    halfDays: 0,
    
    // Per-day
    perDayRate: employee?.perDayRate || 0,
    dailyWages: [],
    
    notes: "",
  });

  const [showAttendance, setShowAttendance] = useState(false);

  const { data: attendanceData, isLoading: loadingAttendance } = useGetEmployeeAttendanceQuery({
    employeeId: employee?.employeeId,
    month: formData.monthIndex,
    year: formData.year,
  });

  const [generateSlip, { isLoading }] = useGenerateDetailedSalarySlipMutation();

  useEffect(() => {
    if (attendanceData?.data) {
      const { stats } = attendanceData.data;
      
      // Get working days in the month
      const daysInMonth = new Date(formData.year, formData.monthIndex + 1, 0).getDate();
      
      setFormData(prev => ({
        ...prev,
        totalDays: daysInMonth,
        presentDays: stats.present,
        absentDays: stats.absent,
        leaveDays: stats.leave,
        halfDays: stats.halfDay,
      }));
      
      // Auto-calculate salary based on attendance
      if (employee?.baseSalary) {
        const paidDays = stats.present + stats.leave + (stats.halfDay * 0.5);
        
        // If present days is 0, set basic salary to 0
        let attendanceBasedSalary = 0;
        if (stats.present === 0) {
          attendanceBasedSalary = 0;
        } else {
          // Calculate proportional salary
          const workingDaysRatio = daysInMonth > 0 ? paidDays / daysInMonth : 1;
          attendanceBasedSalary = Math.round(employee.baseSalary * workingDaysRatio);
        }
        
        setFormData(prev => ({
          ...prev,
          basicSalary: attendanceBasedSalary,
        }));
      }
      
      // Calculate advances for this month
      const monthAdvances = employee?.advancePayments?.filter(advance => {
        const advDate = new Date(advance.date);
        return advDate.getMonth() === formData.monthIndex && 
               advDate.getFullYear() === formData.year;
      }) || [];
      
      const totalAdvances = monthAdvances.reduce((sum, adv) => sum + adv.amount, 0);
      setFormData(prev => ({
        ...prev,
        advancesDeducted: totalAdvances,
      }));
    }
  }, [attendanceData, employee, formData.monthIndex, formData.year]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const calculatePaidDays = () => {
    const { presentDays, leaveDays, halfDays } = formData;
    return presentDays + leaveDays + (halfDays * 0.5);
  };

  // Calculate total earnings
  const calculateTotalEarnings = () => {
    const {
      basicSalary, hra, da, conveyanceAllowance, medicalAllowance,
      specialAllowance, otherEarnings, bonus, incentive,
    } = formData;

    return basicSalary + hra + da + conveyanceAllowance + medicalAllowance + 
           specialAllowance + otherEarnings + bonus + incentive;
  };

  const calculateTotalDeductions = () => {
    const { advancesDeducted, pf, esi, tds, professionalTax, loanDeduction, otherDeductions } = formData;
    return advancesDeducted + pf + esi + tds + professionalTax + loanDeduction + otherDeductions;
  };

  // Calculate final payable
  const calculateFinalPayable = () => {
    return Math.max(0, calculateTotalEarnings() - calculateTotalDeductions());
  };

  const handleSubmit = async () => {
    try {
      const totalEarnings = calculateTotalEarnings();
      const totalDeductions = calculateTotalDeductions();
      const finalPayable = calculateFinalPayable();
      const paidDays = calculatePaidDays();

      const payload = {
        employeeId: employee.employeeId,
        month: formData.monthIndex,
        year: formData.year,
        ...formData,
        totalEarnings,
        totalDeductions,
        finalPayable,
        paidDays,
      };
//await request has been addded here
      await generateSlip(payload).unwrap();
      toast.success("Salary slip generated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error generating salary slip:", error);
      toast.error(error?.data?.message || "Failed to generate salary slip");
    }
  };

  if (!employee) {
    return (
      <div className="p-6">
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
        <p className="mt-4 text-gray-500">No employee data found</p>
      </div>
    );
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="p-6 space-y-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate(-1)} variant="ghost" size="sm" className="hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Generate Salary Slip - {monthNames[formData.monthIndex]} {formData.year}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {employee?.name} • {employee?.employeeId}
              </p>
            </div>
          </div>
          
          <Dialog open={showAttendance} onOpenChange={setShowAttendance}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <CalendarCheck className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  📅 Attendance - {monthNames[formData.monthIndex]} {formData.year}
                </DialogTitle>
              </DialogHeader>
              <AttendanceCalendarView
                employeeId={employee?.employeeId}
                month={formData.monthIndex}
                year={formData.year}
                attendanceData={attendanceData}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Employee Info & Attendance - Full Width */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Employee Info */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <User className="w-4 h-4" />
              Employee Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
              <Badge variant={employee?.paymentType === "daily" ? "default" : "secondary"} className="text-xs">
                {employee?.paymentType === "daily" ? "Per Day" : "Monthly"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Role:</span>
              <span className="text-sm font-medium capitalize">{employee?.role}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Base Salary:</span>
              <span className="text-sm font-semibold">₹{employee?.baseSalary?.toLocaleString('en-IN')}</span>
            </div>
            {employee?.paymentType === "daily" && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Per Day Rate:</span>
                <span className="text-sm font-semibold">₹{employee?.perDayRate?.toLocaleString('en-IN')}</span>
              </div>
            )}
          </CardContent>
        </Card>


        {/* Attendance Summary */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <CalendarCheck className="w-4 h-4" />
                Attendance Summary
              </CardTitle>
              <span className="text-xs text-blue-600 font-medium">Auto-calculated</span>
            </div>
          </CardHeader>
          <CardContent>
            {loadingAttendance ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-6 gap-2 mb-3">
                  <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                    <div className="text-lg font-bold">{formData.totalDays}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
                  </div>
                  <div className="text-center p-2 bg-green-100 dark:bg-green-900/30 rounded">
                    <div className="text-lg font-bold text-green-700">{formData.presentDays}</div>
                    <div className="text-xs text-green-600">Present</div>
                  </div>
                  <div className="text-center p-2 bg-red-100 dark:bg-red-900/30 rounded">
                    <div className="text-lg font-bold text-red-700">{formData.absentDays}</div>
                    <div className="text-xs text-red-600">Absent</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                    <div className="text-lg font-bold text-yellow-700">{formData.leaveDays}</div>
                    <div className="text-xs text-yellow-600">Leave</div>
                  </div>
                  <div className="text-center p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
                    <div className="text-lg font-bold text-blue-700">{formData.halfDays}</div>
                    <div className="text-xs text-blue-600">Half</div>
                  </div>
                  <div className="text-center p-2 bg-purple-100 dark:bg-purple-900/30 rounded">
                    <div className="text-lg font-bold text-purple-700">{calculatePaidDays()}</div>
                    <div className="text-xs text-purple-600">Paid</div>
                  </div>
                </div>
                <div className="text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-gray-700 dark:text-gray-300">
                  <strong>Calculation:</strong> ₹{employee?.baseSalary?.toLocaleString('en-IN')} × ({calculatePaidDays()}/{formData.totalDays}) = ₹{formData.basicSalary.toLocaleString('en-IN')}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Earnings & Deductions - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Earnings */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="pb-3 bg-green-50 dark:bg-green-900/20">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-700 dark:text-green-400">
              <TrendingUp className="w-4 h-4" />
              Earnings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400">Basic Salary (Attendance-based)</Label>
              <Input
                type="number"
                value={formData.basicSalary}
                onChange={(e) => handleInputChange("basicSalary", e.target.value)}
                className="mt-1 h-9 text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { field: "hra", label: "HRA" },
                { field: "da", label: "DA" },
                { field: "conveyanceAllowance", label: "Conveyance" },
                { field: "medicalAllowance", label: "Medical" },
                { field: "specialAllowance", label: "Special" },
                { field: "bonus", label: "Bonus" },
                { field: "incentive", label: "Incentive" },
                { field: "otherEarnings", label: "Other" },
              ].map(({ field, label }) => (
                <div key={field}>
                  <Label className="text-xs text-gray-600 dark:text-gray-400">{label}</Label>
                  <Input
                    type="number"
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="mt-1 h-9 text-sm"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center p-3 bg-green-100 dark:bg-green-900/30 rounded">
              <span className="text-sm font-medium">Total Earnings:</span>
              <span className="text-lg font-bold text-green-700">
                ₹{calculateTotalEarnings().toLocaleString('en-IN')}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Deductions */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="pb-3 bg-red-50 dark:bg-red-900/20">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-700 dark:text-red-400">
              <TrendingDown className="w-4 h-4" />
              Deductions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400">Advances (Auto-calculated)</Label>
              <Input
                type="number"
                value={formData.advancesDeducted}
                disabled
                className="mt-1 h-9 text-sm bg-gray-100 dark:bg-gray-700"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { field: "pf", label: "PF" },
                { field: "esi", label: "ESI" },
                { field: "tds", label: "TDS" },
                { field: "professionalTax", label: "Prof. Tax" },
                { field: "loanDeduction", label: "Loan" },
                { field: "otherDeductions", label: "Other" },
              ].map(({ field, label }) => (
                <div key={field}>
                  <Label className="text-xs text-gray-600 dark:text-gray-400">{label}</Label>
                  <Input
                    type="number"
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="mt-1 h-9 text-sm"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center p-3 bg-red-100 dark:bg-red-900/30 rounded">
              <span className="text-sm font-medium">Total Deductions:</span>
              <span className="text-lg font-bold text-red-700">
                ₹{calculateTotalDeductions().toLocaleString('en-IN')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes & Summary - Full Width */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Notes */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full p-3 border rounded-lg min-h-[120px] text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
              placeholder="Additional notes..."
            />
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border-2 border-orange-500">
          <CardHeader className="pb-3 bg-orange-50 dark:bg-orange-900/20">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <Calculator className="w-4 h-4" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="flex justify-between text-sm p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <span className="text-gray-700 dark:text-gray-300">Total Earnings:</span>
              <span className="font-bold text-green-700">₹{calculateTotalEarnings().toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <span className="text-gray-700 dark:text-gray-300">Total Deductions:</span>
              <span className="font-bold text-red-700">₹{calculateTotalDeductions().toLocaleString('en-IN')}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center p-3 bg-orange-100 dark:bg-orange-900/30 rounded font-bold">
              <span className="text-gray-900 dark:text-white">Net Pay:</span>
              <span className="text-orange-700 text-xl">₹{calculateFinalPayable().toLocaleString('en-IN')}</span>
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 h-10"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Generate Slip
                  </>
                )}
              </Button>
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="flex-1 h-10"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GenerateSalarySlipDetail;
