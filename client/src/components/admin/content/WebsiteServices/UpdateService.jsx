import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  useGetServiceByIdMutation, 
  useUpdateServiceMutation,
} from '@/features/api/serviceApi';
import {
  ArrowLeft,
  Plus,
  X,
  Upload,
  Star,
  DollarSign,
  Calendar,
  Tag,
  Settings,
  Image as ImageIcon,
  Save,
  Loader2,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import toast from 'react-hot-toast';

const UpdateService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get service ID from URL params or location state
  const serviceId = location.state?.serviceId || new URLSearchParams(location.search).get('id');
  
  // RTK Query hooks
  const [getServiceById, { isLoading: fetchLoading }] = useGetServiceByIdMutation();
  const [updateService, { isLoading: updateLoading }] = useUpdateServiceMutation();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    gender: '',
    category: '',
    subcategory: '',
    pricing: {
      basePrice: '',
      maxPrice: '',
      currency: 'INR',
      priceType: 'starting_from'
    },
    estimatedDays: '',
    features: [''],
    tags: [''],
    status: 'active',
    isPopular: false,
    isFeatured: false
  });

  const [serviceImage, setServiceImage] = useState(null);
  const [secondaryServiceImage, setSecondaryServiceImage] = useState(null);
  const [previewServiceImage, setPreviewServiceImage] = useState("");
  const [previewSecondaryServiceImage, setPreviewSecondaryServiceImage] = useState("");

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

  // Update form data when service data is loaded
  useEffect(() => {
    if (serviceId) {
      getServiceById(serviceId)
        .unwrap()
        .then((data) => {
          const service = data.service;
          setFormData({
            title: service.title || '',
            description: service.description || '',
            shortDescription: service.shortDescription || '',
            gender: service.gender || '',
            category: service.category || '',
            subcategory: service.subcategory || '',
            pricing: {
              basePrice: service.pricing?.basePrice?.toString() || '',
              maxPrice: service.pricing?.maxPrice?.toString() || '',
              currency: service.pricing?.currency || 'INR',
              priceType: service.pricing?.priceType || 'starting_from'
            },
            estimatedDays: service.estimatedDays?.toString() || '',
            features: service.features?.length > 0 ? service.features : [''],
            tags: service.tags?.length > 0 ? service.tags : [''],
            status: service.status || 'active',
            isPopular: service.isPopular || false,
            isFeatured: service.isFeatured || false
          });
          setPreviewServiceImage(service.serviceImage || "");
          setPreviewSecondaryServiceImage(service.secondaryServiceImage || "");
        })
        .catch((error) => {
          console.error('Error fetching service:', error);
          toast.error('Failed to fetch service data');
          navigate('/employee/website/services');
        });
    }
  }, [serviceId, getServiceById, navigate]);

  // Redirect if no service ID
  useEffect(() => {
    if (!serviceId) {
      toast.error('Service ID is required');
      navigate('/employee/website/services');
    }
  }, [serviceId, navigate]);

  const handleInputChange = (name, value) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (arrayName, index, value) => {
    setFormData(prev => {
      const newArray = [...prev[arrayName]];
        newArray[index] = value;
      return {
        ...prev,
        [arrayName]: newArray
      };
    });
  };

  const addArrayItem = (arrayName, defaultValue = '') => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultValue]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const handleServiceImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setServiceImage(file);
      setPreviewServiceImage(URL.createObjectURL(file));
    }
  };

  const handleSecondaryServiceImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSecondaryServiceImage(file);
      setPreviewSecondaryServiceImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.title || !formData.description || !formData.gender || !formData.category || !formData.pricing.basePrice || !formData.estimatedDays) {
        toast.error('Please fill in all required fields');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("serviceId", serviceId);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("estimatedDays", formData.estimatedDays);
      
      // Create pricing object
      const pricing = {
          basePrice: parseFloat(formData.pricing.basePrice),
        priceType: formData.pricing.priceType,
        currency: formData.pricing.currency
      };
      if (formData.pricing.maxPrice && formData.pricing.priceType === 'range') {
        pricing.maxPrice = parseFloat(formData.pricing.maxPrice);
      }
      formDataToSend.append("pricing", JSON.stringify(pricing));

      if (formData.shortDescription) formDataToSend.append("shortDescription", formData.shortDescription);
      if (formData.subcategory) formDataToSend.append("subcategory", formData.subcategory);

      // Filter out empty values from arrays
      const filteredFeatures = formData.features.filter(f => f.trim());
      const filteredTags = formData.tags.filter(t => t.trim());
      
      if (filteredFeatures.length > 0) formDataToSend.append("features", JSON.stringify(filteredFeatures));
      if (filteredTags.length > 0) formDataToSend.append("tags", JSON.stringify(filteredTags));
      
      formDataToSend.append("status", formData.status);
      formDataToSend.append("isPopular", formData.isPopular);
      formDataToSend.append("isFeatured", formData.isFeatured);
      
      if (serviceImage) formDataToSend.append("serviceImage", serviceImage);
      if (secondaryServiceImage) formDataToSend.append("secondaryServiceImage", secondaryServiceImage);

      await updateService(formDataToSend).unwrap();
        toast.success('Service updated successfully!');
      navigate('/employee/website/services');

    } catch (error) {
      console.error('Update service error:', error);
      toast.error(error?.data?.message || 'Failed to update service');
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#EB811F]" />
              <p className="text-gray-500">Loading service details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
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
                  Update Service
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Edit service details and settings
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
                Update the essential details of your service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Premium Business Suits"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Target Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
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
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => {
                      handleInputChange('category', value);
                      handleInputChange('subcategory', ''); // Reset subcategory
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select 
                    value={formData.subcategory} 
                    onValueChange={(value) => handleInputChange('subcategory', value)}
                    disabled={!formData.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.category && subcategories[formData.category]?.map((subcategory) => (
                        <SelectItem key={subcategory} value={subcategory}>
                          {subcategory}
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
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the service..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
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
                Update pricing structure and delivery timeline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="priceType">Price Type</Label>
                  <Select 
                    value={formData.pricing.priceType} 
                    onValueChange={(value) => handleInputChange('pricing.priceType', value)}
                  >
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
                    value={formData.pricing.basePrice}
                    onChange={(e) => handleInputChange('pricing.basePrice', e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
                {formData.pricing.priceType === 'range' && (
                  <div className="space-y-2">
                    <Label htmlFor="maxPrice">Max Price (₹)</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      value={formData.pricing.maxPrice}
                      onChange={(e) => handleInputChange('pricing.maxPrice', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedDays">Estimated Completion Days *</Label>
                <Input
                  id="estimatedDays"
                  type="text"
                  value={formData.estimatedDays}
                  onChange={(e) => handleInputChange('estimatedDays', e.target.value)}
                  placeholder="7 or 7-10"
                  required
                />
                <p className="text-xs text-gray-500">
                  Enter single number (e.g., "7") or range (e.g., "7-10")
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-[#EB811F]" />
                Service Features
              </CardTitle>
              <CardDescription>
                Update the key features that highlight your service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleArrayChange('features', index, e.target.value)}
                      placeholder="Enter feature..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem('features', index)}
                      disabled={formData.features.length === 1}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('features', '')}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Service Images Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-[#EB811F]" />
                Service Images
              </CardTitle>
              <CardDescription>
                Update images to showcase your service
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
                    onChange={handleServiceImageChange}
                  />
                  {previewServiceImage && (
                    <div className="mt-2">
                      <img
                        src={previewServiceImage}
                        alt="Primary service image preview"
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
                    onChange={handleSecondaryServiceImageChange}
                  />
                  {previewSecondaryServiceImage && (
                    <div className="mt-2">
                      <img
                        src={previewSecondaryServiceImage}
                        alt="Secondary service image preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags & SEO Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="w-5 h-5 mr-2 text-[#EB811F]" />
                Tags & SEO
              </CardTitle>
              <CardDescription>
                Update tags to improve searchability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={tag}
                      onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                      placeholder="Enter search tag..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem('tags', index)}
                      disabled={formData.tags.length === 1}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('tags', '')}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tag
                </Button>
                <p className="text-xs text-gray-500">
                  Add tags to help customers find this service more easily
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Service Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2 text-[#EB811F]" />
                Service Settings
              </CardTitle>
              <CardDescription>
                Configure service status and visibility options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="status">Service Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
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
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => handleInputChange('isPopular', checked)}
                  />
                  <Label htmlFor="isPopular" className="cursor-pointer">
                    Mark as Popular Service
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
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
              type="button"
              variant="outline"
              onClick={() => navigate('/employee/website/services')}
              disabled={updateLoading}
              className="order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={updateLoading}
              className="bg-[#EB811F] hover:bg-[#EB811F]/90 order-1 sm:order-2"
            >
              {updateLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating Service...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Service
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateService; 