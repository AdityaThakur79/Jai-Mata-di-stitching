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
import { Building2 } from "lucide-react";
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

  const [deleteBranch, { isSuccess, isError }] = useDeleteBranchMutation();

  const handleDelete = async (branchId) => {
    await deleteBranch(branchId);
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
      toast.error("Failed to delete branch");
    }
  }, [isSuccess, isError]);

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

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-[100vh] rounded-md">
      <div className="md:p-6 p-2">
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
          <h2 className="md:text-xl font-semibold text-gray-700 text-center dark:text-white">
            All Branches
          </h2>

          <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="text"
              placeholder="Search branch by name, phone, email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm w-full sm:w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder:text-gray-500"
            />

            <div className="flex gap-4 justify-center items-center">
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

              <Button onClick={() => navigate("/admin/create-branch")}>
                Add Branch
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
                  Branch Name
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center">
                    Loading...
                  </td>
                </tr>
              ) : data?.branches?.length > 0 ? (
                data?.branches?.map((branch, i) => (
                  <tr key={branch._id} className="text-left">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {data.limit * (data.page - 1) + (i + 1)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {branch.branchName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {branch.phone || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {branch.email || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {branch.status}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2 justify-start">                
                          <Button
                            className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200"
                            onClick={() => handleViewBranch(branch?._id)}
                          >
                            <EyeIcon className="w-5 h-5" />
                          </Button>
                        <Button
                          className="p-2 bg-orange-100 text-orange-600 hover:bg-orange-200"
                          onClick={() =>
                            navigate("/admin/update-branch", {
                              state: { branchId: branch._id },
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
                                Delete Branch?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(branch._id)}
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
                  <td colSpan="6" className="px-6 py-10 text-center">
                    <Building2 className="w-10 h-10 mx-auto text-gray-400" />
                    <p className="text-lg font-medium text-gray-500">
                      No Branches Available
                    </p>
                    <p className="text-sm text-gray-400">
                      Add a new branch to get started
                    </p>
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
                  Branch Name
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
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
                {data?.branches?.length
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

      <Drawer
  title={
    selectedBranch ? (
      <span className="text-lg font-semibold">{selectedBranch?.branchName}</span>
    ) : (
      "Loading..."
    )
  }
  placement="right"
  width={400}
  onClose={() => {
    setOpen(false);
    setSelectedBranch(null);
  }}
  open={open}
  mask={false}
>
  {branchLoading || !selectedBranch ? (
    <div className="flex justify-center items-center h-40">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
  ) : (
    <div className="space-y-3 text-sm">
      <p><strong>Branch Name:</strong> {selectedBranch?.branchName}</p>
      <p><strong>Phone:</strong> {selectedBranch?.phone || "N/A"}</p>
      <p><strong>Email:</strong> {selectedBranch?.email || "N/A"}</p>
      <p><strong>Status:</strong> {selectedBranch?.status}</p>
      <p><strong>Address:</strong> {selectedBranch?.address || "N/A"}</p>
      <p><strong>GST:</strong> {selectedBranch?.gst || "N/A"}</p>
      <p><strong>PAN:</strong> {selectedBranch?.pan || "N/A"}</p>
      <p><strong>SCN:</strong> {selectedBranch?.scn || "N/A"}</p>
    </div>
  )}
</Drawer>


    </section>

    
  );
};

export default Branches;
