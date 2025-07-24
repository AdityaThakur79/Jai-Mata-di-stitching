import React, { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { GrPowerCycle } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetAllFabricsQuery,
  useDeleteFabricMutation,
  useGetFabricByIdMutation,
} from "@/features/api/fabricApi";
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
import { EyeIcon, Loader2 } from "lucide-react";
import { Drawer } from "antd";
import { useDebounce } from "@/hooks/Debounce";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Edit, Trash2, Filter, RefreshCw, ChevronDown, X, Loader2 as LucideLoader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const Fabrics = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [typeFilter, setTypeFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");

  const { data, isLoading, refetch, error } = useGetAllFabricsQuery({
    page: currentPage,
    limit,
    search: debouncedSearch,
    type: typeFilter,
    color: colorFilter,
  });

  console.log(data);

  const [deleteFabric, { isSuccess, isError }] = useDeleteFabricMutation();
  const [getFabricById] = useGetFabricByIdMutation();
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSecondary, setShowSecondary] = useState(false);

  const handleViewFabric = async (id) => {
    setDrawerOpen(true);
    const { data } = await getFabricById(id);
    if (data?.success) setSelectedFabric(data.fabric);
  };

  const handleDelete = async (id) => {
    await deleteFabric(id);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (data?.totalPage || 1)) {
      setCurrentPage(newPage);
    }
  };

  const getPageNumbers = () => {
    const totalPages = data?.totalPage || 1;
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    let start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    let end = Math.min(start + 4, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Fabric deleted successfully");
      refetch();
    } else if (isError) {
      toast.error("Failed to delete fabric");
    }
  }, [isSuccess, isError]);

  return (
    <section className=" dark:bg-gray-900 min-h-screen rounded-md">
      <div className="md:p-6 p-2">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Manage Fabrics</h1>
            <p className="text-gray-600 text-sm lg:text-base">Create and manage fabrics</p>
          </div>
          <Button
            onClick={() => navigate("/employee/create-fabric")}
            className="w-full sm:w-auto bg-[#EB811F] hover:bg-[#EB811F]/90 text-white rounded"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Fabric
          </Button>
        </div>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search fabrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => refetch()}
              disabled={isLoading}
              className="gap-2 border border-[#EB811F] text-[#EB811F] bg-white hover:bg-[#EB811F]/10 rounded"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-medium">Error Loading Fabrics</h3>
            <p className="text-red-600 text-sm mt-1">
              {error?.data?.message || error?.message || 'Failed to load fabrics'}
            </p>
            <Button 
              size="sm" 
              onClick={() => refetch()} 
              className="mt-2 border border-[#EB811F] text-[#EB811F] bg-white hover:bg-[#EB811F]/10 rounded"
            >
              Try Again
            </Button>
          </div>
        )}
        {/* Fabrics Display - Responsive */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading fabrics...</p>
          </div>
        ) : !data?.fabrics || data.fabrics.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Fabrics Found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || typeFilter !== "all" || colorFilter !== "all"
                ? "No fabrics match your current filters."
                : "You haven't created any fabrics yet."}
            </p>
            <Button onClick={() => navigate("/employee/create-fabric")}> <Plus className="w-4 h-4 mr-2 text-[#EB811F]" /> Create First Fabric </Button>
          </div>
        ) : (
          <>
            {/* Desktop Table View - Hidden on mobile */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr className="text-left">
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">No</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">Image</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">Name</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">Type</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">Color</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">Price/m</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
                    {data.fabrics.map((fabric, i) => (
                      <tr key={fabric._id} className="text-left">
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{limit * (currentPage - 1) + i + 1}</td>
                        <td className="px-6 py-4">
                          {fabric.fabricImage ? (
                            <img src={fabric.fabricImage} className="w-10 h-10 rounded object-cover" alt="fabric" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-500">N/A</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{fabric.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white capitalize">{fabric.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{fabric.color}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">₹{fabric.pricePerMeter}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200" onClick={() => handleViewFabric(fabric._id)}>
                              <Eye className="w-5 h-5 text-[#EB811F]" />
                            </Button>
                            <Button className="p-2 bg-orange-100 text-orange-600 hover:bg-orange-200" onClick={() => navigate("/employee/update-fabric", { state: { fabricId: fabric._id } })}>
                              <Edit className="w-5 h-5 text-[#EB811F]" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded"><Trash2 className="text-[#EB811F]" /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Fabric?</AlertDialogTitle>
                                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(fabric._id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Mobile Card View - Visible only on mobile */}
            <div className="lg:hidden space-y-4">
              {data.fabrics.map((fabric) => (
                <div key={fabric._id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    {fabric.fabricImage && (
                      <img src={fabric.fabricImage} alt={fabric.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{fabric.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{fabric.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <div className="font-medium">{fabric.type}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Color:</span>
                      <div className="font-medium">{fabric.color}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <div className="font-medium text-blue-600">₹{fabric.pricePerMeter}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Stock:</span>
                      <div className="font-medium">{fabric.inStockMeters} m</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">{fabric.type}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewFabric(fabric._id)} className="text-[#EB811F] hover:text-[#EB811F]/80 rounded" title="View Details"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => navigate("/employee/update-fabric", { state: { fabricId: fabric._id } })} className="text-[#EB811F] hover:text-[#EB811F]/80 rounded" title="Edit Fabric"><Edit className="w-4 h-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-[#EB811F] hover:text-[#EB811F]/80 rounded" title="Delete Fabric"><Trash2 className="w-4 h-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Fabric?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(fabric._id)}>Delete</AlertDialogAction>
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
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {getPageNumbers().map((num) => (
                      <PaginationItem key={num}>
                        <PaginationLink
                          onClick={() => handlePageChange(num)}
                          isActive={num === currentPage}
                          className="cursor-pointer"
                        >
                          {num}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={currentPage === (data?.totalPage || 1) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
        {/* Drawer for Fabric Details */}
        <Drawer
          title={null}
          placement="right"
          width={500}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedFabric(null);
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
          className="fabric-drawer"
          getContainer={false}
        >
          {!selectedFabric ? (
            <div className="flex flex-col justify-center items-center h-96 space-y-4">
              <LucideLoader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-gray-500 dark:text-gray-400">Loading fabric details...</p>
            </div>
          ) : (
            <div className="h-full bg-gradient-to-br from-blue-25 via-white to-blue-25 flex flex-col">
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 border-b border-blue-200 relative flex-shrink-0">
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    setSelectedFabric(null);
                    document.body.style.overflow = 'unset';
                  }}
                  className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-200 rounded-lg">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedFabric?.name}</h2>
                    <p className="text-blue-600">Fabric Details</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-6 space-y-6 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'thin' }}>
                {selectedFabric?.fabricImage && (
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
                    <img src={selectedFabric.fabricImage} alt={selectedFabric.name} className="w-full h-48 object-cover rounded-lg" />
                  </div>
                )}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
                  <h3 className="font-semibold text-gray-900 mb-3">Basic Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Name:</span><span className="font-medium">{selectedFabric?.name}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Type:</span><span className="font-medium">{selectedFabric?.type}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Color:</span><span className="font-medium">{selectedFabric?.color}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Pattern:</span><span className="font-medium">{selectedFabric?.pattern || 'Solid'}</span></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
                  <h3 className="font-semibold text-gray-900 mb-3">Pricing & Stock</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Price Per Meter:</span><span className="font-medium text-blue-600">₹{selectedFabric?.pricePerMeter}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Stock:</span><span className="font-medium">{selectedFabric?.inStockMeters} meters</span></div>
                  </div>
                </div>
                {selectedFabric?.description && (
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{selectedFabric?.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </section>
  );
};

export default Fabrics;
