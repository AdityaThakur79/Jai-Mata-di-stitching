import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateFabricMutation } from "@/features/api/fabricApi";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";

const CreateFabric = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [pattern, setPattern] = useState("");
  const [pricePerMeter, setPricePerMeter] = useState("");
  const [inStockMeters, setInStockMeters] = useState("");
  const [image, setImage] = useState(null);
  const [secondaryImage, setSecondaryImage] = useState(null);
  const [description, setDescription] = useState("");

  const [createFabric, { isLoading, isSuccess, isError, error, data }] =
    useCreateFabricMutation();

  const handleSubmit = async () => {
    if (!name || !type || !color || !pricePerMeter) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    formData.append("color", color);
    formData.append("pricePerMeter", pricePerMeter);
    if (pattern) formData.append("pattern", pattern);
    if (inStockMeters) formData.append("inStockMeters", inStockMeters);
    if (description) formData.append("description", description);
    if (image) formData.append("fabricImage", image);
    if (secondaryImage) formData.append("secondaryFabricImage", secondaryImage);

    await createFabric(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Fabric added successfully");
      navigate("/admin/fabrics");
    } else if (isError) {
      toast.error(error?.data?.message || "Failed to add fabric");
    }
  }, [isSuccess, isError]);

  return (
    <div className="md:mx-10 p-4 min-h-[100vh]">
      <h2 className="text-xl font-semibold mb-1">Add New Fabric</h2>
      <p className="text-sm mb-4 text-gray-500">Add fabric details below</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Name *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Fabric name"
          />
        </div>
        <div>
          <Label>Type *</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Select fabric type" />
            </SelectTrigger>
            <SelectContent>
              {["cotton", "silk", "linen", "polyester", "wool", "rayon", "other"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Color *</Label>
          <Input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Fabric color"
          />
        </div>
        <div>
          <Label>Pattern (Optional)</Label>
          <Input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Pattern name"
          />
        </div>
        <div>
          <Label>Price Per Meter (₹) *</Label>
          <Input
            type="number"
            value={pricePerMeter}
            onChange={(e) => setPricePerMeter(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label>In Stock Meters</Label>
          <Input
            type="number"
            value={inStockMeters}
            onChange={(e) => setInStockMeters(e.target.value)}
            placeholder="0"
          />
        </div>
          <div>
          <Label>Fabric Image (Optional)</Label>
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
          <Label>Secondary Fabric Image (Optional)</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setSecondaryImage(e.target.files?.[0])}
          />
          {secondaryImage && (
            <img
              src={URL.createObjectURL(secondaryImage)}
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
            placeholder="Fabric description"
          />
        </div>
       
      </div>

      <div className="flex gap-2 mt-6">
        <Button variant="outline" onClick={() => navigate("/admin/fabrics")}>
          Cancel
        </Button>
        <Button disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Add Fabric"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreateFabric;
