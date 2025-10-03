import React, { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { GrPowerCycle } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetAllBranchesQuery,
  useDeleteBranchMutation,
  useGetBranchByIdMutation,
} from "@/features/api/branchApi";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Building2, Search, Plus, RotateCcw, MapPin, Phone, Mail, CreditCard, FileText } from "lucide-react";
import { useDebounce } from "@/hooks/Debounce";
import { Drawer } from "antd";
import { EyeIcon, Loader2 } from "lucide-react";

const Branches = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data, isLoading, refetch } = useGetAllBranchesQuery({
    page: currentPage,
    limit,
    search: debouncedSearchQuery,
  });

  const [deleteBranch, { isSuccess, isError, error }] = useDeleteBranchMutation();

  const handleDelete = async (branchId) => {
    await deleteBranch({ branchId });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (data?.totalPage || 1)) {
      setCurrentPage(newPage);
    }
  };

  const handleLimitChange = (value) => {
    setLimit(Number(value));
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const totalPages = data?.totalPage || 1;
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    let end = Math.min(start + 4, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Branch Deleted Successfully");
      refetch();
    } else if (isError) {
      const errorMessage = error?.data?.message || error?.message || "Failed to delete branch";
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error]);

  const [open, setOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [getBranchById, { isLoading: branchLoading }] =
    useGetBranchByIdMutation();

  const handleViewBranch = async (branchId) => {
    setOpen(true);
    try {
      const { data } = await getBranchById({branchId});
      if (data?.success) {
        setSelectedBranch(data?.branch);
      }
    } catch (error) {
      console.error("Error fetching branch:", error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: "bg-emerald-100 text-emerald-700 border-emerald-200",
      inactive: "bg-red-100 text-red-700 border-red-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[status?.toLowerCase()] || statusConfig.pending}`}>
        {status}
      </span>
    );
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 ">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="md:text-3xl text-xl font-bold text-gray-900 dark:text-white">
                  Branch Management
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Manage all your business locations
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-orange-100 dark:border-gray-700">
                <div className="text-2xl font-bold text-orange-600">{data?.total || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Branches</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-green-100 dark:border-gray-700">
                <div className="text-2xl font-bold text-green-600">
                  {data?.branches?.filter(b => b.status?.toLowerCase() === 'active')?.length || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-orange-100 dark:border-gray-700 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search branches by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-3">
              <Select value={limit.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger className="w-20 border-gray-200 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                onClick={() => refetch()}
                variant="outline"
                className="border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Refresh
              </Button>

            
            </div>
            <Button 
                onClick={() => navigate("/employee/create-branch")}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Branch
              </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-orange-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="min-w-[820px] md:min-w-full table-auto">
              <thead>
                <tr className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-800 border-b border-orange-100 dark:border-gray-600">
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Branch Details
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider hidden sm:table-cell">
                    Contact
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                        <p className="text-gray-500 dark:text-gray-400">Loading branches...</p>
                      </div>
                    </td>
                  </tr>
                ) : data?.branches?.length > 0 ? (
                  data.branches.map((branch, i) => (
                    <tr key={branch._id} className="hover:bg-orange-25 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm font-medium text-gray-900 dark:text-white">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400 font-semibold">
                          {data.limit * (data.page - 1) + (i + 1)}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-lg">
                            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white">
                              {branch.branchName}
                            </div>
                            <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                              ID: {branch._id?.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 hidden sm:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600 dark:text-gray-300">
                            <Phone className="w-4 h-4" />
                            <span>{branch.phone || "Not provided"}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600 dark:text-gray-300">
                            <Mail className="w-4 h-4" />
                            <span>{branch.email || "Not provided"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 hidden sm:table-cell">
                        {getStatusBadge(branch.status)}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            onClick={() => handleViewBranch(branch._id)}
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                            onClick={() =>
                              navigate("/employee/update-branch", {
                                state: { branchId: branch._id },
                              })
                            }
                          >
                            <MdOutlineEdit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <FaRegTrashCan className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Branch?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the branch "{branch.branchName}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(branch._id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 rounded-2xl">
                          <Building2 className="w-12 h-12 text-orange-500 dark:text-orange-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            No Branches Found
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Get started by adding your first branch location
                          </p>
                        </div>
                        <Button 
                          onClick={() => navigate("/employee/create-branch")}
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Branch
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data?.totalPage > 1 && (
            <div className="border-t border-orange-100 dark:border-gray-700 px-6 py-4 bg-gradient-to-r from-orange-25 to-red-25 dark:from-gray-800 dark:to-gray-750">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Showing{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {data?.branches?.length ? (data?.page - 1) * data?.limit + 1 : 0}
                  </span>
                  {" "}to{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {Math.min(data?.page * data?.limit, data?.total || 0)}
                  </span>
                  {" "}of{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {data?.total || 0}
                  </span>
                  {" "}entries
                </div>
                
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer hover:bg-orange-50 dark:hover:bg-gray-700"
                        }
                      />
                    </PaginationItem>
                    {getPageNumbers().map((num) => (
                      <PaginationItem key={num}>
                        <PaginationLink
                          onClick={() => handlePageChange(num)}
                          isActive={num === currentPage}
                          className="cursor-pointer hover:bg-orange-50 dark:hover:bg-gray-700 data-[active=true]:bg-orange-500 data-[active=true]:text-white"
                        >
                          {num}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={
                          currentPage === (data?.totalPage || 1)
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer hover:bg-orange-50 dark:hover:bg-gray-700"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Drawer */}
      <Drawer
        title={null}
        placement="right"
        width={450}
        onClose={() => {
          setOpen(false);
          setSelectedBranch(null);
        }}
        open={open}
        mask={false}
        styles={{
          body: { padding: 0 },
          header: { display: 'none' }
        }}
      >
        {branchLoading || !selectedBranch ? (
          <div className="flex justify-center items-center h-40">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <p className="text-gray-500">Loading branch details...</p>
            </div>
          </div>
        ) : (
          <div className="h-full bg-gradient-to-br from-orange-25 via-white to-orange-25">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-100 to-red-100 p-6 border-b border-orange-200 relative">
              <button
                onClick={() => {
                  setOpen(false);
                  setSelectedBranch(null);
                }}
                className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-200 rounded-lg">
                  <Building2 className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedBranch?.branchName}</h2>
                  <p className="text-orange-600">Branch Details</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex justify-center">
                {getStatusBadge(selectedBranch?.status)}
              </div>

              {/* Details Grid */}
              <div className="space-y-4">
                {/* Contact Information */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-orange-500" />
                    Contact Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedBranch?.phone || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedBranch?.email || "Not provided"}</span>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                    Address
                  </h3>
                  <p className="text-sm text-gray-700">
                    {selectedBranch?.address || "Address not provided"}
                  </p>
                </div>

                {/* Business Details */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-orange-500" />
                    Business Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">GST:</span>
                      <span className="font-medium">{selectedBranch?.gst || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">PAN:</span>
                      <span className="font-medium">{selectedBranch?.pan || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">CIN:</span>
                      <span className="font-medium">{selectedBranch?.cin || "Not provided"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button 
                  onClick={() => navigate("/employee/update-branch", {
                    state: { branchId: selectedBranch._id },
                  })}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <MdOutlineEdit className="w-4 h-4 mr-2" />
                  Edit Branch
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </section>
  );
};

export default Branches;