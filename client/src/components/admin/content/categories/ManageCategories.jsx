import React, { useState } from 'react';
import { useGetAllCategoriesQuery, useDeleteCategoryMutation, useGetCategoryByIdMutation } from '@/features/api/categoriesApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Eye, Loader2, RefreshCw, X, ListOrdered, Users, Image as ImageIcon, ChevronDown, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Drawer } from 'antd';

const ManageCategories = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [getCategoryById, { isLoading: categoryLoading }] = useGetCategoryByIdMutation();
  const { data, isLoading, refetch } = useGetAllCategoriesQuery();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const navigate = useNavigate();
  const categories = data?.categories || [];

  // Filtered categories
  const filteredCategories = categories.filter(item => {
    const matchesSearch = !search || item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success('Category deleted');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete category');
    }
  };

  const handleViewCategory = async (id) => {
    setDrawerOpen(true);
    setSelectedCategory(null);
    try {
      const { data } = await getCategoryById(id);
      if (data?.success) {
        setSelectedCategory(data?.category);
      }
    } catch (error) {
      toast.error('Failed to load category details');
    }
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.category-filter-dropdown')) {
        setFilterDropdownOpen(false);
      }
    };
    if (filterDropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filterDropdownOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Manage Categories/Items</h1>
            <p className="text-gray-600 text-sm lg:text-base">Add and manage categories/items for stitching</p>
          </div>
          <Button
            onClick={() => navigate('/employee/website/category/create')}
            className="w-full sm:w-auto bg-[#EB811F] hover:bg-[#EB811F]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="Search categories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <div className="relative category-filter-dropdown">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setFilterDropdownOpen((open) => !open)}
                aria-expanded={filterDropdownOpen}
                aria-haspopup="listbox"
              >
                <Filter className="w-4 h-4" />
                {categoryFilter === 'all' ? 'All Categories' : categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}
                <ChevronDown className="w-4 h-4" />
              </Button>
              {filterDropdownOpen && (
                <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg w-40">
                  <div className="py-1">
                    <div className="px-4 py-2 hover:bg-orange-50 cursor-pointer" onClick={() => { setCategoryFilter('all'); setFilterDropdownOpen(false); }}>All</div>
                    <div className="px-4 py-2 hover:bg-orange-50 cursor-pointer" onClick={() => { setCategoryFilter('men'); setFilterDropdownOpen(false); }}>Men</div>
                    <div className="px-4 py-2 hover:bg-orange-50 cursor-pointer" onClick={() => { setCategoryFilter('women'); setFilterDropdownOpen(false); }}>Women</div>
                    <div className="px-4 py-2 hover:bg-orange-50 cursor-pointer" onClick={() => { setCategoryFilter('unisex'); setFilterDropdownOpen(false); }}>Unisex</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Categories Table/Card View */}
        {isLoading ? (
          <div className="flex justify-center items-center h-40"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center text-gray-500">No categories found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((item) => (
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
                  <div className="flex gap-2 mb-2">
                    {item.categoryPrimaryImage && (
                      <img
                        src={item.categoryPrimaryImage}
                        alt={item.title}
                        className="rounded-md w-20 h-20 object-cover border"
                        onError={e => { e.target.src = '/images/placeholder.png'; }}
                      />
                    )}
                    {item.categorySecondaryImage && (
                      <img
                        src={item.categorySecondaryImage}
                        alt={item.title + ' secondary'}
                        className="rounded-md w-20 h-20 object-cover border"
                        onError={e => { e.target.src = '/images/placeholder.png'; }}
                      />
                    )}
                  </div>
                  <div className="text-gray-800 font-medium mb-1">{item.shortDesc}</div>
                  <div className="text-xs text-gray-500 mb-2">Category: {item.category}</div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.features && item.features.map((f, i) => (
                      <Badge key={i} className="bg-orange-100 text-orange-800 border-0 text-xs">{f}</Badge>
                    ))}
                  </div>
                  <div className="text-sm text-[#EB811F] mb-2">Starting from ₹{item.startingFrom}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" onClick={() => navigate(`/employee/website/category/update/${item._id}`)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="destructive" disabled={isDeleting}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the category "{item.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item._id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button size="icon" variant="outline" onClick={() => handleViewCategory(item._id)}>
                        <Eye className="w-4 h-4" />
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
      {/* Category Details Drawer */}
      <Drawer
        title={null}
        placement="right"
        width={400}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedCategory(null);
          document.body.style.overflow = 'unset';
        }}
        open={drawerOpen}
        mask={false}
        maskClosable={true}
        styles={{
          body: { padding: 0, height: '100vh', overflow: 'hidden' },
          header: { display: 'none' },
          wrapper: { height: '100vh' }
        }}
        className="category-drawer"
        getContainer={false}
      >
        {categoryLoading || !selectedCategory ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-[#EB811F]" />
            <p className="text-gray-500 ml-4">Loading category details...</p>
          </div>
        ) : (
          <div className="h-full bg-gradient-to-br from-orange-25 via-white to-orange-25 flex flex-col">
            <div className="bg-gradient-to-r from-orange-100 to-red-100 p-6 border-b border-orange-200 relative flex-shrink-0">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  setSelectedCategory(null);
                  document.body.style.overflow = 'unset';
                }}
                className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-200 rounded-lg">
                  <ImageIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedCategory?.title}</h2>
                  <p className="text-orange-600">Category Details</p>
                </div>
              </div>
            </div>
            <div
              className="flex-1 p-6 space-y-6 overflow-y-auto overflow-x-hidden"
              style={{ scrollbarWidth: 'thin' }}
              onWheel={(e) => {
                const element = e.currentTarget;
                const isScrollable = element.scrollHeight > element.clientHeight;
                if (isScrollable) {
                  e.stopPropagation();
                }
              }}
              onMouseEnter={() => { document.body.style.overflow = 'hidden'; }}
              onMouseLeave={() => { document.body.style.overflow = 'unset'; }}
            >
              {/* Images */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 flex gap-4">
                {selectedCategory?.categoryPrimaryImage && (
                  <img
                    src={selectedCategory.categoryPrimaryImage}
                    alt={selectedCategory.title}
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                )}
                {selectedCategory?.categorySecondaryImage && (
                  <img
                    src={selectedCategory.categorySecondaryImage}
                    alt={selectedCategory.title + ' secondary'}
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                )}
              </div>
              {/* Basic Info */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-orange-500" />
                  Basic Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Title:</span>
                    <span className="font-medium">{selectedCategory?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium capitalize">{selectedCategory?.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order:</span>
                    <span className="font-medium">{selectedCategory?.order}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Starting From:</span>
                    <span className="font-medium text-[#EB811F]">₹{selectedCategory?.startingFrom}</span>
                  </div>
                </div>
              </div>
              {/* Description */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {selectedCategory?.shortDesc}
                </p>
              </div>
              {/* Features */}
              {selectedCategory?.features && selectedCategory.features.length > 0 && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                  <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                  <ul className="space-y-2 text-sm">
                    {selectedCategory.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ManageCategories; 