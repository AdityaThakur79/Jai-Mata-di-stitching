import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Info, DollarSign, Image, Layers, Settings } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateFabricMutation } from "@/features/api/fabricApi";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const fabricTypes = [
  "cotton",
  "silk",
  "linen",
  "polyester",
  "wool",
  "rayon",
  "other",
];

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
      navigate("/employee/fabrics");
    } else if (isError) {
      toast.error(error?.data?.message || "Failed to add fabric");
    }
  }, [isSuccess, isError]);

  return (
    <div className="min-h-screen  dark:from-gray-900 dark:to-gray-800">
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
                Add New Fabric
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Add fabric details below
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
                    onChange={(e) => setImage(e.target.files?.[0])}
                  />
                  {image && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(image)}
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
                    onChange={(e) => setSecondaryImage(e.target.files?.[0])}
                  />
                  {secondaryImage && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(secondaryImage)}
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
              disabled={isLoading} 
              onClick={handleSubmit}
              className="bg-[#EB811F] hover:bg-[#EB811F]/90 text-white rounded order-1 sm:order-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Fabric...
                </>
              ) : (
                "Add Fabric"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFabric;
