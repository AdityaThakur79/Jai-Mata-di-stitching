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
import { Loader2, User } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateEmployeeMutation } from "@/features/api/employeeApi";

const genderOptions = ["male", "female", "other"];
const roleOptions = ["tailor", "manager", "biller", "director", "admin", "other"];

const CreateEmployee = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    gender: "",
    address: "",
    aadhaarNumber: "",
    role: "",
    joiningDate: "",
    bankDetails: { bankName: "", accountNumber: "", ifsc: "" },
    emergencyContact: { name: "", mobile: "" },
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [createEmployee, { isLoading, isSuccess, isError, error, data }] = useCreateEmployeeMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Employee created successfully");
      navigate("/admin/employees");
    } else if (isError) {
      toast.error(error?.data?.message || "Failed to create employee");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.role) {
      toast.error("Name, Mobile, and Role are required.");
      return;
    }
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("mobile", form.mobile);
    if (form.email) formData.append("email", form.email);
    if (form.gender) formData.append("gender", form.gender);
    if (form.address) formData.append("address", form.address);
    if (form.aadhaarNumber) formData.append("aadhaarNumber", form.aadhaarNumber);
    formData.append("role", form.role);
    if (form.joiningDate) formData.append("joiningDate", form.joiningDate);
    if (profileImage) formData.append("profileImage", profileImage);
    if (form.bankDetails.bankName || form.bankDetails.accountNumber || form.bankDetails.ifsc) {
      formData.append("bankDetails", JSON.stringify(form.bankDetails));
    }
    if (form.emergencyContact.name || form.emergencyContact.mobile) {
      formData.append("emergencyContact", JSON.stringify(form.emergencyContact));
    }
    await createEmployee(formData);
  };

  return (
    <div className="px-6 py-12 bg-gradient-to-tr from-[#fdfbff] to-[#fef9f9] dark:from-gray-900 dark:to-[#7d3c3c] min-h-[100vh]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10 space-y-10 border border-gray-200 dark:border-gray-800 animate-fade-in"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#f77f2f] dark:text-[#f8b78a] tracking-wide uppercase">Employee Registration</h2>
          <p className="text-gray-500 dark:text-gray-400">Please fill in the employee details below.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
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

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#fff6f2] dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-[#f77f2f] dark:text-[#f8b78a] mb-4">Bank Details</h3>
            <div className="space-y-3">
              <Input name="bankName" value={form.bankDetails.bankName} onChange={handleBankChange} placeholder="Bank Name" className="rounded-xl" />
              <Input name="accountNumber" value={form.bankDetails.accountNumber} onChange={handleBankChange} placeholder="Account Number" className="rounded-xl" />
              <Input name="ifsc" value={form.bankDetails.ifsc} onChange={handleBankChange} placeholder="IFSC Code" className="rounded-xl" />
            </div>
          </div>

          <div className="bg-[#fff6f2] dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-[#f77f2f] dark:text-[#f8b78a] mb-4">Emergency Contact</h3>
            <div className="space-y-3">
              <Input name="name" value={form.emergencyContact.name} onChange={handleEmergencyChange} placeholder="Contact Name" className="rounded-xl" />
              <Input name="mobile" value={form.emergencyContact.mobile} onChange={handleEmergencyChange} placeholder="Contact Mobile" className="rounded-xl" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="px-8 py-2 text-lg rounded-xl bg-gradient-to-r from-[#f77f2f] to-[#fca16a] hover:from-[#e96b12] hover:to-[#f98c3f] text-white font-semibold shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Employee"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployee;
