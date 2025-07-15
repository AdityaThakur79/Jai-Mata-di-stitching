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
import { EyeIcon } from "lucide-react";
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
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { data, isLoading, refetch } = useGetAllItemMastersQuery({
    page: currentPage,
    limit,
    search: debouncedSearchQuery,
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
    <section className="bg-gray-50 dark:bg-gray-900 min-h-[100vh] rounded-md">
      <div className="md:p-6 p-2">
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
              <Button onClick={() => navigate("/admin/create-item")}>
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
                  Charge
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Fields
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center">
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
                              <span className="text-lg font-semibold">
                                {selectedItem?.name}
                              </span>
                            ) : (
                              "Loading..."
                            )
                          }
                          placement="right"
                          width={400}
                          onClose={() => {
                            setOpen(false);
                            setSelectedItem(null);
                          }}
                          open={open}
                          mask={false}
                        >
                          {isLoading || !selectedItem ? (
                            <div className="flex justify-center items-center h-40">
                              <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                          ) : (
                            <div className="space-y-3 text-sm">
                              {/* Image Section */}
                              {selectedItem?.itemImage && (
                                <div className="w-full h-48 md:h-64 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 mb-4">
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
                                      e.currentTarget.src = "/placeholder.png"; // fallback image
                                    }}
                                    style={{ cursor: selectedItem.secondaryItemImage ? 'pointer' : 'default' }}
                                  />
                                  {selectedItem.secondaryItemImage && (
                                    <div className="text-xs text-center text-gray-500 mt-1">Hover to see secondary image</div>
                                  )}
                                </div>
                              )}
                              {/* Details Section */}
                              <p>
                                <strong>Item Type:</strong> {selectedItem?.name}
                              </p>
                              <p>
                                <strong>Item Description:</strong>{" "}
                                {selectedItem?.description}
                              </p>
                              <p>
                                <strong>Item Charge:</strong>{" "}
                                {selectedItem?.stitchingCharge}
                              </p>

                              {selectedItem?.fields?.length > 0 && (
                                <div>
                                  <p className="font-semibold mt-4">
                                    Measurement Fields:
                                  </p>
                                  {selectedItem?.fields.map((m, i) => (
                                    <div
                                      key={i}
                                      className="mt-2 flex border p-2 rounded bg-gray-50"
                                    >
                                      <p>{m}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </Drawer>

                        <Button
                          className="p-2 bg-orange-100 text-orange-600 hover:bg-orange-200"
                          onClick={() =>
                            navigate("/admin/update-item", {
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
                    colSpan="4"
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
              Charge
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Fields
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
    </section>
  );
};

export default Items;
