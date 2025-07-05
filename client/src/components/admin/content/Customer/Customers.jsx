import React, { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { GrPowerCycle } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetAllCustomersQuery,
  useDeleteCustomerMutation,
  useGetCustomerByIdMutation,
} from "@/features/api/customerApi";
import { RiCustomerServiceLine } from "react-icons/ri";
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
import { ContactRound, EyeIcon } from "lucide-react";
import { Drawer } from "antd";
import { Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/Debounce";

const Customers = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data, isLoading, refetch } = useGetAllCustomersQuery({
    page: currentPage,
    limit,
    search: debouncedSearchQuery,
  });

  const [deleteCustomer, { isSuccess, isError }] = useDeleteCustomerMutation();

  //Drawer ANTD
  const [open, setOpen] =  useState(false);
  const [loading, setLoading] =  useState(true);
  const showLoading = () => {
    setOpen(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [getCustomerById, { isLoading: getCustomerLoading }] =
    useGetCustomerByIdMutation();

  const handleViewCustomer = async (customerId) => {
    setOpen(true);
    try {
      const { data } = await getCustomerById(customerId);
      if (data?.success) {
        setSelectedCustomer(data?.customer);
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };

  const handleDelete = async (customerId) => {
    await deleteCustomer(customerId);
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
      toast.success("Customer Deleted Successfully");
      refetch();
    } else if (isError) {
      toast.error("Failed to delete customer");
    }
  }, [isSuccess, isError]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-[100vh] rounded-md">
      <div className="md:p-6 p-2">
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
          <h2 className="md:text-xl font-semibold text-gray-700 text-center dark:text-white">
            All Customers
          </h2>

          <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by name, mobile, email"
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

              <Button onClick={() => navigate("/admin/create-customer")}>
                Add Customer
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center">
                    Loading...
                  </td>
                </tr>
              ) : data?.customers?.length > 0 ? (
                data?.customers?.map((customer, i) => (
                  <tr key={customer._id} className="text-left">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {data.limit * (data.page - 1) + (i + 1)}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">
                      {customer?.profileImage ? (
                        <img
                          src={customer.profileImage}
                          alt={customer.name}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.png";
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white font-semibold">
                          {customer?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {customer.mobile}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2 justify-center">
                        <Button
                          className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200"
                          onClick={() => handleViewCustomer(customer._id)}
                        >
                          <EyeIcon className="w-5 h-5" />
                        </Button>

                        <Drawer
                          title={
                            selectedCustomer ? (
                              <span className="text-lg font-semibold">
                                {selectedCustomer?.name}
                              </span>
                            ) : (
                              "Loading..."
                            )
                          }
                          placement="right"
                          width={400}
                          onClose={() => {
                            setOpen(false);
                            setSelectedCustomer(null);
                          }}
                          open={open}
                          mask={false}
                        >
                          {isLoading || !selectedCustomer ? (
                            <div className="flex justify-center items-center h-40">
                              <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                          ) : (
                            <div className="space-y-3 text-sm">
                              <p>
                                <strong>Name:</strong> {selectedCustomer?.name}
                              </p>
                              <p>
                                <strong>Mobile:</strong>{" "}
                                {selectedCustomer?.mobile}
                              </p>
                              <p>
                                <strong>Email:</strong>{" "}
                                {selectedCustomer?.email || "N/A"}
                              </p>
                              {selectedCustomer?.measurements?.length > 0 && (
                                <div>
                                  <p className="font-semibold mt-4">
                                    Measurements:
                                  </p>
                                  {selectedCustomer?.measurements.map(
                                    (m, i) => (
                                      <div
                                        key={i}
                                        className="mt-2 border p-2 rounded bg-gray-50"
                                      >
                                        <p>
                                          <strong>Item:</strong> {m.itemType}
                                        </p>

                                        {m?.values &&
                                          typeof m.values === "object" &&
                                          Object.entries(m.values).map(
                                            ([key, value]) =>
                                              value && (
                                                <p key={key}>
                                                  {key}: {value}
                                                </p>
                                              )
                                          )}

                                        {m?.style && <p>Style: {m?.style}</p>}
                                        {m?.designNumber && (
                                          <p>Design #: {m?.designNumber}</p>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </Drawer>

                        <Button
                          className="p-2 bg-orange-100 text-orange-600 hover:bg-orange-200"
                          onClick={() =>
                            navigate("/admin/update-customer", {
                              state: { customerId: customer._id },
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
                                Delete Customer?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(customer._id)}
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
                    <ContactRound className="w-10 h-10 mx-auto text-gray-400" />
                    <p className="text-lg font-medium text-gray-500">
                      No Customers Available
                    </p>
                    <p className="text-sm text-gray-400">
                      Add a new customer to get started
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
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
                {data?.customers?.length
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

export default Customers;
