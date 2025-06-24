import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateMasterMutation } from "@/features/api/masterApi";

const CreateMaster = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [createMaster, { isLoading, isSuccess, isError, error, data }] =
    useCreateMasterMutation();

  const handleSubmit = async () => {
    if (!name || !mobile) return toast.error("Name and Mobile are required.");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobile", mobile);
    if (email) formData.append("email", email);
    if (password) formData.append("password", password);
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);

    await createMaster(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Master created successfully");
      navigate("/admin/masters");
    } else if (isError) {
      toast.error(error?.data?.message || "Failed to create master");
    }
  }, [isSuccess, isError]);

  return (
    <div className="md:mx-10 p-4 min-h-[100vh]">
      <h2 className="text-xl font-semibold mb-1">Add New Master</h2>
      <p className="text-sm mb-4 text-gray-500">
        Basic details for the stitching master
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Master's Name"
          />
        </div>
        <div>
          <Label>Mobile</Label>
          <Input
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Mobile Number"
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Set a password"
          />
        </div>
        <div>
          <Label>Profile Photo (Optional)</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePhoto(e.target.files?.[0])}
          />
          {profilePhoto && (
            <img
              src={URL.createObjectURL(profilePhoto)}
              alt="Preview"
              className="mt-2 w-16 h-16 rounded-full object-cover"
            />
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <Button variant="outline" onClick={() => navigate("/admin/masters")}>
          Cancel
        </Button>
        <Button disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Master"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreateMaster;
