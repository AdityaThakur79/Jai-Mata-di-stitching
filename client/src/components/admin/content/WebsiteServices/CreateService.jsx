import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Info, DollarSign, Star, Tag, Settings, Image, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateServiceMutation } from "@/features/api/serviceApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const CreateService = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceType, setPriceType] = useState("starting_from");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [features, setFeatures] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("active");
  const [isPopular, setIsPopular] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [serviceImage, setServiceImage] = useState(null);
  const [secondaryServiceImage, setSecondaryServiceImage] = useState(null);

  const [createService, { isLoading, isSuccess, isError, error, data }] =
    useCreateServiceMutation();

  const categories = [
    'Formal Wear',
    'Traditional Wear',
    'Office Wear',
    'Casual Wear',
    'Bridal Wear',
    'Cultural Wear',
    'Corporate Wear',
    'Ethnic Wear',
    'Alterations'
  ];

  const subcategories = {
    'Formal Wear': ['Suits', 'Blazers', 'Formal Shirts', 'Formal Trousers', 'Tuxedos'],
    'Traditional Wear': ['Kurtas', 'Sherwanis', 'Dhoti', 'Pajamas'],
    'Bridal Wear': ['Lehengas', 'Sarees', 'Bridal Blouses', 'Wedding Suits'],
    'Ethnic Wear': ['Kurtas', 'Kurtis', 'Palazzo', 'Salwar Suits'],
    'Office Wear': ['Shirts', 'Trousers', 'Skirts', 'Blazers'],
    'Casual Wear': ['T-shirts', 'Jeans', 'Casual Shirts', 'Shorts'],
    'Alterations': ['Hemming', 'Taking In', 'Letting Out', 'Repairs']
  };

  const handleSubmit = async () => {
    if (!title || !description || !gender || !category || !basePrice || !estimatedDays) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("gender", gender);
    formData.append("category", category);
    formData.append("estimatedDays", estimatedDays);
    
    // Create pricing object
    const pricing = {
      basePrice: parseFloat(basePrice),
      priceType,
      currency: 'INR'
    };
    if (maxPrice && priceType === 'range') {
      pricing.maxPrice = parseFloat(maxPrice);
    }
    formData.append("pricing", JSON.stringify(pricing));

    if (shortDescription) formData.append("shortDescription", shortDescription);
    if (subcategory) formData.append("subcategory", subcategory);
    if (features) formData.append("features", JSON.stringify(features.split(',').map(f => f.trim()).filter(f => f)));
    if (tags) formData.append("tags", JSON.stringify(tags.split(',').map(t => t.trim()).filter(t => t)));
    formData.append("status", status);
    formData.append("isPopular", isPopular);
    formData.append("isFeatured", isFeatured);
    if (serviceImage) formData.append("serviceImage", serviceImage);
    if (secondaryServiceImage) formData.append("secondaryServiceImage", secondaryServiceImage);

    await createService(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Service created successfully");
      navigate("/employee/website/services");
    } else if (isError) {
      toast.error(error?.data?.message || "Failed to create service");
    }
  }, [isSuccess, isError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/employee/website/services')}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Create New Service
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Add a new tailoring service to your catalog
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Basic Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2 text-[#EB811F]" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Essential details about your service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Premium Business Suits"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Target Gender *</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={(value) => {
                    setCategory(value);
                    setSubcategory(""); // Reset subcategory when category changes
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select value={subcategory} onValueChange={setSubcategory} disabled={!category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {category && subcategories[category]?.map((subcat) => (
                        <SelectItem key={subcat} value={subcat}>
                          {subcat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Service Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the service..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Brief description for cards and previews..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Timeline Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-[#EB811F]" />
                Pricing & Timeline
              </CardTitle>
              <CardDescription>
                Set pricing structure and delivery timeline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="priceType">Price Type</Label>
                  <Select value={priceType} onValueChange={setPriceType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                      <SelectItem value="starting_from">Starting From</SelectItem>
                      <SelectItem value="range">Price Range</SelectItem>
                      <SelectItem value="custom_quote">Custom Quote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price (₹) *</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                {priceType === 'range' && (
                  <div className="space-y-2">
                    <Label htmlFor="maxPrice">Max Price (₹)</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedDays">Estimated Completion Days *</Label>
                <Input
                  id="estimatedDays"
                  type="text"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                  placeholder="7 or 7-10"
                  required
                />
                <p className="text-xs text-gray-500">
                  Enter single number (e.g., "7") or range (e.g., "7-10")
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features & Tags Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-[#EB811F]" />
                Features & Tags
              </CardTitle>
              <CardDescription>
                Highlight key features and add searchable tags
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="features">Key Features (comma-separated)</Label>
                <Input
                  id="features"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="Perfect fit, Premium fabrics, Multiple fittings"
                />
                <p className="text-xs text-gray-500">
                  Separate each feature with a comma
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Search Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="suit, formal, business, premium"
                />
                <p className="text-xs text-gray-500">
                  Add tags to help customers find this service
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Images Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="w-5 h-5 mr-2 text-[#EB811F]" />
                Service Images
              </CardTitle>
              <CardDescription>
                Upload images to showcase your service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="serviceImage">Primary Service Image</Label>
                  <Input
                    id="serviceImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setServiceImage(e.target.files?.[0])}
                  />
                  {serviceImage && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(serviceImage)}
                        alt="Primary preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryServiceImage">Secondary Service Image</Label>
                  <Input
                    id="secondaryServiceImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSecondaryServiceImage(e.target.files?.[0])}
                  />
                  {secondaryServiceImage && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(secondaryServiceImage)}
                        alt="Secondary preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2 text-[#EB811F]" />
                Service Settings
              </CardTitle>
              <CardDescription>
                Configure service visibility and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="status">Service Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPopular"
                    checked={isPopular}
                    onCheckedChange={setIsPopular}
                  />
                  <Label htmlFor="isPopular" className="cursor-pointer">
                    Mark as Popular Service
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={isFeatured}
                    onCheckedChange={setIsFeatured}
                  />
                  <Label htmlFor="isFeatured" className="cursor-pointer">
                    Mark as Featured Service
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate("/employee/website/services")}
              className="order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              disabled={isLoading} 
              onClick={handleSubmit}
              className="bg-[#EB811F] hover:bg-[#EB811F]/90 order-1 sm:order-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Service...
                </>
              ) : (
                "Create Service"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateService; 