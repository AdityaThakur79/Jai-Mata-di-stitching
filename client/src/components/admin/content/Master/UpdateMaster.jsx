import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetMasterByIdMutation,
  useUpdateMasterMutation,
} from "@/features/api/masterApi";
import { Switch } from "@/components/ui/switch";

const UpdateMaster = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const masterId = location.state?.masterId;

  const [getMasterById, { data, isSuccess }] = useGetMasterByIdMutation();
  const [updateMaster, { isLoading, isSuccess: isUpdated, error }] =
    useUpdateMasterMutation();

  useEffect(() => {
    if (masterId) getMasterById(masterId);
  }, [masterId]);

  useEffect(() => {
    if (isSuccess && data?.master) {
      const m = data.master;
      setName(m.name);

      setEmail(m.email);
      setStatus(m.status);
      setPreviewImage(m.photoUrl || "");
    }
  }, [data, isSuccess]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("masterId", masterId);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("status", status);
    if (profileImage) {
      formData.append("profilePhoto", profileImage);
    }

    await updateMaster(formData);
  };

  useEffect(() => {
    if (isUpdated) {
      toast.success("Master Updated Successfully");
      setTimeout(() => navigate("/admin/masters"), 1500);
    } else if (error) {
      toast.error(error?.data?.message || "Failed to update master");
    }
  }, [isUpdated, error]);

  return (
    <div className="flex-1 mx-4 md:mx-10 min-h-[100vh]">
      <div className="mb-4">
        <h1 className="font-bold text-xl">Edit Master</h1>
        <p className="text-sm">Update master details below.</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Master name"
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
          <Button variant="outline" onClick={() => navigate("/admin/masters")}>
            Back
          </Button>
          <Button onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Master"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateMaster;
