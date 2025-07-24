import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, Search, Eye, Edit, Trash2, Star, Clock, Filter, RefreshCw, ChevronDown, X, EyeIcon, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetAllServicesQuery,
  useDeleteServiceMutation,
  useGetServiceByIdMutation,
} from "@/features/api/serviceApi";
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
} from "@/components/ui/alert-dialog";
import { Drawer } from "antd";

const ManageServices = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const limit = 10;

  // Drawer state for viewing service details
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [getServiceById, { isLoading: serviceLoading }] = useGetServiceByIdMutation();

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (genderFilter !== "all") count++;
    if (categoryFilter !== "all") count++;
    if (statusFilter !== "all") count++;
    return count;
  };

  // Build query parameters - only include non-empty filters
  const queryParams = { page, limit };
  
  if (search && search.trim()) queryParams.search = search;
  if (genderFilter && genderFilter !== "all") queryParams.gender = genderFilter;
  if (categoryFilter && categoryFilter !== "all") queryParams.category = categoryFilter;
  if (statusFilter && statusFilter !== "all") queryParams.status = statusFilter;

  const { data, isLoading, error, refetch } = useGetAllServicesQuery(queryParams);
  
  const [deleteService] = useDeleteServiceMutation();

  const handleViewService = async (serviceId) => {
    setDrawerOpen(true);
    setSelectedService(null);
    try {
      const { data } = await getServiceById(serviceId);
      if (data?.success) {
        setSelectedService(data?.service);
      }
    } catch (error) {
      console.error("Error fetching service:", error);
      toast.error("Failed to load service details");
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      await deleteService(serviceId).unwrap();
      toast.success("Service deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete service");
    }
  };

  const handleEdit = (service) => {
    navigate("/employee/website/services/update", {
      state: { serviceId: service._id },
    });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      draft: "bg-yellow-100 text-yellow-800",
      archived: "bg-gray-100 text-gray-800",
    };
    return (
      <Badge className={`${statusStyles[status]} border-0`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriceDisplay = (pricing) => {
    if (!pricing) return "N/A";
    const { basePrice, maxPrice, priceType, currency = "INR" } = pricing;
    
    switch (priceType) {
      case "fixed":
        return `₹${basePrice}`;
      case "starting_from":
        return `From ₹${basePrice}`;
      case "range":
        return `₹${basePrice} - ₹${maxPrice || basePrice}`;
      case "custom_quote":
        return "Custom Quote";
      default:
        return `₹${basePrice}`;
    }
  };

  return (
    <div className="p-4 lg:p-6 min-h-screen   dark:bg-gray-900">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Manage Services</h1>
          <p className="text-gray-600 text-sm lg:text-base">Create and manage tailoring services</p>
        </div>
        <Button
          onClick={() => navigate("/employee/website/services/create")}
          className="w-full sm:w-auto bg-[#EB811F] hover:bg-[#EB811F]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
                {getActiveFilterCount() > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                    {getActiveFilterCount()}
                  </Badge>
                )}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Gender</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setGenderFilter("all")} className={genderFilter === "all" ? "bg-accent" : ""}>
                All Genders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setGenderFilter("men")} className={genderFilter === "men" ? "bg-accent" : ""}>
                Men
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setGenderFilter("women")} className={genderFilter === "women" ? "bg-accent" : ""}>
                Women
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setGenderFilter("unisex")} className={genderFilter === "unisex" ? "bg-accent" : ""}>
                Unisex
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setCategoryFilter("all")} className={categoryFilter === "all" ? "bg-accent" : ""}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("Formal Wear")} className={categoryFilter === "Formal Wear" ? "bg-accent" : ""}>
                Formal Wear
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("Traditional Wear")} className={categoryFilter === "Traditional Wear" ? "bg-accent" : ""}>
                Traditional Wear
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("Office Wear")} className={categoryFilter === "Office Wear" ? "bg-accent" : ""}>
                Office Wear
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("Casual Wear")} className={categoryFilter === "Casual Wear" ? "bg-accent" : ""}>
                Casual Wear
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("Bridal Wear")} className={categoryFilter === "Bridal Wear" ? "bg-accent" : ""}>
                Bridal Wear
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("Alterations")} className={categoryFilter === "Alterations" ? "bg-accent" : ""}>
                Alterations
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setStatusFilter("all")} className={statusFilter === "all" ? "bg-accent" : ""}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")} className={statusFilter === "active" ? "bg-accent" : ""}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("inactive")} className={statusFilter === "inactive" ? "bg-accent" : ""}>
                Inactive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("draft")} className={statusFilter === "draft" ? "bg-accent" : ""}>
                Draft
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => {
                  setSearch("");
                  setGenderFilter("all");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                }}
                className="text-red-600"
              >
                Clear All Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-gray-500">Active filters:</span>
          {genderFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Gender: {genderFilter}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setGenderFilter("all")} />
            </Badge>
          )}
          {categoryFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Category: {categoryFilter}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setCategoryFilter("all")} />
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Status: {statusFilter}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setStatusFilter("all")} />
            </Badge>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-medium">Error Loading Services</h3>
          <p className="text-red-600 text-sm mt-1">
            {error?.data?.message || error?.message || 'Failed to load services'}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()} 
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}



      {/* Services Display - Responsive */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EB811F] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      ) : !data?.services || data.services.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Services Found</h3>
          <p className="text-gray-600 mb-4">
            {search || genderFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all"
              ? "No services match your current filters."
              : "You haven't created any services yet."}
          </p>
          <Button onClick={() => navigate("/employee/website/services/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Service
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Service</TableHead>
                    <TableHead className="min-w-[150px]">Category</TableHead>
                    <TableHead className="min-w-[100px]">Gender</TableHead>
                    <TableHead className="min-w-[120px]">Price</TableHead>
                    <TableHead className="min-w-[100px]">Duration</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[150px]">Badges</TableHead>
                    <TableHead className="min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.services.map((service) => (
                    <TableRow key={service._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {service.serviceImage && (
                            <img
                              src={service.serviceImage}
                              alt={service.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium">{service.title}</div>
                            <div className="text-sm text-gray-500 max-w-[200px] truncate">
                              {service.shortDescription}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{service.category}</div>
                          {service.subcategory && (
                            <div className="text-sm text-gray-500">
                              {service.subcategory}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {service.gender.charAt(0).toUpperCase() + service.gender.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{getPriceDisplay(service.pricing)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-gray-400" />
                          {service.estimatedDays} days
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(service.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {service.isFeatured && (
                            <Badge className="bg-purple-100 text-purple-800 border-0 text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {service.isPopular && (
                            <Badge className="bg-orange-100 text-orange-800 border-0 text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewService(service._id)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(service)}
                            title="Edit Service"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-800"
                                title="Delete Service"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Service?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the service "{service.title}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(service._id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Service</TableHead>
                    <TableHead className="min-w-[150px]">Category</TableHead>
                    <TableHead className="min-w-[100px]">Gender</TableHead>
                    <TableHead className="min-w-[120px]">Price</TableHead>
                    <TableHead className="min-w-[100px]">Duration</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[150px]">Badges</TableHead>
                    <TableHead className="min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
          </div>

          {/* Mobile Card View - Visible only on mobile */}
          <div className="lg:hidden space-y-4">
            {data.services.map((service) => (
              <div key={service._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start space-x-3 mb-3">
                  {service.serviceImage && (
                    <img
                      src={service.serviceImage}
                      alt={service.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{service.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {service.shortDescription || service.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <div className="font-medium">{service.category}</div>
                    {service.subcategory && (
                      <div className="text-xs text-gray-400">{service.subcategory}</div>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-500">Gender:</span>
                    <div>
                      <Badge variant="outline" className="text-xs">
                        {service.gender.charAt(0).toUpperCase() + service.gender.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <div className="font-medium text-[#EB811F]">
                      {getPriceDisplay(service.pricing)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-gray-400" />
                      {service.estimatedDays} days
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(service.status)}
                    {service.isFeatured && (
                      <Badge className="bg-purple-100 text-purple-800 border-0 text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {service.isPopular && (
                      <Badge className="bg-orange-100 text-orange-800 border-0 text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewService(service._id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(service)}
                      title="Edit Service"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Service?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the service "{service.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(service._id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination - Responsive */}
          {data?.totalPage > 1 && (
            <div className="bg-white rounded-lg shadow px-4 py-4 mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="text-sm"
                    />
                  </PaginationItem>
                  
                  {/* Show fewer pages on mobile */}
                  {Array.from({ length: Math.min(window.innerWidth < 768 ? 3 : 5, data.totalPage) }, (_, i) => {
                    const startPage = Math.max(1, page - Math.floor((window.innerWidth < 768 ? 3 : 5) / 2));
                    const pageNum = startPage + i;
                    if (pageNum <= data.totalPage) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => setPage(pageNum)}
                            isActive={page === pageNum}
                            className="text-sm"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(Math.min(data.totalPage, page + 1))}
                      disabled={page === data.totalPage}
                      className="text-sm"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Summary */}
      {data && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {data.currentPageCount} of {data.total} services (Page {page} of{" "}
          {data.totalPage})
        </div>
      )}

      {/* Service Details Drawer */}
      <Drawer
        title={null}
        placement="right"
        width={500}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedService(null);
          // Restore body scroll when drawer closes
          document.body.style.overflow = 'unset';
        }}
        open={drawerOpen}
        mask={false}
        maskClosable={true}
        styles={{
          body: { 
            padding: 0, 
            height: '100vh',
            overflow: 'hidden' 
          },
          header: { display: 'none' },
          wrapper: { 
            height: '100vh' 
          }
        }}
        className="service-drawer"
        getContainer={false}
      >
        {serviceLoading || !selectedService ? (
          <div className="flex justify-center items-center h-40">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#EB811F]" />
              <p className="text-gray-500">Loading service details...</p>
            </div>
          </div>
        ) : (
          <div className="h-full bg-gradient-to-br from-orange-25 via-white to-orange-25 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-100 to-red-100 p-6 border-b border-orange-200 relative flex-shrink-0">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  setSelectedService(null);
                  // Restore body scroll when drawer closes
                  document.body.style.overflow = 'unset';
                }}
                className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-200 rounded-lg">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedService?.title}</h2>
                  <p className="text-orange-600">Service Details</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div 
              className="flex-1 p-6 space-y-6 overflow-y-auto overflow-x-hidden"
              style={{ scrollbarWidth: 'thin' }}
              onWheel={(e) => {
                // Check if content is scrollable
                const element = e.currentTarget;
                const isScrollable = element.scrollHeight > element.clientHeight;
                
                if (isScrollable) {
                  // Prevent background scroll only if drawer content can scroll
                  e.stopPropagation();
                }
              }}
              onMouseEnter={(e) => {
                // Disable body scroll when mouse enters drawer content
                document.body.style.overflow = 'hidden';
              }}
              onMouseLeave={(e) => {
                // Re-enable body scroll when mouse leaves drawer content
                document.body.style.overflow = 'unset';
              }}
            >
              {/* Service Image */}
              {selectedService?.serviceImage && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                  <img
                    src={selectedService.serviceImage}
                    alt={selectedService.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Basic Information */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Star className="w-4 h-4 mr-2 text-orange-500" />
                  Basic Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Title:</span>
                    <span className="font-medium">{selectedService?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium capitalize">{selectedService?.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{selectedService?.category}</span>
                  </div>
                  {selectedService?.subcategory && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subcategory:</span>
                      <span className="font-medium">{selectedService?.subcategory}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium capitalize ${
                      selectedService?.status === 'active' ? 'text-green-600' : 
                      selectedService?.status === 'inactive' ? 'text-red-600' : 
                      'text-yellow-600'
                    }`}>
                      {selectedService?.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{selectedService?.estimatedDays} days</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {selectedService?.description}
                </p>
                {selectedService?.shortDescription && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-2">Short Description</h4>
                    <p className="text-gray-600 text-sm">
                      {selectedService?.shortDescription}
                    </p>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-orange-500" />
                  Pricing Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price Type:</span>
                    <span className="font-medium capitalize">{selectedService?.pricing?.priceType?.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-medium text-[#EB811F]">₹{selectedService?.pricing?.basePrice}</span>
                  </div>
                  {selectedService?.pricing?.maxPrice && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Price:</span>
                      <span className="font-medium text-[#EB811F]">₹{selectedService?.pricing?.maxPrice}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              {selectedService?.features && selectedService.features.length > 0 && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                  <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                  <ul className="space-y-2 text-sm">
                    {selectedService.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {selectedService?.tags && selectedService.tags.length > 0 && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                  <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Badges */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                <h3 className="font-semibold text-gray-900 mb-3">Badges</h3>
                <div className="flex gap-2">
                  {selectedService?.isFeatured && (
                    <Badge className="bg-purple-100 text-purple-800 border-0">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {selectedService?.isPopular && (
                    <Badge className="bg-orange-100 text-orange-800 border-0">
                      Popular
                    </Badge>
                  )}
                  {!selectedService?.isFeatured && !selectedService?.isPopular && (
                    <span className="text-gray-500 text-sm">No badges assigned</span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button 
                  onClick={() => handleEdit(selectedService)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Service
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ManageServices; 