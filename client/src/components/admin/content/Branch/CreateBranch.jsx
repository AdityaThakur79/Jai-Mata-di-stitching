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
      navigate("/admin/branches");
    } else if (isError) {
      toast.error(error?.data?.message || "Failed to create branch");
    }
  }, [isSuccess, isError]);

  return (
    <div className="md:mx-10 p-4 min-h-[100vh]">
      <h2 className="text-xl font-semibold mb-1">Add New Branch</h2>
      <p className="text-sm mb-4 text-gray-500">Branch details</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Branch Name</Label>
          <Input
            name="branchName"
            value={form.branchName}
            onChange={handleChange}
            placeholder="Branch Name"
          />
        </div>
        <div>
          <Label>Address</Label>
          <Input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Branch Address"
          />
        </div>
        <div>
          <Label>GST</Label>
          <Input
            name="gst"
            value={form.gst}
            onChange={handleChange}
            placeholder="GST Number"
          />
        </div>
        <div>
          <Label>PAN</Label>
          <Input
            name="pan"
            value={form.pan}
            onChange={handleChange}
            placeholder="PAN Number"
          />
        </div>
        <div>
          <Label>SCN</Label>
          <Input
            name="scn"
            value={form.scn}
            onChange={handleChange}
            placeholder="SCN"
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Contact Number"
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Branch Email"
          />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={form.status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <Button variant="outline" onClick={() => navigate("/admin/branches")}>
          Cancel
        </Button>
        <Button disabled={isLoading} onClick={handleSubmit}>
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
  );
};

export default CreateBranch;
