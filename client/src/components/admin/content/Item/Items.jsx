import React, { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { GrPowerCycle } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useDebounce } from "@/hooks/Debounce";
import {
  useDeleteItemMasterMutation,
  useGetAllItemMastersQuery,
  useGetItemMasterByIdMutation,
} from "@/features/api/itemApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EyeIcon, Package } from "lucide-react";
import { Drawer } from "antd";
import { Loader2 } from "lucide-react";
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

const Items = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { data, isLoading, refetch } = useGetAllItemMastersQuery({
    page: currentPage,
    limit,
    search: debouncedSearchQuery,
    category: categoryFilter,
  });

  const [deleteItemMaster, { isSuccess, isError }] =
    useDeleteItemMasterMutation();

  const handleDelete = async (itemId) => {
    await deleteItemMaster(itemId);
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

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState();
  const [showSecondary, setShowSecondary] = useState(false);

  // const showLoading = () => {
  //   setOpen(true);
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 2000);
  // };

  const [getItemMasterById, { isLoading: getItemMasterByIdLoading }] =
    useGetItemMasterByIdMutation();

  const handleViewItem = async (itemId) => {
    setOpen(true);
    try {
      const { data } = await getItemMasterById(itemId);
      if (data?.success) {
        setSelectedItem(data?.item);
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
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
      toast.success("Item deleted successfully");
      refetch();
    } else if (isError) {
      toast.error("Failed to delete item");
    }
  }, [isSuccess, isError]);

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-600 rounded-full shadow-lg mb-3">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Item Masters</h1>
          <p className="text-gray-600 text-sm">Manage all item types, measurement fields, and styles</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
            <h2 className="md:text-xl font-semibold text-gray-700 dark:text-white">
              All Item Masters
            </h2>

          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="text"
              placeholder="Search by item type"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm w-full sm:w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder:text-gray-500"
            />
            <select
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              value={categoryFilter}
              onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Categories</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
            </select>

            <div className="flex gap-2 items-center">
              <Select
                value={limit.toString()}
                onValueChange={handleLimitChange}
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
              <Button onClick={() => navigate("/employee/create-item")}>
                Add Item
              </Button>
              <Button className="p-2" onClick={() => refetch()}>
                <GrPowerCycle />
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-900 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Item Type
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Charge
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Fields
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Styles
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center">
                    Loading...
                  </td>
                </tr>
              ) : data?.items?.length > 0 ? (
                data.items.map((item, i) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {data.limit * (data.page - 1) + (i + 1)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white capitalize">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white capitalize">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white capitalize">
                      {item.stitchingCharge}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="flex flex-wrap gap-2">
                        {item.fields.slice(0, 3).map((field, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-200 text-xs px-2 py-1 rounded dark:bg-gray-700 dark:text-white"
                          >
                            {field}
                          </span>
                        ))}
                        {item.fields.length > 3 && (
                          <span className="bg-blue-200 text-xs px-2 py-1 rounded dark:bg-blue-600 dark:text-white">
                            +{item.fields.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="flex flex-wrap gap-2">
                        {item.styles?.slice(0, 2).map((style, idx) => (
                          <span
                            key={idx}
                            className="bg-orange-200 text-xs px-2 py-1 rounded dark:bg-orange-600 dark:text-white"
                            title={style.description}
                          >
                            {style.styleName}
                          </span>
                        )) || <span className="text-gray-400 text-xs">No styles</span>}
                        {item.styles?.length > 2 && (
                          <span className="bg-orange-200 text-xs px-2 py-1 rounded dark:bg-orange-600 dark:text-white">
                            +{item.styles.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2 justify-left">
                        <Button
                          className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200"
                          onClick={() => handleViewItem(item._id)}
                        >
                          <EyeIcon className="w-5 h-5" />
                        </Button>

                        <Drawer
                          title={
                            selectedItem ? (
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                  <Package className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900 uppercase">
                                    {selectedItem?.name}
                                  </h3>
                                  <p className="text-sm text-gray-500 capitalize">
                                    {selectedItem?.category} Item
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900">Loading...</h3>
                                </div>
                              </div>
                            )
                          }
                          placement="right"
                          width={450}
                          onClose={() => {
                            setOpen(false);
                            setSelectedItem(null);
                          }}
                          open={open}
                          mask={false}
                          className="custom-drawer"
                        >
                          {isLoading || !selectedItem ? (
                            <div className="flex flex-col justify-center items-center h-40 space-y-4">
                              <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                              <p className="text-gray-500 text-sm">Loading item details...</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {/* Image Section */}
                              {selectedItem?.itemImage && (
                                <div className="relative">
                                  <div className="w-full h-56 overflow-hidden rounded-xl bg-gray-100 shadow-sm border">
                                    <img
                                      src={
                                        showSecondary && selectedItem.secondaryItemImage
                                          ? selectedItem.secondaryItemImage
                                          : selectedItem.itemImage
                                      }
                                      alt={selectedItem.name}
                                      className="w-full h-full object-cover object-center transition-all duration-300"
                                      onMouseEnter={() => setShowSecondary(true)}
                                      onMouseLeave={() => setShowSecondary(false)}
                                      onError={(e) => {
                                        e.currentTarget.src = "/placeholder.png";
                                      }}
                                      style={{ cursor: selectedItem.secondaryItemImage ? 'pointer' : 'default' }}
                                    />
                                  </div>
                                  {selectedItem.secondaryItemImage && (
                                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                      Hover to see secondary image
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Basic Information Card */}
                              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                                  Basic Information
                                </h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <span className="text-gray-500 text-xs uppercase tracking-wide">Item Type</span>
                                    <p className="font-medium text-gray-900 capitalize">{selectedItem?.name}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 text-xs uppercase tracking-wide">Category</span>
                                    <p className="font-medium text-gray-900 capitalize">{selectedItem?.category}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 text-xs uppercase tracking-wide">Charge</span>
                                    <p className="font-medium text-gray-900">₹{selectedItem?.stitchingCharge || 'N/A'}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="text-gray-500 text-xs uppercase tracking-wide">Description</span>
                                    <p className="font-medium text-gray-900">{selectedItem?.description || 'No description'}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Measurement Fields Card */}
                              {selectedItem?.fields?.length > 0 && (
                                <div className="bg-blue-50 rounded-lg p-4">
                                  <h4 className="font-semibold text-blue-900 text-sm uppercase tracking-wide border-b border-blue-200 pb-2 mb-3">
                                    Measurement Fields
                                  </h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {selectedItem?.fields.map((field, i) => (
                                      <div
                                        key={i}
                                        className="bg-white border border-blue-200 rounded-lg p-3 text-center"
                                      >
                                        <span className="text-blue-800 font-medium text-sm capitalize">{field}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Styles Card */}
                              {selectedItem?.styles?.length > 0 && (
                                <div className="bg-orange-50 rounded-lg p-4">
                                  <h4 className="font-semibold text-orange-900 text-sm uppercase tracking-wide border-b border-orange-200 pb-2 mb-3">
                                    Available Styles
                                  </h4>
                                  <div className="space-y-3">
                                    {selectedItem?.styles.map((style, i) => (
                                      <div
                                        key={i}
                                        className="bg-white border border-orange-200 rounded-lg p-4 shadow-sm"
                                      >
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <h5 className="font-semibold text-orange-800 text-sm uppercase">
                                              {style.styleName}
                                            </h5>
                                            <p className="text-xs text-orange-600 mt-1">
                                              ID: <span className="font-mono">{style.styleId}</span>
                                            </p>
                                            {style.description && (
                                              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                                {style.description}
                                              </p>
                                            )}
                                          </div>
                                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-1"></div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* No Data States */}
                              {(!selectedItem?.fields?.length && !selectedItem?.styles?.length) && (
                                <div className="text-center py-8">
                                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                  <p className="text-gray-500 text-sm">No additional details available</p>
                                </div>
                              )}
                            </div>
                          )}
                        </Drawer>

                        <Button
                          className="p-2 bg-orange-100 text-orange-600 hover:bg-orange-200"
                          onClick={() =>
                            navigate("/employee/update-item", {
                              state: { itemId: item._id },
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
                              <AlertDialogTitle>Delete Item?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item._id)}
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
                  <td
                    colSpan="7"
                    className="px-6 py-10 text-center text-gray-500 dark:text-white"
                  >
                    No item masters found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
            <thead className="bg-gray-50 dark:bg-gray-900 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Item Type
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Charge
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Fields
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Styles
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
          </table>

          <div className="border-t border-gray-200 px-4 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <p className="text-sm text-gray-700 dark:text-white">
                Showing{" "}
                {data?.items?.length ? (data?.page - 1) * data?.limit + 1 : 0}{" "}
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
      </div>
    </div>
  );
};

export default Items;
