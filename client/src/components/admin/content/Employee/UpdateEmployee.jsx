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
  User, 
  FileImage, 
  X, 
  Upload,
  Building2,
  UserCheck
} from "lucide-react";
import toast from "react-hot-toast";
import { useUpdateEmployeeMutation, useGetEmployeeByIdMutation } from "@/features/api/employeeApi.js";
import { useSelector } from "react-redux";
import { useGetAllBranchesQuery } from "@/features/api/branchApi";
import { selectUserRole } from "@/features/authSlice";

const genderOptions = ["male", "female", "other"];
const roleOptions = ["tailor", "manager", "biller", "director", "admin", "other"];
const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const gradeOptions = ["A", "B", "C", "D"];

const FormSection = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
      <Icon className="w-4 h-4 text-gray-600" />
      <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
    </div>
    {children}
  </div>
);

const FormField = ({ label, required, children, className = "" }) => (
  <div className={`space-y-1 ${className}`}>
    <Label className="text-xs font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    {children}
  </div>
);

const UpdateEmployee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const employeeId = location.state?.employeeId;
  const userRole = useSelector(selectUserRole);
  const showBranchDropdown = !["branchAdmin", "billing", "operation"].includes(userRole);
  const [branchId, setBranchId] = useState("");
  const { data: branchData, isLoading: branchLoading } = useGetAllBranchesQuery({ page: 1, limit: 100 });
  
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    gender: "",
    address: "",
    aadhaarNumber: "",
    role: "",
    joiningDate: "",
    bloodGroup: "",
    grade: "",
    dob: "",
    baseSalary: "",
    bankDetails: { bankName: "", accountNumber: "", ifsc: "" },
    emergencyContact: { name: "", mobile: "" },
    secondaryRoles: [],
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [previewAadhaarImage, setPreviewAadhaarImage] = useState("");
  const [existingAadhaarImage, setExistingAadhaarImage] = useState("");
  const [existingAadhaarPublicId, setExistingAadhaarPublicId] = useState("");
  const [updateEmployee, { isLoading: isUpdating, isSuccess, isError, error, data }] = useUpdateEmployeeMutation({});
  const [getEmployeeById, { isLoading: isLoadingEmployee, error: employeeError }] = useGetEmployeeByIdMutation({});
  const [employeeData, setEmployeeData] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (employeeId) {
        console.log("Calling getEmployeeById with:", employeeId);
        try {
          const result = await getEmployeeById(employeeId).unwrap();
          console.log("getEmployeeById result:", result);
          setEmployeeData(result);
        } catch (error) {
          console.error("getEmployeeById error:", error);
        }
      } else {
        console.error("No employeeId provided");
        toast.error("No employee ID provided");
        navigate("/employee/employees");
      }
    };
    
    fetchEmployee();
  }, [employeeId, getEmployeeById, navigate]);

  useEffect(() => {
    console.log("employeeData received:", employeeData);
    if (employeeData?.employee) {
      const employee = employeeData.employee;
      
      setForm({
        name: employee.name || "",
        mobile: employee.mobile || "",
        email: employee.email || "",
        password: "", // Don't populate password for security
        gender: employee.gender || "",
        address: employee.address || "",
        aadhaarNumber: employee.aadhaarNumber || "",
        role: employee.role || "",
        joiningDate: employee.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : "",
        bloodGroup: employee.bloodGroup || "",
        grade: employee.grade || "",
        dob: employee.dob ? new Date(employee.dob).toISOString().split('T')[0] : "",
        baseSalary: employee.baseSalary ? employee.baseSalary.toString() : "",
        bankDetails: employee.bankDetails || { bankName: "", accountNumber: "", ifsc: "" },
        emergencyContact: employee.emergencyContact || { name: "", mobile: "" },
        secondaryRoles: Array.isArray(employee.secondaryRoles) ? employee.secondaryRoles : [],
      });
      
      // Set branch ID if available
      if (employee.branchId) {
        setBranchId(employee.branchId);
      }
      
      // Set profile image preview
      if (employee.profileImage) {
        setPreviewImage(employee.profileImage);
      }
      
      // Set Aadhaar image preview and data
      if (employee.aadhaarImage) {
        setExistingAadhaarImage(employee.aadhaarImage);
        setPreviewAadhaarImage(employee.aadhaarImage);
      }
      if (employee.aadhaarPublicId) {
        setExistingAadhaarPublicId(employee.aadhaarPublicId);
      }
    } else if (employeeData && !employeeData.employee) {
      console.log("employeeData exists but no employee property:", employeeData);
      // Try to use employeeData directly if it's the employee object
      const employee = employeeData;
      console.log("Using employeeData directly:", employee);
      
      setForm({
        name: employee.name || "",
        mobile: employee.mobile || "",
        email: employee.email || "",
        password: "", // Don't populate password for security
        gender: employee.gender || "",
        address: employee.address || "",
        aadhaarNumber: employee.aadhaarNumber || "",
        role: employee.role || "",
        joiningDate: employee.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : "",
        bloodGroup: employee.bloodGroup || "",
        grade: employee.grade || "",
        dob: employee.dob ? new Date(employee.dob).toISOString().split('T')[0] : "",
        baseSalary: employee.baseSalary ? employee.baseSalary.toString() : "",
        bankDetails: employee.bankDetails || { bankName: "", accountNumber: "", ifsc: "" },
        emergencyContact: employee.emergencyContact || { name: "", mobile: "" },
        secondaryRoles: Array.isArray(employee.secondaryRoles) ? employee.secondaryRoles : [],
      });
      
      // Set branch ID if available
      if (employee.branchId) {
        setBranchId(employee.branchId);
      }
      
      // Set profile image preview
      if (employee.profileImage) {
        setPreviewImage(employee.profileImage);
      }
      
      // Set Aadhaar image preview and data
      if (employee.aadhaarImage) {
        setExistingAadhaarImage(employee.aadhaarImage);
        setPreviewAadhaarImage(employee.aadhaarImage);
      }
      if (employee.aadhaarPublicId) {
        setExistingAadhaarPublicId(employee.aadhaarPublicId);
      }
    }
  }, [employeeData]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Employee updated successfully");
      navigate("/employee/employees");
    } else if (isError) {
      toast.error(error?.data?.message || "Failed to update employee");
    }
  }, [isSuccess, isError, data, error, navigate]);

  // Update handleChange to support nested fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested fields using name convention: e.g., 'bankDetails_bankName'
    if (name.startsWith("bankDetails_")) {
      const field = name.replace("bankDetails_", "");
      setForm((prev) => ({
        ...prev,
        bankDetails: { ...prev.bankDetails, [field]: value },
      }));
    } else if (name.startsWith("emergencyContact_")) {
      const field = name.replace("emergencyContact_", "");
      setForm((prev) => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact, [field]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleSecondaryRole = (role) => {
    setForm((prev) => {
      const exists = prev.secondaryRoles.includes(role);
      return {
        ...prev,
        secondaryRoles: exists
          ? prev.secondaryRoles.filter((r) => r !== role)
          : [...prev.secondaryRoles, role],
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setProfileImage(file);
    setPreviewImage(file ? URL.createObjectURL(file) : "");
  };

  const handleAadhaarImageChange = (e) => {
    const file = e.target.files?.[0];
    setAadhaarImage(file);
    setPreviewAadhaarImage(file ? URL.createObjectURL(file) : "");
  };

  const removeAadhaarImage = () => {
    setAadhaarImage(null);
    setPreviewAadhaarImage("");
    setExistingAadhaarImage("");
    setExistingAadhaarPublicId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.role) {
      toast.error("Name, Mobile, and Role are required.");
      return;
    }
    if (showBranchDropdown && !branchId) {
      toast.error("Please select a branch.");
      return;
    }
    
    const formData = new FormData();
    formData.append("employeeId", employeeId);
    formData.append("name", form.name);
    formData.append("mobile", form.mobile);
    if (form.password && form.password.trim() !== "") formData.append("password", form.password);
    if (form.email !== undefined) formData.append("email", form.email);
    if (form.gender !== undefined) formData.append("gender", form.gender);
    if (form.address !== undefined) formData.append("address", form.address);
    if (form.aadhaarNumber !== undefined) formData.append("aadhaarNumber", form.aadhaarNumber);
    formData.append("role", form.role);
    if (form.joiningDate !== undefined) formData.append("joiningDate", form.joiningDate);
    if (form.bloodGroup !== undefined) formData.append("bloodGroup", form.bloodGroup);
    if (form.grade !== undefined) formData.append("grade", form.grade);
    if (form.dob !== undefined) formData.append("dob", form.dob);
    if (form.baseSalary !== undefined && form.baseSalary !== "") formData.append("baseSalary", form.baseSalary);
    if (profileImage) formData.append("profileImage", profileImage);
    if (aadhaarImage) formData.append("aadhaarImage", aadhaarImage);
    if (existingAadhaarPublicId) formData.append("existingAadhaarPublicId", existingAadhaarPublicId);
    if (form.secondaryRoles?.length) {
      formData.append("secondaryRoles", JSON.stringify(form.secondaryRoles));
    }
    
    // Handle bank details - send even if empty to allow clearing
    const bankDetailsToSend = {
      bankName: form.bankDetails.bankName || "",
      accountNumber: form.bankDetails.accountNumber || "",
      ifsc: form.bankDetails.ifsc || ""
    };
    formData.append("bankDetails", JSON.stringify(bankDetailsToSend));
    
    // Handle emergency contact - send even if empty to allow clearing
    const emergencyContactToSend = {
      name: form.emergencyContact.name || "",
      mobile: form.emergencyContact.mobile || ""
    };
    formData.append("emergencyContact", JSON.stringify(emergencyContactToSend));
    
    if (showBranchDropdown) {
      formData.append("branchId", branchId);
    }
    
    await updateEmployee(formData);
  };

  if (isLoadingEmployee) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (employeeError) {
    console.error("Employee error details:", employeeError);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error loading employee data: {employeeError?.data?.message || employeeError?.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-600 rounded-full shadow-lg mb-3">
            <User className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Update Employee</h1>
          <p className="text-gray-600 text-sm">Update employee information below</p>
          {employeeId && <p className="text-xs text-gray-400 mt-1">Employee ID: {employeeId}</p>}
        </div>

        <div className="space-y-4">
          {/* Personal Information */}
          <FormSection title="Personal Information" icon={User}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <FormField label="Full Name" required>
                <Input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  placeholder="Enter full name"
                  className="h-8 text-sm"
                />
              </FormField>
              
              <FormField label="Mobile Number" required>
                <Input 
                  name="mobile" 
                  value={form.mobile} 
                  onChange={handleChange} 
                  placeholder="Enter mobile number"
                  className="h-8 text-sm"
                />
              </FormField>
              
              <FormField label="Email Address">
                <Input 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  placeholder="Enter email address"
                  type="email"
                  className="h-8 text-sm"
                />
              </FormField>
              
              <FormField label="New Password">
                <Input 
                  name="password" 
                  type="password" 
                  value={form.password} 
                  onChange={handleChange} 
                  placeholder="Leave blank to keep current"
                  className="h-8 text-sm"
                />
              </FormField>
              
              <FormField label="Gender">
                <Select value={form.gender} onValueChange={(val) => setForm((prev) => ({ ...prev, gender: val }))}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((g) => (
                      <SelectItem key={g} value={g} className="capitalize text-sm">{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              
              <FormField label="Date of Birth">
                <Input 
                  name="dob" 
                  type="date" 
                  value={form.dob} 
                  onChange={handleChange}
                  className="h-8 text-sm"
                />
              </FormField>
              
              <FormField label="Aadhaar Number">
                <Input 
                  name="aadhaarNumber" 
                  value={form.aadhaarNumber} 
                  onChange={handleChange} 
                  placeholder="Enter Aadhaar number"
                  className="h-8 text-sm"
                />
              </FormField>
              
              <FormField label="Blood Group">
                <Select value={form.bloodGroup} onValueChange={(val) => setForm((prev) => ({ ...prev, bloodGroup: val }))}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroupOptions.map((bg) => (
                      <SelectItem key={bg} value={bg} className="text-sm">{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              
              <FormField label="Address" className="md:col-span-2">
                <Input 
                  name="address" 
                  value={form.address} 
                  onChange={handleChange} 
                  placeholder="Enter address"
                  className="h-8 text-sm"
                />
              </FormField>
            </div>
            
            {/* Profile Image */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <FormField label="Profile Image">
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="h-8 text-sm file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-orange-50 file:text-orange-700"
                    />
                  </FormField>
                </div>
              </div>
            </div>
          </FormSection>

          {/* Employment & Documents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormSection title="Employment Details" icon={Building2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Role" required>
                  <Select value={form.role} onValueChange={(val) => setForm((prev) => ({ ...prev, role: val }))}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((r) => (
                        <SelectItem key={r} value={r} className="capitalize text-sm">{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Secondary Roles (optional)" className="sm:col-span-2">
                  <div className="flex flex-wrap gap-2">
                    {roleOptions.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => toggleSecondaryRole(r)}
                        className={`h-7 px-3 rounded border text-xs capitalize ${
                          form.secondaryRoles.includes(r)
                            ? "bg-orange-600 text-white border-orange-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </FormField>
                
                <FormField label="Joining Date">
                  <Input 
                    name="joiningDate" 
                    type="date" 
                    value={form.joiningDate} 
                    onChange={handleChange}
                    className="h-8 text-sm"
                  />
                </FormField>
                
                <FormField label="Grade">
                  <Select value={form.grade} onValueChange={(val) => setForm((prev) => ({ ...prev, grade: val }))}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeOptions.map((g) => (
                        <SelectItem key={g} value={g} className="text-sm">Grade {g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                
                <FormField label="Base Salary">
                  <Input 
                    name="baseSalary" 
                    type="number" 
                    value={form.baseSalary} 
                    onChange={handleChange} 
                    placeholder="Enter base salary"
                    className="h-8 text-sm"
                  />
                </FormField>
                
                {showBranchDropdown && (
                  <FormField label="Branch" required>
                    <Select value={branchId} onValueChange={setBranchId}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder={branchLoading ? "Loading..." : "Select branch"} />
                      </SelectTrigger>
                      <SelectContent>
                        {branchData?.branches?.map((b) => (
                          <SelectItem key={b._id} value={b._id}>{b.branchName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                )}
              </div>
            </FormSection>

            <FormSection title="Document Upload" icon={Upload}>
              <FormField label="Aadhaar Card Image">
                <div className="space-y-2">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAadhaarImageChange}
                    className="h-8 text-sm file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-orange-50 file:text-orange-700"
                  />
                  {previewAadhaarImage && (
                    <div className="relative inline-block">
                      <img 
                        src={previewAadhaarImage} 
                        alt="Aadhaar" 
                        className="w-20 h-12 object-cover rounded border" 
                      />
                      <button
                        type="button"
                        onClick={removeAadhaarImage}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    </div>
                  )}
                </div>
              </FormField>
            </FormSection>
          </div>

          {/* Bank Details & Emergency Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormSection title="Bank Details" icon={Building2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Bank Name">
                  <Input 
                    name="bankDetails_bankName" 
                    value={form.bankDetails.bankName} 
                    onChange={handleChange} 
                    placeholder="Enter bank name"
                    className="h-8 text-sm"
                  />
                </FormField>
                
                <FormField label="Account Number">
                  <Input 
                    name="bankDetails_accountNumber" 
                    value={form.bankDetails.accountNumber} 
                    onChange={handleChange} 
                    placeholder="Enter account number"
                    className="h-8 text-sm"
                  />
                </FormField>
                
                <FormField label="IFSC Code" className="sm:col-span-2">
                  <Input 
                    name="bankDetails_ifsc" 
                    value={form.bankDetails.ifsc} 
                    onChange={handleChange} 
                    placeholder="Enter IFSC code"
                    className="h-8 text-sm"
                  />
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Emergency Contact" icon={UserCheck}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Contact Name">
                  <Input 
                    name="emergencyContact_name" 
                    value={form.emergencyContact.name} 
                    onChange={handleChange} 
                    placeholder="Enter contact name"
                    className="h-8 text-sm"
                  />
                </FormField>
                
                <FormField label="Contact Mobile">
                  <Input 
                    name="emergencyContact_mobile" 
                    value={form.emergencyContact.mobile} 
                    onChange={handleChange} 
                    placeholder="Enter contact mobile"
                    className="h-8 text-sm"
                  />
                </FormField>
              </div>
            </FormSection>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-start pt-2 space-x-3">
            <Button
              type="button"
              onClick={() => navigate("/employee/employees")}
              className="h-9 px-6 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md shadow-sm transition-colors text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isUpdating}
              className="h-9 px-6 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md shadow-sm transition-colors text-sm"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Employee"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEmployee;
