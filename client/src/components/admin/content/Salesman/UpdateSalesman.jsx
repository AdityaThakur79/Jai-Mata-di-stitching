import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetSalesmanByIdMutation,
  useUpdateSalesmanMutation,
} from "@/features/api/salesmanApi";
import { Switch } from "@/components/ui/switch";

const UpdateSalesman = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const salesmanId = location.state?.salesmanId;

  const [getSalesmanById, { data, isSuccess }] = useGetSalesmanByIdMutation();
  const [updateSalesman, { isLoading, isSuccess: isUpdated, error }] =
    useUpdateSalesmanMutation();

  useEffect(() => {
    if (salesmanId) getSalesmanById(salesmanId);
  }, [salesmanId]);

  useEffect(() => {
    if (isSuccess && data?.salesman) {
      const s = data.salesman;
      setName(s.name);
      setEmail(s.email);
      setStatus(s.status);
      setPreviewImage(s.photoUrl || "");
    }
  }, [data, isSuccess]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("salesmanId", salesmanId);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("status", status);
    if (profileImage) {
      formData.append("profilePhoto", profileImage);
    }

    await updateSalesman(formData);
  };

  useEffect(() => {
    if (isUpdated) {
      toast.success("Salesman Updated Successfully");
      setTimeout(() => navigate("/admin/salesmans"), 1500);
    } else if (error) {
      toast.error(error?.data?.message || "Failed to update salesman");
    }
  }, [isUpdated, error]);

  return (
    <div className="flex-1 mx-4 md:mx-10 min-h-[100vh]">
      <div className="mb-4">
        <h1 className="font-bold text-xl">Edit Salesman</h1>
        <p className="text-sm">Update salesman details below.</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Salesman name"
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
          />
        </div>

        <div>
          <Label>Profile Photo</Label>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          {previewImage && (
            <img
              src={previewImage}
              alt="Profile"
              className="w-24 h-24 mt-2 rounded-full object-cover border"
            />
          )}
        </div>

        <div className="flex items-center gap-4 mt-4">
          <Label>Status</Label>
          <Switch checked={status} onCheckedChange={(val) => setStatus(val)} />
          <span className="text-sm">{status ? "Active" : "Inactive"}</span>
        </div>

        <div className="flex gap-2 mt-6">
          <Button variant="outline" onClick={() => navigate("/admin/salesmans")}>
            Back
          </Button>
          <Button onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Salesman"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateSalesman;
