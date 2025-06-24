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
            <Button onClick={() => navigate("/admin/create-fabric")}>
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
                            <span className="text-lg font-semibold">
                              {selectedFabric?.name || "Loading..."}
                            </span>
                          }
                          placement="right"
                          width={400}
                          onClose={() => {
                            setDrawerOpen(false);
                            setSelectedFabric(null);
                          }}
                          open={drawerOpen}
                          mask={false}
                        >
                          {!selectedFabric ? (
                            <div className="flex justify-center items-center h-40">
                              <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                          ) : (
                            <div className="space-y-4 p-4 border rounded-md bg-white dark:bg-gray-900 shadow-md">
                              {/* Image Section */}
                              {selectedFabric?.fabricImage && (
                                <div className="w-full h-48 md:h-64 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                                  <img
                                    src={selectedFabric.fabricImage}
                                    alt={selectedFabric.name}
                                    className="w-full h-full object-cover object-center"
                                    onError={(e) => {
                                      e.currentTarget.src = "/placeholder.png"; // fallback image
                                    }}
                                  />
                                </div>
                              )}

                              {/* Details Section */}
                              <div className="space-y-2 text-sm md:text-base">
                                <p className="text-gray-700 dark:text-gray-300">
                                  <span className="font-medium">Name:</span>{" "}
                                  {selectedFabric.name}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  <span className="font-medium">Type:</span>{" "}
                                  {selectedFabric.type}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  <span className="font-medium">Color:</span>{" "}
                                  {selectedFabric.color}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  <span className="font-medium">Pattern:</span>{" "}
                                  {selectedFabric.pattern || "N/A"}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  <span className="font-medium">Price/m:</span>{" "}
                                  ₹{selectedFabric.pricePerMeter}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  <span className="font-medium">In Stock:</span>{" "}
                                  {selectedFabric.inStockMeters} meters
                                </p>
                                {selectedFabric.description && (
                                  <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-medium">
                                      Description:
                                    </span>{" "}
                                    {selectedFabric.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </Drawer>

                        <Button
                          className="p-2 bg-orange-100 text-orange-600 hover:bg-orange-200"
                          onClick={() =>
                            navigate("/admin/update-fabric", {
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
      {data?.fabrics?.length
        ? (data?.page - 1) * data?.limit + 1
        : 0}{" "}
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
