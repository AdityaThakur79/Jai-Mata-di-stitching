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
  const [hsnCode, setHsnCode] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [pattern, setPattern] = useState("");
  const [pricePerMeter, setPricePerMeter] = useState("");
  const [inStockMeters, setInStockMeters] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [fabricBarcodeCount, setFabricBarcodeCount] = useState("5");
  const [thresholdValue, setThresholdValue] = useState("10");
  const [restockEmail, setRestockEmail] = useState("");
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
    formData.append("hsnCode", hsnCode);
    formData.append("type", type);
    formData.append("color", color);
    formData.append("pricePerMeter", pricePerMeter);
    if (pattern) formData.append("pattern", pattern);
    if (inStockMeters) formData.append("inStockMeters", inStockMeters);
    if (length) formData.append("length", length);
    if (width) formData.append("width", width);
    if (fabricBarcodeCount) formData.append("fabricBarcodeCount", fabricBarcodeCount);
    if (thresholdValue) formData.append("thresholdValue", thresholdValue);
    if (restockEmail) formData.append("restockEmail", restockEmail);
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
    <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/employee/fabrics')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Add New Fabric
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
                Add fabric details below
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Information Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base">
                <Info className="w-4 h-4 mr-2 text-blue-600" />
                Basic Information
              </CardTitle>
              <CardDescription className="text-sm">Essential details about the fabric</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm">Fabric Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Premium Cotton"
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hsnCode" className="text-sm">HSN Code</Label>
                  <Input
                    id="hsnCode"
                    value={hsnCode}
                    onChange={(e) => setHsnCode(e.target.value)}
                    placeholder="e.g., 52081100"
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm">Type *</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="h-9">
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
                  <Label htmlFor="color" className="text-sm">Color *</Label>
                  <Input
                    id="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g., Navy Blue"
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pattern" className="text-sm">Pattern</Label>
                  <Input
                    id="pattern"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="e.g., Solid, Striped"
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fabricBarcodeCount" className="text-sm">Barcode Count (5-10)</Label>
                  <Input
                    id="fabricBarcodeCount"
                    type="number"
                    min="5"
                    max="10"
                    value={fabricBarcodeCount}
                    onChange={(e) => setFabricBarcodeCount(e.target.value)}
                    placeholder="5"
                    className="h-9"
                  />
                  <p className="text-xs text-gray-500">Number of barcode stickers to generate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Stock Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base">
                <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                Pricing & Stock
              </CardTitle>
              <CardDescription className="text-sm">Set price and available stock</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pricePerMeter" className="text-sm">Price Per Meter (₹) *</Label>
                  <Input
                    id="pricePerMeter"
                    type="number"
                    value={pricePerMeter}
                    onChange={(e) => setPricePerMeter(e.target.value)}
                    placeholder="0.00"
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inStockMeters" className="text-sm">In Stock (meters)</Label>
                  <Input
                    id="inStockMeters"
                    type="number"
                    value={inStockMeters}
                    onChange={(e) => setInStockMeters(e.target.value)}
                    placeholder="0"
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="length" className="text-sm">Length (meters)</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.01"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="0.00"
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width" className="text-sm">Width (meters)</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.01"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="0.00"
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thresholdValue" className="text-sm">Threshold Value (meters)</Label>
                  <Input
                    id="thresholdValue"
                    type="number"
                    value={thresholdValue}
                    onChange={(e) => setThresholdValue(e.target.value)}
                    placeholder="10"
                    className="h-9"
                  />
                  <p className="text-xs text-gray-500">Alert when stock falls below this value</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restockEmail" className="text-sm">Restock Notification Email</Label>
                  <Input
                    id="restockEmail"
                    type="email"
                    value={restockEmail}
                    onChange={(e) => setRestockEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="h-9"
                  />
                  <p className="text-xs text-gray-500">Email for low stock alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base">
                <Image className="w-4 h-4 mr-2 text-blue-600" />
                Fabric Images
              </CardTitle>
              <CardDescription className="text-sm">Upload images to showcase the fabric</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fabricImage" className="text-sm">Primary Fabric Image</Label>
                  <Input
                    id="fabricImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0])}
                    className="h-9"
                  />
                  {image && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Primary preview"
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryFabricImage" className="text-sm">Secondary Fabric Image</Label>
                  <Input
                    id="secondaryFabricImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSecondaryImage(e.target.files?.[0])}
                    className="h-9"
                  />
                  {secondaryImage && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(secondaryImage)}
                        alt="Secondary preview"
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base">
                <Layers className="w-4 h-4 mr-2 text-blue-600" />
                Description
              </CardTitle>
              <CardDescription className="text-sm">Additional details about the fabric</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="description" className="text-sm">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Fabric description"
                className="h-9 mt-2"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button 
              onClick={() => navigate("/employee/fabrics")}
              className="order-2 sm:order-1 border border-[#EB811F] text-[#EB811F] bg-white hover:bg-[#EB811F]/10 rounded h-9"
            >
              Cancel
            </Button>
            <Button 
              disabled={isLoading} 
              onClick={handleSubmit}
              className="bg-[#EB811F] hover:bg-[#EB811F]/90 text-white rounded order-1 sm:order-2 h-9"
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
  );
};

export default CreateFabric;
