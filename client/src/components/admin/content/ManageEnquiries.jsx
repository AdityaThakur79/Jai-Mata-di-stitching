import React, { useState } from 'react';
import {
  useGetAllEnquiriesQuery,
  useGetEnquiryByIdMutation,
  useUpdateEnquiryMutation,
  useDeleteEnquiryMutation,
  useGetEnquiryStatsQuery
} from '@/features/api/enquiryApi';
import {
  Eye,
  Edit3,
  Trash2,
  Filter,
  RefreshCw,
  ChevronDown,
  X,
  Search,
  Phone,
  Mail,
  Calendar,
  Clock,
  User,
  MessageSquare,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Drawer } from 'antd';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ManageEnquiries = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    source: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, enquiryId: null });

  // Build query parameters
  const queryParams = {
    page,
    limit,
    ...(search && { search }),
    ...(filters.status !== 'all' && { status: filters.status }),
    ...(filters.priority !== 'all' && { priority: filters.priority }),
    ...(filters.source !== 'all' && { source: filters.source })
  };

  // API hooks
  const { data: enquiryData, isLoading, refetch } = useGetAllEnquiriesQuery(queryParams);
  const { data: statsData } = useGetEnquiryStatsQuery();
  const [getEnquiryById, { isLoading: isLoadingDetails }] = useGetEnquiryByIdMutation();
  const [updateEnquiry] = useUpdateEnquiryMutation();
  const [deleteEnquiry] = useDeleteEnquiryMutation();

  const enquiries = enquiryData?.enquiries || [];
  const total = enquiryData?.total || 0;
  const totalPages = enquiryData?.totalPage || 1;
  const stats = statsData?.stats || {};

  // Get status badge color
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      contacted: { color: 'bg-blue-100 text-blue-800', label: 'Contacted' },
      quoted: { color: 'bg-purple-100 text-purple-800', label: 'Quoted' },
      converted: { color: 'bg-green-100 text-green-800', label: 'Converted' },
      closed: { color: 'bg-gray-100 text-gray-800', label: 'Closed' }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  // Get priority badge color
  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { color: 'bg-green-100 text-green-800', label: 'Low' },
      medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
      high: { color: 'bg-red-100 text-red-800', label: 'High' }
    };
    return priorityConfig[priority] || priorityConfig.medium;
  };

  // Handle view enquiry
  const handleViewEnquiry = async (enquiryId) => {
    try {
      const response = await getEnquiryById(enquiryId).unwrap();
      setSelectedEnquiry(response.enquiry);
      setDrawerOpen(true);
    } catch (error) {
      toast.error('Failed to fetch enquiry details');
    }
  };

  // Handle status update
  const handleStatusUpdate = async (enquiryId, newStatus) => {
    try {
      const updateData = { enquiryId, status: newStatus };
      if (newStatus === 'contacted' || newStatus === 'quoted') {
        updateData.respondedAt = new Date().toISOString();
      }
      await updateEnquiry(updateData).unwrap();
      toast.success('Enquiry status updated successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to update enquiry status');
    }
  };

  // Handle delete
  const handleDelete = async (enquiryId) => {
    try {
      await deleteEnquiry(enquiryId).unwrap();
      toast.success('Enquiry deleted successfully');
      setDeleteDialog({ open: false, enquiryId: null });
      refetch();
    } catch (error) {
      toast.error('Failed to delete enquiry');
    }
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      source: 'all'
    });
    setSearch('');
    setPage(1);
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(value => value !== 'all').length + (search ? 1 : 0);

  return (
    <div className="p-6   dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Manage Enquiries
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage customer enquiries and quotes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Converted</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.converted || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Star className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.conversionRate || 0}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search enquiries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex gap-2">
            <DropdownMenu open={showFilters} onOpenChange={setShowFilters}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 p-2">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Status</label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="quoted">Quoted</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Priority</label>
                    <Select
                      value={filters.priority}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Source</label>
                    <Select
                      value={filters.source}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, source: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="services_page">Services Page</SelectItem>
                        <SelectItem value="contact_page">Contact Page</SelectItem>
                        <SelectItem value="direct">Direct</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <button
                    onClick={clearFilters}
                    className="w-full text-sm text-red-600 hover:text-red-700"
                  >
                    Clear Filters
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Enquiries Table/List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : enquiries.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {enquiries.map((enquiry) => {
                  const statusBadge = getStatusBadge(enquiry.status);
                  const priorityBadge = getPriorityBadge(enquiry.priority);
                  
                  return (
                    <tr key={enquiry._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {enquiry.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {enquiry.phoneNumber}
                          </div>
                          {enquiry.email && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              {enquiry.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {enquiry.serviceName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {enquiry.serviceId?.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={`${statusBadge.color} border-0`}>
                          {statusBadge.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={`${priorityBadge.color} border-0`}>
                          {priorityBadge.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(enquiry.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewEnquiry(enquiry._id)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <Select
                            value={enquiry.status}
                            onValueChange={(value) => handleStatusUpdate(enquiry._id, value)}
                          >
                            <SelectTrigger className="w-20 h-8 text-xs">
                              <Edit3 className="h-3 w-3" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="quoted">Quoted</SelectItem>
                              <SelectItem value="converted">Converted</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                          <button
                            onClick={() => setDeleteDialog({ open: true, enquiryId: enquiry._id })}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {enquiries.map((enquiry) => {
              const statusBadge = getStatusBadge(enquiry.status);
              const priorityBadge = getPriorityBadge(enquiry.priority);
              
              return (
                <div key={enquiry._id} className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{enquiry.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{enquiry.serviceName}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={`${statusBadge.color} border-0 text-xs`}>
                        {statusBadge.label}
                      </Badge>
                      <Badge className={`${priorityBadge.color} border-0 text-xs`}>
                        {priorityBadge.label}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {enquiry.phoneNumber}
                    </div>
                    {enquiry.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {enquiry.email}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(enquiry.createdAt), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleViewEnquiry(enquiry._id)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                    <div className="flex space-x-2">
                      <Select
                        value={enquiry.status}
                        onValueChange={(value) => handleStatusUpdate(enquiry._id, value)}
                      >
                        <SelectTrigger className="w-20 h-8 text-xs">
                          <Edit3 className="h-3 w-3" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="quoted">Quoted</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <button
                        onClick={() => setDeleteDialog({ open: true, enquiryId: enquiry._id })}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{((page - 1) * limit) + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(page * limit, total)}</span> of{' '}
                  <span className="font-medium">{total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No enquiries found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {search || activeFilterCount > 0
              ? 'Try adjusting your search or filters'
              : 'Enquiries will appear here when customers submit them'}
          </p>
        </div>
      )}

      {/* Enquiry Details Drawer */}
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Enquiry Details</span>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        }
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={600}
        maskClosable={false}
        bodyStyle={{ padding: 0, overflow: 'hidden' }}
        headerStyle={{ borderBottom: '1px solid #f0f0f0' }}
      >
        {isLoadingDetails ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : selectedEnquiry ? (
          <div 
            className="p-6 h-full overflow-auto" 
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 #F7FAFC' }}
            onWheel={(e) => e.stopPropagation()}
            onMouseEnter={() => document.body.style.overflow = 'hidden'}
            onMouseLeave={() => document.body.style.overflow = 'unset'}
          >
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900 font-medium">{selectedEnquiry.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-900">{selectedEnquiry.phoneNumber}</p>
                  </div>
                  {selectedEnquiry.email && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{selectedEnquiry.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Service Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Service</label>
                    <p className="text-gray-900 font-medium">{selectedEnquiry.serviceName}</p>
                  </div>
                  {selectedEnquiry.serviceId && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Category</label>
                        <p className="text-gray-900">{selectedEnquiry.serviceId.category}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Estimated Duration</label>
                        <p className="text-gray-900">{selectedEnquiry.serviceId.estimatedDays} days</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Message */}
              {selectedEnquiry.message && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    Customer Message
                  </h3>
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {selectedEnquiry.message}
                  </p>
                </div>
              )}

              {/* Status and Priority */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Status & Priority</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="mt-1">
                      <Badge className={`${getStatusBadge(selectedEnquiry.status).color} border-0`}>
                        {getStatusBadge(selectedEnquiry.status).label}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Priority</label>
                    <div className="mt-1">
                      <Badge className={`${getPriorityBadge(selectedEnquiry.priority).color} border-0`}>
                        {getPriorityBadge(selectedEnquiry.priority).label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Timeline</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Submitted:</span>
                    <span className="text-sm text-gray-900">
                      {format(new Date(selectedEnquiry.createdAt), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                  {selectedEnquiry.respondedAt && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Responded:</span>
                      <span className="text-sm text-gray-900">
                        {format(new Date(selectedEnquiry.respondedAt), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Source:</span>
                    <span className="text-sm text-gray-900 capitalize">
                      {selectedEnquiry.source.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Admin Notes</h3>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                  rows={4}
                  placeholder="Add notes about this enquiry..."
                  value={selectedEnquiry.adminNotes || ''}
                  onChange={(e) => setSelectedEnquiry(prev => ({ ...prev, adminNotes: e.target.value }))}
                />
                <button
                  onClick={() => {
                    updateEnquiry({
                      enquiryId: selectedEnquiry._id,
                      adminNotes: selectedEnquiry.adminNotes
                    });
                    toast.success('Notes updated successfully');
                  }}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, enquiryId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the enquiry and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(deleteDialog.enquiryId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageEnquiries; 