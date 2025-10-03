import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  useGetBranchByIdMutation,
  useUpdateBranchMutation,
} from "@/features/api/branchApi";
import { Loader2 } from "lucide-react";

const UpdateBranch = () => {
  const [branchName, setBranchName] = useState("");
  const [address, setAddress] = useState("");
  const [gst, setGst] = useState("");
  const [pan, setPan] = useState("");
  const [cin, setCin] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [status, setStatus] = useState("active");

  const location = useLocation();
  const branchId = location.state?.branchId;
  const navigate = useNavigate();

  const [getBranchById, { data, isSuccess }] = useGetBranchByIdMutation();
  const [updateBranch, { isLoading, isSuccess: isUpdated, error }] = useUpdateBranchMutation();

  useEffect(() => {
    if (branchId) getBranchById({ branchId });
  }, [branchId]);

  useEffect(() => {
    if (isSuccess && data?.branch) {
      const b = data.branch;
      setBranchName(b.branchName || "");
      setAddress(b.address || "");
      setGst(b.gst || "");
      setPan(b.pan || "");
      setCin(b.cin || "");
      setPhone(b.phone || "");
      setEmail(b.email || "");
      setBankName(b.bankDetails?.bankName || "");
      setAccountNumber(b.bankDetails?.accountNumber || "");
      setIfsc(b.bankDetails?.ifsc || "");
      setStatus(b.status || "active");
    }
  }, [data, isSuccess]);

  const handleUpdate = async () => {
    await updateBranch({
      branchId,
      branchName,
      address,
      gst,
      pan,
      cin,
      phone,
      email,
      bankDetails: {
        bankName,
        accountNumber,
        ifsc,
      },
      status,
    });
  };

  useEffect(() => {
    if (isUpdated) {
      toast.success("Branch Updated Successfully");
      setTimeout(() => navigate("/employee/branches"), 1500);
    } else if (error) {
      toast.error(error?.data?.message || "Update failed");
    }
  }, [isUpdated, error]);

  return (
    <div className="md:mx-6 p-4 min-h-[100vh]">
      <div className="w-full md:max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Edit Branch</h2>
          <p className="text-gray-600 text-sm">Update the branch details below</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">Branch Name</Label>
              <Input
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="Enter branch name"
                className="h-8 text-sm bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">Address</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
                className="h-8 text-sm bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">GST Number</Label>
              <Input
                value={gst}
                onChange={(e) => setGst(e.target.value)}
                placeholder="Enter GST number"
                className="h-8 text-sm bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">PAN Number</Label>
              <Input
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                placeholder="Enter PAN number"
                className="h-8 text-sm bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">CIN (Corporate Identification Number)</Label>
              <Input
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                placeholder="Enter CIN number"
                className="h-8 text-sm bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">Phone Number</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="h-8 text-sm bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">Email Address</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="h-8 text-sm bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">Bank Name</Label>
              <Input
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Enter bank name"
                className="h-8 text-sm bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">Account Number</Label>
              <Input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number"
                className="h-8 text-sm bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">IFSC Code</Label>
              <Input
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                placeholder="Enter IFSC code"
                className="h-8 text-sm bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-8 text-sm bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md transition-all duration-200 hover:border-gray-400">
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
              Back
            </Button>
            <Button 
              onClick={handleUpdate} 
              disabled={isLoading}
              className="h-9 px-5 bg-orange-600 hover:bg-orange-700 text-white transition-all duration-200 shadow-sm hover:shadow-md text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Branch"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBranch;
