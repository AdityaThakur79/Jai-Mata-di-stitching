import React, { useState } from 'react';
import { useCreateCategoryMutation } from '@/features/api/categoriesApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Image as ImageIcon, Info, ListOrdered, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreateCategory = () => {
  const [form, setForm] = useState({
    title: '',
    shortDesc: '',
    features: '',
    startingFrom: '',
    category: '',
    order: 1
  });
  const [primaryImageFile, setPrimaryImageFile] = useState(null);
  const [secondaryImageFile, setSecondaryImageFile] = useState(null);
  const [primaryPreview, setPrimaryPreview] = useState('');
  const [secondaryPreview, setSecondaryPreview] = useState('');
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePrimaryImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrimaryImageFile(file);
      setPrimaryPreview(URL.createObjectURL(file));
    }
  };
  const handleSecondaryImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSecondaryImageFile(file);
      setSecondaryPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.startingFrom || !form.category || !primaryImageFile) {
      toast.error('Title, starting from, category, and primary image are required');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('shortDesc', form.shortDesc);
      formData.append('features', form.features);
      formData.append('startingFrom', form.startingFrom);
      formData.append('category', form.category);
      formData.append('order', form.order);
      formData.append('categoryPrimaryImage', primaryImageFile);
      if (secondaryImageFile) {
        formData.append('categorySecondaryImage', secondaryImageFile);
      }
      await createCategory(formData).unwrap();
      toast.success('Category created');
      navigate('/employee/website/categories');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create category');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/employee/website/categories')} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Category/Item</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Add a new category/item for stitching</p>
          </div>
        </div>
        <div className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2 text-[#EB811F]" />
                Basic Information
              </CardTitle>
              <CardDescription>Details about the category/item</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={e => handleChange('title', e.target.value)}
                  placeholder="Category/Item title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortDesc">Short Description</Label>
                <Input
                  id="shortDesc"
                  value={form.shortDesc}
                  onChange={e => handleChange('shortDesc', e.target.value)}
                  placeholder="Short description (optional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={form.category}
                  onChange={e => handleChange('category', e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select category</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Features Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-[#EB811F]" />
                Features
              </CardTitle>
              <CardDescription>Comma separated features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="features">Features</Label>
                <Input
                  id="features"
                  value={form.features}
                  onChange={e => handleChange('features', e.target.value)}
                  placeholder="e.g. Custom fit, Premium fabric, Fast delivery"
                />
                <p className="text-xs text-gray-500">Separate each feature with a comma</p>
              </div>
            </CardContent>
          </Card>

          {/* Images Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-[#EB811F]" />
                Images
              </CardTitle>
              <CardDescription>Upload images (primary required)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="categoryPrimaryImage">Primary Image *</Label>
                <Input
                  id="categoryPrimaryImage"
                  type="file"
                  accept="image/*"
                  onChange={handlePrimaryImageChange}
                  required
                />
                {primaryPreview && (
                  <img src={primaryPreview} alt="Primary preview" className="mt-2 rounded-md max-h-32" />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="categorySecondaryImage">Secondary Image</Label>
                <Input
                  id="categorySecondaryImage"
                  type="file"
                  accept="image/*"
                  onChange={handleSecondaryImageChange}
                />
                {secondaryPreview && (
                  <img src={secondaryPreview} alt="Secondary preview" className="mt-2 rounded-md max-h-32" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Starting From & Order Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ListOrdered className="w-5 h-5 mr-2 text-[#EB811F]" />
                Starting Price & Order
              </CardTitle>
              <CardDescription>Set the starting price and display order</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startingFrom">Starting From (₹) *</Label>
                <Input
                  id="startingFrom"
                  type="number"
                  min={0}
                  value={form.startingFrom}
                  onChange={e => handleChange('startingFrom', e.target.value)}
                  placeholder="e.g. 1500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  min={1}
                  value={form.order}
                  onChange={e => handleChange('order', e.target.value)}
                  placeholder="Order (1, 2, 3...)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/employee/website/categories')}
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
                  Creating...
                </>
              ) : (
                "Create Category"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory; 