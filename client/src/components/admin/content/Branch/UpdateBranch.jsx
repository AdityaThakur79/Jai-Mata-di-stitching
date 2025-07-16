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
  const [scn, setScn] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
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
      setScn(b.scn || "");
      setPhone(b.phone || "");
      setEmail(b.email || "");
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
      scn,
      phone,
      email,
      status,
    });
  };

  useEffect(() => {
    if (isUpdated) {
      toast.success("Branch Updated Successfully");
      setTimeout(() => navigate("/admin/branches"), 1500);
    } else if (error) {
      toast.error(error?.data?.message || "Update failed");
    }
  }, [isUpdated, error]);

  return (
    <div className="flex-1 mx-4 md:mx-10 min-h-[100vh]">
      <div className="mb-4">
        <h1 className="font-bold text-xl">Edit Branch</h1>
        <p className="text-sm">Update branch details below.</p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Branch Name</Label>
          <Input
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            placeholder="Enter branch name"
          />
        </div>
        <div>
          <Label>Address</Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
          />
        </div>
        <div>
          <Label>GST</Label>
          <Input
            value={gst}
            onChange={(e) => setGst(e.target.value)}
            placeholder="Enter GST number"
          />
        </div>
        <div>
          <Label>PAN</Label>
          <Input
            value={pan}
            onChange={(e) => setPan(e.target.value)}
            placeholder="Enter PAN number"
          />
        </div>
        <div>
          <Label>SCN</Label>
          <Input
            value={scn}
            onChange={(e) => setScn(e.target.value)}
            placeholder="Enter SCN number"
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-6">
          <Button variant="outline" onClick={() => navigate("/admin/branches")}>Back</Button>
          <Button onClick={handleUpdate} disabled={isLoading}>
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
  );
};

export default UpdateBranch;
