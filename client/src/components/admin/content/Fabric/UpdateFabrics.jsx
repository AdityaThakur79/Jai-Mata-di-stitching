import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetFabricByIdMutation,
  useUpdateFabricMutation,
} from "@/features/api/fabricApi";

const UpdateFabric = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fabricId = location.state?.fabricId;

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [pattern, setPattern] = useState("");
  const [pricePerMeter, setPricePerMeter] = useState("");
  const [inStockMeters, setInStockMeters] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [secondaryImage, setSecondaryImage] = useState(null);
  const [previewSecondaryImage, setPreviewSecondaryImage] = useState("");

  const [getFabricById, { data: fabricData }] = useGetFabricByIdMutation();
  const [updateFabric, { isLoading, isSuccess, error }] =
    useUpdateFabricMutation();

  useEffect(() => {
    if (fabricId) getFabricById(fabricId);
  }, [fabricId]);

  useEffect(() => {
    if (fabricData?.fabric) {
      const f = fabricData.fabric;
      setName(f.name);
      setType(f.type);
      setColor(f.color);
      setPattern(f.pattern || "");
      setPricePerMeter(f.pricePerMeter);
      setInStockMeters(f.inStockMeters);
      setDescription(f.description || "");
      setPreviewImage(f.fabricImage || "");
      setPreviewSecondaryImage(f.secondaryFabricImage || "");
    }
  }, [fabricData]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSecondaryImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSecondaryImage(file);
      setPreviewSecondaryImage(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!name || !color || !pricePerMeter) {
      return toast.error("Name, Color & Price per Meter are required.");
    }

    const formData = new FormData();
    formData.append("fabricId", fabricId);
    formData.append("name", name);
    formData.append("type", type);
    formData.append("color", color);
    formData.append("pattern", pattern);
    formData.append("pricePerMeter", pricePerMeter);
    formData.append("inStockMeters", inStockMeters);
    formData.append("description", description);
    if (image) formData.append("fabricImage", image);
    if (secondaryImage) formData.append("secondaryFabricImage", secondaryImage);

    await updateFabric(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Fabric updated successfully");
      navigate("/admin/fabrics");
    } else if (error) {
      toast.error(error?.data?.message || "Update failed");
    }
  }, [isSuccess, error]);

  return (
    <div className="p-4 md:p-8 min-h-[100vh]">
      <h1 className="text-xl font-semibold mb-4">Edit Fabric</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Type</Label>
          <Input value={type} onChange={(e) => setType(e.target.value)} />
        </div>
        <div>
          <Label>Color</Label>
          <Input value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <div>
          <Label>Pattern</Label>
          <Input value={pattern} onChange={(e) => setPattern(e.target.value)} />
        </div>
        <div>
          <Label>Price Per Meter</Label>
          <Input
            type="number"
            value={pricePerMeter}
            onChange={(e) => setPricePerMeter(e.target.value)}
          />
        </div>
        <div>
          <Label>In Stock (meters)</Label>
          <Input
            type="number"
            value={inStockMeters}
            onChange={(e) => setInStockMeters(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Description</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Fabric Image</Label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded border"
            />
          )}
        </div>
        <div className="md:col-span-2">
          <Label>Secondary Fabric Image</Label>
          <Input type="file" accept="image/*" onChange={handleSecondaryImageChange} />
          {previewSecondaryImage && (
            <img
              src={previewSecondaryImage}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded border"
            />
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 mt-6">
        <Button variant="outline" onClick={() => navigate("/admin/fabrics")}>Cancel</Button>
        <Button onClick={handleUpdate} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Updating...
            </>
          ) : (
            "Update Fabric"
          )}
        </Button>
      </div>
    </div>
  );
};

export default UpdateFabric;
