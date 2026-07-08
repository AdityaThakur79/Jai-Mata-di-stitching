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
      setHsnCode(f.hsnCode || "");
      setType(f.type);
      setColor(f.color);
      setPattern(f.pattern || "");
      setPricePerMeter(f.pricePerMeter ?? "");
      setInStockMeters(f.inStockMeters ?? "");
      setLength(f.length != null ? String(f.length) : "");
      setWidth(f.width != null ? String(f.width) : "");
      setFabricBarcodeCount(f.fabricBarcodeCount || "5");
      setThresholdValue(f.thresholdValue || "10");
      setRestockEmail(f.restockEmail || "");
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
    formData.append("hsnCode", hsnCode);
    formData.append("type", type);
    formData.append("color", color);
    formData.append("pattern", pattern);
    formData.append("pricePerMeter", pricePerMeter);
    formData.append("inStockMeters", inStockMeters === "" ? "0" : inStockMeters);
    formData.append("length", length === "" ? "0" : length);
    formData.append("width", width === "" ? "0" : width);
    formData.append("fabricBarcodeCount", fabricBarcodeCount);
    formData.append("thresholdValue", thresholdValue);
    formData.append("restockEmail", restockEmail);
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
                Edit Fabric
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
                Update fabric details below
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
                    onChange={handleImageChange}
                    className="h-9"
                  />
                  {previewImage && (
                    <div className="mt-2">
                      <img
                        src={previewImage}
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
                    onChange={handleSecondaryImageChange}
                    className="h-9"
                  />
                  {previewSecondaryImage && (
                    <div className="mt-2">
                      <img
                        src={previewSecondaryImage}
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
              onClick={handleUpdate} 
              disabled={isLoading}
              className="bg-[#EB811F] hover:bg-[#EB811F]/90 text-white rounded order-1 sm:order-2 h-9"
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
  );
};

export default UpdateFabric;
