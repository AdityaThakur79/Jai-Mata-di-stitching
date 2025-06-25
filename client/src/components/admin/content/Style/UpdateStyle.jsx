import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import toast from "react-hot-toast";

import {
  useGetStyleByIdMutation,
  useUpdateStyleMutation,
} from "@/features/api/styleApi";
import { useGetAllItemMastersQuery } from "@/features/api/itemApi";

const UpdateStyle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const styleId = location.state?.styleId;

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [getStyleById, { data: styleData }] = useGetStyleByIdMutation();
  const [updateStyle, { isLoading, isSuccess, isError, error, data }] =
    useUpdateStyleMutation();
  const { data: itemData } = useGetAllItemMastersQuery({ page: 1, limit: 100 });

  useEffect(() => {
    if (styleId) getStyleById(styleId);
  }, [styleId]);

  useEffect(() => {
    if (styleData?.style) {
      const s = styleData.style;
      setName(s.name);
      setCategory(s.category?._id || "");
      setDescription(s.description || "");
      setStatus(s.status);
      setPreviewImage(s.styleImage || "");
    }
  }, [styleData]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!name || !category) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("styleId", styleId);
    formData.append("name", name);
    formData.append("category", category);
    formData.append("status", status);
    if (description) formData.append("description", description);
    if (image) formData.append("styleImage", image);

    await updateStyle(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Style updated successfully");
      navigate("/admin/styles");
    } else if (isError) {
      toast.error(error?.data?.message || "Failed to update style");
    }
  }, [isSuccess, isError]);

  return (
    <div className="md:mx-10 p-4 min-h-[100vh]">
      <h2 className="text-xl font-semibold mb-1">Edit Style</h2>
      <p className="text-sm mb-4 text-gray-500">Update style details below</p>

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
            onChange={handleImageChange}
          />
          {previewImage && (
            <img
              src={previewImage}
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
        <Button disabled={isLoading} onClick={handleUpdate}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Style"
          )}
        </Button>
      </div>
    </div>
  );
};

export default UpdateStyle;
