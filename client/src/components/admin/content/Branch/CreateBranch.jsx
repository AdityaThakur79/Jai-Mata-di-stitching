import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { useCreateBranchMutation } from "@/features/api/branchApi";

const CreateBranch = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    branchName: "",
    address: "",
    gst: "",
    pan: "",
    scn: "",
    phone: "",
    email: "",
    status: "active",
  });

  const [createBranch, { isLoading, isSuccess, isError, error, data }] =
    useCreateBranchMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (val) => {
    setForm((prev) => ({ ...prev, status: val }));
  };

  const handleSubmit = async () => {
    if (!form.branchName || !form.address) {
      toast.error("Branch name and address are required");
      return;
    }

    await createBranch(form);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Branch created successfully");
      navigate("/employee/branches");
    } else if (isError) {
      toast.error(error?.data?.message || "Failed to create branch");
    }
  }, [isSuccess, isError]);

  return (
    <div className="md:mx-6 p-4 min-h-[100vh]">
      <div className="w-full md:max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Add New Branch</h2>
          <p className="text-gray-600 text-sm">Enter the branch details below</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">Branch Name</Label>
              <Input
                name="branchName"
                value={form.branchName}
                onChange={handleChange}
                placeholder="Enter branch name"
                className="h-8 text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">Address</Label>
              <Input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter branch address"
                className="h-8 text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">GST Number</Label>
              <Input
                name="gst"
                value={form.gst}
                onChange={handleChange}
                placeholder="Enter GST number"
                className="h-8 text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">PAN Number</Label>
              <Input
                name="pan"
                value={form.pan}
                onChange={handleChange}
                placeholder="Enter PAN number"
                className="h-8 text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">SCN</Label>
              <Input
                name="scn"
                value={form.scn}
                onChange={handleChange}
                placeholder="Enter SCN"
                className="h-8 text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">Phone Number</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter contact number"
                className="h-8 text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">Email Address</Label>
              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter branch email"
                className="h-8 text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">Status</Label>
              <Select value={form.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-8 text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md transition-all duration-200 hover:border-gray-400">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => navigate("/employee/branches")}
              className="h-9 px-4 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm"
            >
              Cancel
            </Button>
            <Button 
              disabled={isLoading} 
              onClick={handleSubmit}
              className="h-9 px-5 bg-orange-600 hover:bg-orange-700 text-white transition-all duration-200 shadow-sm hover:shadow-md text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Branch"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBranch;
