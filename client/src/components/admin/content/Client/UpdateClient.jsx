import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateClientMutation, useGetClientByIdMutation, useGetAllBranchesQuery } from "@/features/api/clientApi";
import { useGetEmployeeProfileQuery } from "@/features/api/employeeApi";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Users, Upload, User, MapPin, Phone, Mail, Calendar, Loader2 } from "lucide-react";

// Form Section Component
const FormSection = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
      <Icon className="w-4 h-4 text-gray-600" />
      <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
    </div>
    {children}
  </div>
);

// Form Field Component
const FormField = ({ label, required, children, className = "" }) => (
  <div className={`space-y-1 ${className}`}>
    <Label className="text-xs font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    {children}
  </div>
);

const UpdateClient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const clientId = location.state?.clientId;
  
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
  const [getClientById, { isLoading: isFetching }] = useGetClientByIdMutation();
  const { data: branchesData, isLoading: branchesLoading, error: branchesError } = useGetAllBranchesQuery();
  const { data: employeeData, isLoading: employeeLoading } = useGetEmployeeProfileQuery();


  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    dateOfBirth: "",
    gender: "",
    notes: "",
    isActive: true,
    branchId: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  // Get user's branch info
  const userBranch = employeeData?.employee?.branchId;
  const userRole = employeeData?.employee?.role;
  const isDirector = userRole === "director" || userRole === "superAdmin";

  // Debug form state
  console.log("Current form.branchId:", form.branchId);
  console.log("Available branches:", branchesData?.branches);


  // Fetch client data on component mount
  useEffect(() => {
    if (clientId) {
      fetchClientData();
    } else {
      toast.error("No client ID provided");
      navigate("/employee/clients");
    }
  }, [clientId]);

  // Update form when branches are loaded and client data is available
  useEffect(() => {
    if (branchesData?.branches && branchesData.branches.length > 0 && form.branchId && typeof form.branchId === 'object') {
      console.log("Updating form.branchId from object to string:", form.branchId._id);
      setForm(prev => ({
        ...prev,
        branchId: form.branchId._id
      }));
    }
  }, [branchesData, form.branchId]);

  const fetchClientData = async () => {
    try {
      const response = await getClientById(clientId);
      if (response.data?.success) {
        const client = response.data.client;
        console.log("Client data:", client);
        console.log("Client branchId:", client.branchId);
        console.log("Branch ID to set:", client.branchId?._id || client.branchId || "");
        setForm({
          name: client.name || "",
          email: client.email || "",
          mobile: client.mobile || "",
          address: client.address || "",
          city: client.city || "",
          state: client.state || "",
          pincode: client.pincode || "",
          dateOfBirth: client.dateOfBirth ? client.dateOfBirth.split('T')[0] : "",
          gender: client.gender || "",
          notes: client.notes || "",
          isActive: client.isActive !== undefined ? client.isActive : true,
          branchId: client.branchId?._id || client.branchId || "",
        });
        setExistingImage(client.profileImage);
        console.log("Form set with branchId:", client.branchId?._id || client.branchId || "");
      } else {
        toast.error("Failed to fetch client data");
        navigate("/employee/clients");
      }
    } catch (error) {
      console.error("Error fetching client:", error);
      toast.error("Error fetching client data");
      navigate("/employee/clients");
    }
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setProfileImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.name || !form.email || !form.mobile || !form.address || !form.city || !form.state || !form.pincode) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Mobile validation
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(form.mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      const formData = new FormData();
      
      // Add client ID
      formData.append("clientId", clientId);
      
      // Add form fields
      Object.keys(form).forEach(key => {
        if (form[key] !== undefined && form[key] !== null) {
          formData.append(key, form[key]);
        }
      });

      // Add profile image only if new one is selected
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await updateClient(formData);
      
      if (response.data?.success) {
        toast.success("Client updated successfully!");
        navigate("/employee/clients");
      } else {
        toast.error(response.data?.message || "Failed to update client");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("An error occurred while updating the client");
    }
  };

  if (isFetching || employeeLoading || branchesLoading) {
    return (
      <div className="min-h-screen py-4 px-2 sm:px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-600 rounded-full shadow-lg mb-3">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Update Client</h1>
          <p className="text-gray-600 text-sm">Modify client information</p>
        </div>

        <div className="space-y-4">
          {/* Basic Information */}
          <FormSection title="Basic Information" icon={User}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <FormField label="Full Name" required>
                <Input
                  placeholder="Enter client's full name"
                  value={form.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>
              
              <FormField label="Email Address" required>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>
              
              <FormField label="Mobile Number" required>
                <Input
                  placeholder="Enter 10-digit mobile number"
                  value={form.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>
              
              <FormField label="Gender">
                <Select value={form.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              
              <FormField label="Date of Birth">
                <Input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>

              <FormField label="Status">
                <Select value={form.isActive.toString()} onValueChange={(value) => handleInputChange("isActive", value === "true")}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </FormSection>

          {/* Branch Selection */}
          <FormSection title="Branch Selection" icon={MapPin}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField label="Select Branch" required>
                <Select 
                  value={form.branchId} 
                  onValueChange={(value) => {
                    console.log("Branch selected:", value);
                    handleInputChange("branchId", value);
                  }}
                  disabled={!isDirector && userBranch}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder={!isDirector && userBranch ? "Your assigned branch" : "Select a branch"} />
                  </SelectTrigger>
                  <SelectContent>
                    {branchesData?.branches && branchesData.branches.length > 0 ? (
                      branchesData.branches.map((branch) => (
                        <SelectItem key={branch._id} value={branch._id}>
                          {branch.branchName} - {branch.address}
                        </SelectItem>
                      ))
                    ) : branchesLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading branches...
                      </SelectItem>
                    ) : branchesError ? (
                      <SelectItem value="error" disabled>
                        Error loading branches: {branchesError.message || 'Unknown error'}
                      </SelectItem>
                    ) : (
                      <SelectItem value="no-branches" disabled>
                        No branches available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FormField>
              
              {!isDirector && userBranch && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>Branch is pre-assigned to your profile</span>
                </div>
              )}
            </div>
            
            {branchesData?.branches && branchesData.branches.length === 0 && (
              <p className="text-sm text-red-500">No branches available. Please contact administrator.</p>
            )}
          </FormSection>

          {/* Profile Image */}
          <FormSection title="Profile Image" icon={Upload}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Primary Image">
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="h-8 text-sm file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-orange-50 file:text-orange-700"
                  />
                  {(profileImagePreview || existingImage) && (
                    <img
                      src={profileImagePreview || existingImage}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded border"
                    />
                  )}
                </div>
              </FormField>
            </div>
          </FormSection>

          {/* Address Information */}
          <FormSection title="Address Information" icon={MapPin}>
            <div className="space-y-3">
              <FormField label="Address" required className="md:col-span-2 lg:col-span-3">
                <Textarea
                  placeholder="Enter complete address"
                  value={form.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="min-h-[60px] text-sm"
                />
              </FormField>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormField label="City" required>
                  <Input
                    placeholder="Enter city"
                    value={form.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="h-8 text-sm"
                  />
                </FormField>
                
                <FormField label="State" required>
                  <Input
                    placeholder="Enter state"
                    value={form.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="h-8 text-sm"
                  />
                </FormField>
                
                <FormField label="Pincode" required>
                  <Input
                    placeholder="Enter pincode"
                    value={form.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    className="h-8 text-sm"
                  />
                </FormField>
              </div>
            </div>
          </FormSection>

          {/* Additional Information */}
          <FormSection title="Additional Information" icon={Calendar}>
            <FormField label="Notes">
              <Textarea
                placeholder="Any additional notes about the client"
                value={form.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="min-h-[60px] text-sm"
              />
            </FormField>
          </FormSection>
        </div>

        {/* Submit Button */}
        <div className="flex justify-start pt-2">
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
              "Update Client"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateClient;