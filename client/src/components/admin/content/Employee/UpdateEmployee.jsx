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
import { Loader2, User, FileImage, X } from "lucide-react";
import toast from "react-hot-toast";
import { useUpdateEmployeeMutation, useGetEmployeeByIdMutation } from "@/features/api/employeeApi.js";

const genderOptions = ["male", "female", "other"];
const roleOptions = ["tailor", "manager", "biller", "director", "admin", "other"];
const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const gradeOptions = ["A", "B", "C", "D"];

const UpdateEmployee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const employeeId = location.state?.employeeId;
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
        navigate("/admin/employees");
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
      });
      
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
      });
      
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
      navigate("/admin/employees");
    } else if (isError) {
      toast.error(error?.data?.message || "Failed to update employee");
    }
  }, [isSuccess, isError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, bankDetails: { ...prev.bankDetails, [name]: value } }));
  };

  const handleEmergencyChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, emergencyContact: { ...prev.emergencyContact, [name]: value } }));
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
    const formData = new FormData();
    formData.append("employeeId", employeeId);
    formData.append("name", form.name);
    formData.append("mobile", form.mobile);
    if (form.password) formData.append("password", form.password);
    if (form.email) formData.append("email", form.email);
    if (form.gender) formData.append("gender", form.gender);
    if (form.address) formData.append("address", form.address);
    if (form.aadhaarNumber) formData.append("aadhaarNumber", form.aadhaarNumber);
    formData.append("role", form.role);
    if (form.joiningDate) formData.append("joiningDate", form.joiningDate);
    if (form.bloodGroup) formData.append("bloodGroup", form.bloodGroup);
    if (form.grade) formData.append("grade", form.grade);
    if (form.dob) formData.append("dob", form.dob);
    if (form.baseSalary) formData.append("baseSalary", form.baseSalary);
    if (profileImage) formData.append("profileImage", profileImage);
    if (aadhaarImage) formData.append("aadhaarImage", aadhaarImage);
    if (existingAadhaarPublicId) formData.append("existingAadhaarPublicId", existingAadhaarPublicId);
    if (form.bankDetails.bankName || form.bankDetails.accountNumber || form.bankDetails.ifsc) {
      formData.append("bankDetails", JSON.stringify(form.bankDetails));
    }
    if (form.emergencyContact.name || form.emergencyContact.mobile) {
      formData.append("emergencyContact", JSON.stringify(form.emergencyContact));
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
    <div className="relative px-6 py-12 min-h-[100vh] bg-gradient-to-tr from-[#fdfbff] via-[#f8e1d9] to-[#fef9f9] dark:from-gray-900 dark:to-[#7d3c3c] flex items-center justify-center overflow-x-hidden">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 space-y-12 border border-gray-200 dark:border-gray-800 animate-fade-in drop-shadow-xl"
        style={{ boxShadow: '0 8px 32px 0 rgba(247, 127, 47, 0.15)' }}
      >
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-[#f77f2f] to-[#fca16a] rounded-full p-2 shadow-lg mb-2 animate-fade-in">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#f77f2f] to-[#fca16a] tracking-wider uppercase drop-shadow-lg">Update Employee</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Update employee information below.</p>
          {employeeId && <p className="text-sm text-gray-400">Employee ID: {employeeId}</p>}
        </div>

        <div className="grid md:grid-cols-3 gap-8 animate-fade-in-up">
          <div>
            <Label>Name *</Label>
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Employee Name" required className="rounded-xl" />
          </div>
          <div>
            <Label>Mobile *</Label>
            <Input name="mobile" value={form.mobile} onChange={handleChange} placeholder="Mobile Number" required className="rounded-xl" />
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" value={form.email} onChange={handleChange} placeholder="Email Address" className="rounded-xl" />
          </div>
          <div>
            <Label>New Password (Leave blank to keep current)</Label>
            <Input name="password" type="password" value={form.password} onChange={handleChange} placeholder="New Password" className="rounded-xl" />
          </div>
          <div>
            <Label>Gender</Label>
            <Select value={form.gender} onValueChange={(val) => setForm((prev) => ({ ...prev, gender: val }))}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                {genderOptions.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Blood Group</Label>
            <Select value={form.bloodGroup} onValueChange={(val) => setForm((prev) => ({ ...prev, bloodGroup: val }))}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select Blood Group" />
              </SelectTrigger>
              <SelectContent>
                {bloodGroupOptions.map((bg) => (
                  <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Grade</Label>
            <Select value={form.grade} onValueChange={(val) => setForm((prev) => ({ ...prev, grade: val }))}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select Grade" />
              </SelectTrigger>
              <SelectContent>
                {gradeOptions.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date of Birth</Label>
            <Input name="dob" type="date" value={form.dob} onChange={handleChange} className="rounded-xl" />
          </div>
          <div>
            <Label>Base Salary</Label>
            <Input name="baseSalary" type="number" value={form.baseSalary} onChange={handleChange} placeholder="Base Salary" className="rounded-xl" />
          </div>
          <div>
            <Label>Address</Label>
            <Input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="rounded-xl" />
          </div>
          <div>
            <Label>Aadhaar Number</Label>
            <Input name="aadhaarNumber" value={form.aadhaarNumber} onChange={handleChange} placeholder="Aadhaar Number" className="rounded-xl" />
          </div>
          <div>
            <Label>Role *</Label>
            <Select value={form.role} onValueChange={(val) => setForm((prev) => ({ ...prev, role: val }))}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Joining Date</Label>
            <Input name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} className="rounded-xl" />
          </div>
          <div>
            <Label>Profile Image</Label>
            <Input type="file" accept="image/*" onChange={handleImageChange} className="rounded-xl" />
            {previewImage && (
              <img src={previewImage} alt="Preview" className="mt-2 w-20 h-20 rounded-full object-cover border-2 border-[#f8a977] shadow-md" />
            )}
          </div>
        </div>

        {/* Aadhaar Card Image Section */}
        <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-[#f8a977]/30 animate-fade-in-up">
          <h3 className="font-bold text-lg text-[#f77f2f] dark:text-[#f8b78a] mb-4 flex items-center gap-2 uppercase tracking-wide">
            <FileImage className="w-5 h-5" />
            Aadhaar Card Image
          </h3>
          <div className="space-y-4">
    <div>
              <Label>Aadhaar Card Image</Label>
              <div className="flex items-center gap-4">
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAadhaarImageChange} 
                  className="rounded-xl border-2 border-dashed border-[#f8a977] bg-white/60 hover:bg-[#fff6f2] transition-all duration-200 cursor-pointer" 
                />
                {previewAadhaarImage && (
                  <div className="relative inline-block animate-fade-in">
                    <img 
                      src={previewAadhaarImage} 
                      alt="Aadhaar Preview" 
                      className="w-40 h-28 object-cover border-2 border-[#f8a977] shadow-lg rounded-xl backdrop-blur-md" 
                    />
                    <button
                      type="button"
                      onClick={removeAadhaarImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up">
          <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-[#f8a977]/30">
            <h3 className="font-bold text-lg text-[#f77f2f] dark:text-[#f8b78a] mb-4 uppercase tracking-wide">Bank Details</h3>
            <div className="space-y-3">
              <Input name="bankName" value={form.bankDetails.bankName} onChange={handleBankChange} placeholder="Bank Name" className="rounded-xl" />
              <Input name="accountNumber" value={form.bankDetails.accountNumber} onChange={handleBankChange} placeholder="Account Number" className="rounded-xl" />
              <Input name="ifsc" value={form.bankDetails.ifsc} onChange={handleBankChange} placeholder="IFSC Code" className="rounded-xl" />
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-[#f8a977]/30">
            <h3 className="font-bold text-lg text-[#f77f2f] dark:text-[#f8b78a] mb-4 uppercase tracking-wide">Emergency Contact</h3>
            <div className="space-y-3">
              <Input name="name" value={form.emergencyContact.name} onChange={handleEmergencyChange} placeholder="Contact Name" className="rounded-xl" />
              <Input name="mobile" value={form.emergencyContact.mobile} onChange={handleEmergencyChange} placeholder="Contact Mobile" className="rounded-xl" />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8 space-x-4 animate-fade-in-up">
          <Button
            type="button"
            onClick={() => navigate("/admin/employees")}
            className="px-10 py-3 text-lg rounded-2xl bg-gray-500 hover:bg-gray-600 text-white font-bold shadow-xl transition-all duration-200 focus:ring-4 focus:ring-[#f8a977]/40 focus:outline-none"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-10 py-3 text-lg rounded-2xl bg-gradient-to-r from-[#f77f2f] to-[#fca16a] hover:from-[#e96b12] hover:to-[#f98c3f] text-white font-bold shadow-xl transition-all duration-200 focus:ring-4 focus:ring-[#f8a977]/40 focus:outline-none"
            disabled={isUpdating}
          >
            {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Employee"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEmployee;
