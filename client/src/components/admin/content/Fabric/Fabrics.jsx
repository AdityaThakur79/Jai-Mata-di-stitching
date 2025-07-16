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

const Fabrics = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, isLoading, refetch } = useGetAllFabricsQuery({
    page: currentPage,
    limit,
    search: debouncedSearch,
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
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen rounded-md">
      <div className="md:p-6 p-2">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="md:text-xl font-semibold text-gray-700 dark:text-white">
            All Fabrics
          </h2>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by name, type, color"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            />
            <Select
              value={limit.toString()}
              onValueChange={(v) => {
                setLimit(+v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Limit" />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 15, 20].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => navigate("/employee/create-fabric")}>
              Add Fabric
            </Button>
            <Button className="p-2" onClick={refetch}>
              <GrPowerCycle />
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr className="text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  No
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Image
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Color
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Price/m
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10">
                    Loading...
                  </td>
                </tr>
              ) : data?.fabrics?.length > 0 ? (
                data.fabrics.map((fabric, i) => (
                  <tr key={fabric._id} className="text-left">
                    <td className=" px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {limit * (currentPage - 1) + i + 1}
                    </td>
                    <td className="px-6 py-4">
                      {fabric.fabricImage ? (
                        <img
                          src={fabric?.fabricImage}
                          className="w-10 h-10 rounded object-cover"
                          alt="fabric"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {fabric.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white capitalize">
                      {fabric.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {fabric.color}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      ₹{fabric.pricePerMeter}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2  ">
                        <Button
                          className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200"
                          onClick={() => handleViewFabric(fabric._id)}
                        >
                          <EyeIcon className="w-5 h-5" />
                        </Button>

                        <Drawer
                          title={
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                  {selectedFabric?.name?.charAt(0) || "F"}
                                </span>
                              </div>
                              <span className="text-xl font-bold text-gray-800 dark:text-white">
                                {selectedFabric?.name || "Loading..."}
                              </span>
                            </div>
                          }
                          placement="right"
                          width={450}
                          onClose={() => {
                            setDrawerOpen(false);
                            setSelectedFabric(null);
                          }}
                          open={drawerOpen}
                          mask={false}
                          className="fabric-drawer"
                        >
                          {!selectedFabric ? (
                            <div className="flex flex-col justify-center items-center h-96 space-y-4">
                              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                              <p className="text-gray-500 dark:text-gray-400">
                                Loading fabric details...
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {/* Image Section with Enhanced Design */}
                              {selectedFabric?.fabricImage && (
                                <div className="relative group">
                                  <div className="w-full h-56 md:h-72 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-lg">
                                    {/* Primary Image */}
                                    <img
                                      src={selectedFabric.fabricImage}
                                      alt={selectedFabric.name}
                                      className={`w-full h-full object-cover object-center transition-all duration-500 ease-in-out group-hover:scale-105 ${
                                        showSecondary &&
                                        selectedFabric?.secondaryFabricImage
                                          ? "opacity-0"
                                          : "opacity-100"
                                      }`}
                                      onError={(e) => {
                                        e.currentTarget.src =
                                          "/placeholder.png";
                                      }}
                                    />

                                    {/* Secondary Image */}
                                    {selectedFabric.secondaryFabricImage && (
                                      <img
                                        src={
                                          selectedFabric.secondaryFabricImage
                                        }
                                        alt={`${selectedFabric.name} - alternate view`}
                                        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-in-out group-hover:scale-105 ${
                                          showSecondary
                                            ? "opacity-100"
                                            : "opacity-0"
                                        }`}
                                        onError={(e) => {
                                          e.currentTarget.src =
                                            "/placeholder.png";
                                        }}
                                      />
                                    )}

                                    {/* Hover trigger area */}
                                    {selectedFabric.secondaryFabricImage && (
                                      <div
                                        className="absolute inset-0 cursor-pointer"
                                        onMouseEnter={() =>
                                          setShowSecondary(true)
                                        }
                                        onMouseLeave={() =>
                                          setShowSecondary(false)
                                        }
                                      />
                                    )}

                                    {/* Overlay for secondary image hint */}
                                    {selectedFabric.secondaryFabricImage && (
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-end justify-center pb-4">
                                        <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                                          Hover to see alternate view
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Image indicators */}
                                  {selectedFabric.secondaryFabricImage && (
                                    <div className="absolute top-3 right-3 flex space-x-1">
                                      <div
                                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                                          !showSecondary
                                            ? "bg-white shadow-md"
                                            : "bg-white/50"
                                        }`}
                                      ></div>
                                      <div
                                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                                          showSecondary
                                            ? "bg-white shadow-md"
                                            : "bg-white/50"
                                        }`}
                                      ></div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Details Section with Cards */}
                              <div className="space-y-4">
                                {/* Primary Info Card */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                          Type
                                        </p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                          {selectedFabric.type}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                          Color
                                        </p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                          {selectedFabric.color}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                          Pattern
                                        </p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                          {selectedFabric.pattern || "Solid"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                          Price per meter
                                        </p>
                                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                          ₹{selectedFabric.pricePerMeter}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Stock Info Card */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                                        Available Stock
                                      </p>
                                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                        {selectedFabric.inStockMeters} meters
                                      </p>
                                    </div>
                                    <div className="flex items-center">
                                      <div
                                        className={`w-3 h-3 rounded-full mr-2 ${
                                          selectedFabric.inStockMeters > 10
                                            ? "bg-green-500"
                                            : selectedFabric.inStockMeters > 5
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                        }`}
                                      ></div>
                                      <span
                                        className={`text-xs font-medium ${
                                          selectedFabric.inStockMeters > 10
                                            ? "text-green-600"
                                            : selectedFabric.inStockMeters > 5
                                            ? "text-yellow-600"
                                            : "text-red-600"
                                        }`}
                                      >
                                        {selectedFabric.inStockMeters > 10
                                          ? "In Stock"
                                          : selectedFabric.inStockMeters > 5
                                          ? "Low Stock"
                                          : "Limited"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Description Card */}
                                {selectedFabric.description && (
                                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                      Description
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                      {selectedFabric.description}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Drawer>

                        <Button
                          className="p-2 bg-orange-100 text-orange-600 hover:bg-orange-200"
                          onClick={() =>
                            navigate("/employee/update-fabric", {
                              state: { fabricId: fabric._id },
                            })
                          }
                        >
                          <MdOutlineEdit className="w-5 h-5" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button className="p-2 bg-red-100 text-red-600 hover:bg-red-200">
                              <FaRegTrashCan />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Fabric?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(fabric._id)}
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
                  <td colSpan="7" className="text-center py-10 text-gray-400">
                    No Fabrics Found
                  </td>
                </tr>
              )}
            </tbody>
            <thead className="bg-gray-50 dark:bg-gray-900 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  No
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Image
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Color
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Price/m
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Action
                </th>
              </tr>
            </thead>
          </table>

          {/* Pagination */}
          <div className="border-t border-gray-200 px-4 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <p className="text-sm text-gray-700 dark:text-white">
                Showing{" "}
                {data?.fabrics?.length ? (data?.page - 1) * data?.limit + 1 : 0}{" "}
                to {Math.min(data?.page * data?.limit, data?.total || 0)} of{" "}
                <span className="font-medium">{data?.total || 0}</span> entries
              </p>
            </div>
            <div>
              {data?.totalPage > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
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
                        className={
                          currentPage === (data?.totalPage || 1)
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Fabrics;
