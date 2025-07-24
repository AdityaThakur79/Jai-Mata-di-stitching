import React from 'react';
import { useGetAllGalleryQuery, useDeleteGalleryMutation } from '@/features/api/galleryApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Edit, Trash2, Image as ImageIcon, Plus, ListOrdered } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ManageGallery = () => {
  const { data, isLoading, refetch } = useGetAllGalleryQuery();
  const [deleteGallery, { isLoading: isDeleting }] = useDeleteGalleryMutation();
  const navigate = useNavigate();
  const gallery = data?.gallery || [];

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await deleteGallery(id).unwrap();
      toast.success('Gallery image deleted');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete gallery image');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Manage Gallery</h1>
            <p className="text-gray-600 text-sm lg:text-base">Add and manage gallery images</p>
          </div>
          <Button
            onClick={() => navigate('/employee/website/gallery/create')}
            className="w-full sm:w-auto bg-[#EB811F] hover:bg-[#EB811F]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Image
          </Button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-40"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : gallery.length === 0 ? (
          <div className="text-center text-gray-500">No gallery images found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item) => (
              <Card key={item._id} className="relative group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-amber-500" />
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    <ListOrdered className="w-3 h-3 mr-1 inline-block text-gray-400" />
                    Order: {item.order}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <img
                    src={item?.galleryImage}
                    alt={item.title}
                    className="rounded-md w-full h-48 object-cover mb-3 border"
                    onError={e => { e.target.src = '/images/placeholder.png'; }}
                  />
                  <div className="text-gray-600 text-sm mb-2 min-h-[32px]">{item.description}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" onClick={() => navigate(`/employee/website/gallery/update/${item._id}`)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(item._id)} disabled={isDeleting}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800 border-0 text-xs">Order {item.order}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageGallery; 