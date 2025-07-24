import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Info, DollarSign, Image, Layers } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetFabricByIdMutation,
  useUpdateFabricMutation,
} from "@/features/api/fabricApi";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const fabricTypes = [
  "cotton",
  "silk",
  "linen",
  "polyester",
  "wool",
  "rayon",
  "other",
];

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
    if (!name || !type || !color || !pricePerMeter) {
      return toast.error("Name, Type, Color & Price per Meter are required.");
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
      navigate("/employee/fabrics");
    } else if (error) {
      toast.error(error?.data?.message || "Update failed");
    }
  }, [isSuccess, error]);

  return (
    <div className="min-h-screen dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/employee/fabrics')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Edit Fabric
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Update fabric details below
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Basic Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-600" />
                Basic Information
              </CardTitle>
              <CardDescription>Essential details about the fabric</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Fabric Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Premium Cotton"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fabric type" />
                    </SelectTrigger>
                    <SelectContent>
                      {fabricTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color *</Label>
                  <Input
                    id="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g., Navy Blue"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pattern">Pattern</Label>
                  <Input
                    id="pattern"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="e.g., Solid, Striped"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Stock Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                Pricing & Stock
              </CardTitle>
              <CardDescription>Set price and available stock</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="pricePerMeter">Price Per Meter (₹) *</Label>
                  <Input
                    id="pricePerMeter"
                    type="number"
                    value={pricePerMeter}
                    onChange={(e) => setPricePerMeter(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inStockMeters">In Stock (meters)</Label>
                  <Input
                    id="inStockMeters"
                    type="number"
                    value={inStockMeters}
                    onChange={(e) => setInStockMeters(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="w-5 h-5 mr-2 text-blue-600" />
                Fabric Images
              </CardTitle>
              <CardDescription>Upload images to showcase the fabric</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fabricImage">Primary Fabric Image</Label>
                  <Input
                    id="fabricImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {previewImage && (
                    <div className="mt-2">
                      <img
                        src={previewImage}
                        alt="Primary preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryFabricImage">Secondary Fabric Image</Label>
                  <Input
                    id="secondaryFabricImage"
                    type="file"
                    accept="image/*"
                    onChange={handleSecondaryImageChange}
                  />
                  {previewSecondaryImage && (
                    <div className="mt-2">
                      <img
                        src={previewSecondaryImage}
                        alt="Secondary preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layers className="w-5 h-5 mr-2 text-blue-600" />
                Description
              </CardTitle>
              <CardDescription>Additional details about the fabric</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Fabric description"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
            <Button 
              onClick={() => navigate("/employee/fabrics")}
              className="order-2 sm:order-1 border border-[#EB811F] text-[#EB811F] bg-white hover:bg-[#EB811F]/10 rounded"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate} 
              disabled={isLoading}
              className="bg-[#EB811F] hover:bg-[#EB811F]/90 text-white rounded order-1 sm:order-2"
            >
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
      </div>
    </div>
  );
};

export default UpdateFabric;
