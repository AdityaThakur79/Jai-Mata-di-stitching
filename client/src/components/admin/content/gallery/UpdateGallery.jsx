import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetGalleryByIdQuery, useUpdateGalleryMutation } from '@/features/api/galleryApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Image as ImageIcon, Info, ListOrdered, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const UpdateGallery = () => {
  const { id } = useParams();
  const { data, isLoading: isLoadingData } = useGetGalleryByIdQuery(id);
  const [updateGallery, { isLoading }] = useUpdateGalleryMutation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    order: 1
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (data?.gallery) {
      setForm({
        title: data.gallery.title || '',
        description: data.gallery.description || '',
        order: data.gallery.order || 1
      });
      setPreview(data.gallery.galleryImage || '');
    }
  }, [data]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || (!imageFile && !preview)) {
      toast.error('Title and image are required');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('order', form.order);
      if (imageFile) {
        formData.append('galleryImage', imageFile);
      }
      // Debug: log FormData entries
      for (let pair of formData.entries()) {
        console.log(pair[0]+ ':', pair[1]);
      }
      await updateGallery({ id, formData }).unwrap();
      toast.success('Gallery image updated');
      navigate('/employee/website/gallery');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update gallery image');
    }
  };

  if (isLoadingData) {
    return <div className="flex justify-center items-center h-40"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/employee/website/gallery')} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Gallery Image</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Update image details</p>
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
              <CardDescription>Details about the gallery image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={e => handleChange('title', e.target.value)}
                  placeholder="Image title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={e => handleChange('description', e.target.value)}
                  placeholder="Short description (optional)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-[#EB811F]" />
                Gallery Image
              </CardTitle>
              <CardDescription>Upload an image (required)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="galleryImage">Image *</Label>
                <Input
                  id="galleryImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {preview && (
                  <img src={preview} alt="Preview" className="mt-2 rounded-md max-h-40" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ListOrdered className="w-5 h-5 mr-2 text-[#EB811F]" />
                Display Order
              </CardTitle>
              <CardDescription>Set the order for this image</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  min={1}
                  value={form.order}
                  onChange={e => handleChange('order', Number(e.target.value))}
                  placeholder="Order (1, 2, 3...)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/employee/website/gallery')}
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
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Image
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateGallery; 