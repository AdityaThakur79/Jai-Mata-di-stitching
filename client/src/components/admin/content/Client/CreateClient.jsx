import React, { useState, useEffect, useRef } from "react";
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
import { useCreateClientMutation } from "@/features/api/clientApi";
import { useGetEmployeeProfileQuery } from "@/features/api/employeeApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Users, Upload, User, MapPin, Phone, Mail, Calendar, Loader2 } from "lucide-react";
import { useGetAllBranchesQuery } from "@/features/api/branchApi";

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

const CreateClient = () => {
  const navigate = useNavigate();
  const [createClient, { isLoading }] = useCreateClientMutation();
  const { data: branchesData, isLoading: branchesLoading } = useGetAllBranchesQuery({ page: 1, limit: 100 });
  const { data: employeeData, isLoading: employeeLoading } = useGetEmployeeProfileQuery();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
    branchId: "",
    gstin: "",
    pan: "",
    businessName: "",
    tradeName: "",
    legalName: "",
    businessType: "",
    gstStatus: "",
    gstStateCode: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [lookupMode] = useState("gstin");

  // Auto-fill city/state based on pincode
  useEffect(() => {
    const pincode = (form.pincode || "").trim();
    if (pincode && /^[0-9]{6}$/.test(pincode)) {
      const fetchPincodeDetails = async () => {
        try {
          const attempts = [
            () => fetch(`https://www.postalpincode.in/api/pincode/${pincode}`),
            () => fetch(`https://api.postalpincode.in/pincode/${pincode}`),
            () => fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`http://www.postalpincode.in/api/pincode/${pincode}`)}`),
            () => fetch(`https://cors-anywhere.herokuapp.com/https://www.postalpincode.in/api/pincode/${pincode}`),
            () => fetch(`https://thingproxy.freeboard.io/fetch/https://www.postalpincode.in/api/pincode/${pincode}`),
          ];

          let data = null;
          for (const attempt of attempts) {
            try {
              const res = await attempt();
              if (!res.ok) continue;
              data = await res.json();
              break;
            } catch (_) {}
          }

          if (data) {
            const arr = Array.isArray(data) ? data : [data];
            const first = arr[0];
            const offices = first?.PostOffice || [];
            if (offices.length > 0) {
              const po = offices[0];
              setForm(prev => ({
                ...prev,
                city: po?.District || prev.city,
                state: po?.State || prev.state,
              }));
            }
          }
        } catch (_) {
          // ignore
        }
      };
      fetchPincodeDetails();
    }
  }, [form.pincode]);

  // Get user's branch info
  const userBranch = employeeData?.employee?.branchId;
  const userRole = employeeData?.employee?.role;
  const isDirector = userRole === "director" || userRole === "superAdmin";

  // Set default branch if user has one
  useEffect(() => {
    if (userBranch && !isDirector) {
      setForm(prev => ({
        ...prev,
        branchId: userBranch
      }));
    }
  }, [userBranch, isDirector]);

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

    // Branch validation
    if (branchesData?.branches && branchesData.branches.length > 0 && !form.branchId) {
      toast.error("Please select a branch");
      return;
    }
    
    // If no branches are available, show error
    if (branchesData?.branches && branchesData.branches.length === 0) {
      toast.error("No branches available. Please contact administrator.");
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
      
      // Add form fields
      Object.keys(form).forEach(key => {
        if (form[key]) {
          formData.append(key, form[key]);
        }
      });

      // Add profile image
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await createClient(formData);
      
      if (response.data?.success) {
        toast.success("Client created successfully!");
        navigate("/employee/clients");
      } else {
        toast.error(response.data?.message || "Failed to create client");
      }
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("An error occurred while creating the client");
    }
  };

  const handleLookup = async () => {};

  if (employeeLoading || branchesLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create New Client</h1>
          <p className="text-gray-600 text-sm">Add a new client to the system</p>
        </div>

        <div className="space-y-4">
          {/* Basic Information */}
          <FormSection title="Basic Information" icon={User}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormField label="GSTIN">
                  <Input
                    placeholder="Enter GSTIN"
                    value={form.gstin}
                    onChange={(e) => handleInputChange("gstin", e.target.value.toUpperCase())}
                    className="h-8 text-sm"
                  />
                </FormField>
              </div>

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
              
              
            </div>
          </FormSection>

          {/* Removed extra business fields as per requirement. Name will be auto-set from GST. */}

          {/* Branch Selection */}
          <FormSection title="Branch Selection" icon={MapPin}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField label="Select Branch" required>
                <Select 
                  value={form.branchId} 
                  onValueChange={(value) => handleInputChange("branchId", value)}
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
                    ) : (
                      <SelectItem value="loading" disabled>
                        Loading branches...
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
                  {profileImagePreview && (
                    <img
                      src={profileImagePreview}
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
            disabled={isLoading}
            className="h-9 px-6 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md shadow-sm transition-colors text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Client"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateClient;
