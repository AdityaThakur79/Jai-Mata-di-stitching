import React, { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useCreateStyleMutation } from "@/features/api/styleApi";
import { useGetAllItemMastersQuery } from "@/features/api/itemApi";

const CreateStyle = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [image, setImage] = useState(null);

  const { data: itemData } = useGetAllItemMastersQuery({ page: 1, limit: 100 });

  const [createStyle, { isLoading, isSuccess, isError, error, data }] =
    useCreateStyleMutation();

  const handleSubmit = async () => {
    if (!name || !category) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("status", status);
    if (description) formData.append("description", description);
    if (image) formData.append("styleImage", image);

    await createStyle(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Style created successfully");
      navigate("/admin/styles");
    } else if (isError) {
      toast.error(error?.data?.message || "Failed to create style");
    }
  }, [isSuccess, isError]);

  return (
    <div className="md:mx-10 p-4 min-h-[100vh]">
      <h2 className="text-xl font-semibold mb-1">Add New Style</h2>
      <p className="text-sm mb-4 text-gray-500">Add style details below</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Name *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Style name"
          />
        </div>

        <div>
          <Label>Item Master *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select item type" />
            </SelectTrigger>
            <SelectContent>
              {itemData?.items?.map((item) => (
                <SelectItem key={item._id} value={item._id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>


        <div>
          <Label>Style Image (Optional)</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0])}
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="mt-2 w-16 h-16 object-cover rounded"
            />
          )}
        </div>
        
        <div>
          <Label>Description (Optional)</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Style description"
          />
        </div>

        <div className="flex items-center gap-4 mt-2">
          <Label>Status</Label>
          <Switch checked={status} onCheckedChange={setStatus} />
          <span className="text-sm">{status ? "Active" : "Inactive"}</span>
        </div>
 
      </div>

      <div className="flex gap-2 mt-6">
        <Button variant="outline" onClick={() => navigate("/admin/styles")}>
          Cancel
        </Button>
        <Button disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Add Style"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreateStyle;
