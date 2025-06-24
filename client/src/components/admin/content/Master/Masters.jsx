import React, { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { GrPowerCycle } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useDeleteMasterMutation,
  useGetAllMastersQuery,
  useGetMasterByIdMutation,
} from "@/features/api/masterApi";
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
import { ContactRound, EyeIcon, Loader2 } from "lucide-react";
import { Drawer } from "antd";
import { useDebounce } from "@/hooks/Debounce";

const Masters = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, isLoading, refetch } = useGetAllMastersQuery({
    page: currentPage,
    limit,
    search: debouncedSearch,
  });

  const [deleteMaster, { isSuccess, isError }] = useDeleteMasterMutation();
  const [getMasterById] = useGetMasterByIdMutation();

  const [open, setOpen] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState(null);

  const handleViewMaster = async (masterId) => {
    setOpen(true);
    try {
      const { data } = await getMasterById(masterId);
      console.log(data);
      if (data?.success) {
        setSelectedMaster(data.master);
      }
    } catch (err) {
      console.error("Error fetching master:", err);
    }
  };

  const handleDelete = async (masterId) => {
    await deleteMaster(masterId);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Master deleted successfully");
      refetch();
    } else if (isError) {
      toast.error("Failed to delete master");
    }
  }, [isSuccess, isError]);

  const getPageNumbers = () => {
    const totalPages = data?.totalPage || 1;
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    let start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    let end = Math.min(start + 4, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-[100vh] rounded-md">
      <div className="md:p-6 p-2">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-white">
            All Masters
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm w-full sm:w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder:text-gray-500"
            />

            <div className="flex flex-row gap-2">
              <Select
                value={limit.toString()}
                onValueChange={(v) => setLimit(Number(v))}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={() => navigate("/admin/create-master")}>
                Add Master
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
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  No
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Profile
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : data?.masters?.length > 0 ? (
                data.masters.map((master, index) => (
                  <tr key={master._id} className="text-left border-t">
                    <td className="px-6 py-4">
                      {(data.page - 1) * data.limit + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      {master.photoUrl ? (
                        <img
                          src={master.photoUrl}
                          alt={master.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                          {master?.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">{master.name}</td>
                    <td className="px-6 py-4">{master.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          master?.status
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        }`}
                      >
                        {master?.status ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4 flex gap-2 items-center">
                      <Button
                        className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200"
                        onClick={() => handleViewMaster(master._id)}
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Button>

                      <Button
                        className="p-2 bg-orange-100 text-orange-600 hover:bg-orange-200"
                        onClick={() =>
                          navigate("/admin/update-master", {
                            state: { masterId: master._id },
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
                            <AlertDialogTitle>Delete Master?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(master._id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-10">
                    <ContactRound className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-gray-500 text-sm">No masters found</p>
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
                  Profile
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase">
                  Actions
                </th>
              </tr>
            </thead>
          </table>

          <div className="border-t border-gray-200 px-4 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <p className="text-sm text-gray-700 dark:text-white">
                Showing{" "}
                {data?.masters?.length ? (data?.page - 1) * data?.limit + 1 : 0}{" "}
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

        <Drawer
          title={
            <div className="flex items-center gap-3">
              {selectedMaster?.photoUrl ? (
                <img
                  src={selectedMaster.photoUrl}
                  alt={selectedMaster.name}
                  className="w-10 h-10 rounded-full object-cover border"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white">
                  {selectedMaster?.name?.charAt(0).toUpperCase() || "M"}
                </div>
              )}
              <span className="font-semibold text-lg">
                {selectedMaster?.name || "Master Info"}
              </span>
            </div>
          }
          placement="right"
          width={400}
          onClose={() => {
            setOpen(false);
            setSelectedMaster(null);
          }}
          open={open}
          mask={false}
        >
          {selectedMaster ? (
            <div className="space-y-5 p-2 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-gray-500">Name</span>
                <p className="text-base font-medium text-gray-800 dark:text-white">
                  {selectedMaster.name}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-gray-500">Email</span>
                <p className="text-base text-gray-700 dark:text-white">
                  {selectedMaster.email || "N/A"}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-gray-500">Status</span>
                <span
                  className={`px-2 py-1 text-xs rounded-md w-fit ${
                    selectedMaster.status
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedMaster.status ? "Active" : "Inactive"}
                </span>
              </div>

              {selectedMaster.photoUrl && (
                <div className="flex flex-col gap-2">
                  <span className="text-gray-500">Profile Photo</span>
                  <img
                    src={selectedMaster.photoUrl}
                    alt={selectedMaster.name}
                    className="w-24 h-24 rounded-full object-cover border mx-auto"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}
        </Drawer>
      </div>
    </section>
  );
};

export default Masters;
