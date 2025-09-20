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
  useDeleteClientMutation,
  useGetAllClientsQuery,
  useGetClientByIdMutation,
} from "@/features/api/clientApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EyeIcon, Users, MapPin, Phone, Mail, Calendar, User } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const Clients = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  const { data, isLoading, refetch } = useGetAllClientsQuery({
    page: currentPage,
    limit,
    search: debouncedSearchQuery || undefined,
    city: cityFilter || undefined,
    state: stateFilter || undefined,
    isActive: statusFilter || undefined,
  });

  const [deleteClient, { isSuccess, isError }] = useDeleteClientMutation();
  const [getClientById, { isLoading: getClientByIdLoading }] = useGetClientByIdMutation();

  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState();

  const handleDelete = async (clientId) => {
    await deleteClient(clientId);
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

  const handleViewClient = async (clientId) => {
    setOpen(true);
    try {
      const { data } = await getClientById(clientId);
      if (data?.success) {
        setSelectedClient(data?.client);
      }
    } catch (error) {
      console.error("Error fetching client:", error);
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
      toast.success("Client deleted successfully");
      refetch();
    } else if (isError) {
      toast.error("Failed to delete client");
    }
  }, [isSuccess, isError]);

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-600 rounded-full shadow-lg mb-3">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Clients</h1>
          <p className="text-gray-600 text-sm">Manage all client information and details</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
            <h2 className="md:text-xl font-semibold text-gray-700 dark:text-white">
              All Clients
            </h2>

            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <input
                type="text"
                placeholder="Search by name, email, mobile, or client ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm w-full sm:w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder:text-gray-500"
              />
              
              <select
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                value={cityFilter}
                onChange={e => { setCityFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Cities</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
              </select>

              <select
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                value={stateFilter}
                onChange={e => { setStateFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All States</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="West Bengal">West Bengal</option>
              </select>

              <select
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
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
                <Button onClick={() => navigate("/employee/create-client")}>
                  Add Client
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
                    Client Info
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-orange-600 mr-2" />
                        Loading clients...
                      </div>
                    </td>
                  </tr>
                ) : data?.clients?.length > 0 ? (
                  data.clients.map((client, i) => (
                    <tr key={client._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {data.limit * (data.page - 1) + (i + 1)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            {client.profileImage ? (
                              <img
                                src={client.profileImage}
                                alt={client.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <Users className="w-5 h-5 text-orange-600" />
                            )}
                          </div>
    <div>
                            <div className="font-medium text-gray-900">{client.name}</div>
                            <div className="text-gray-500 text-xs font-mono">{client.clientId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-xs">{client.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-xs">{client.mobile}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs">{client.city}, {client.state}</span>
                          </div>
                          <div className="text-xs text-gray-500">{client.pincode}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          client.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {client.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2 justify-left">
                          <Button
                            className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200"
                            onClick={() => handleViewClient(client._id)}
                          >
                            <EyeIcon className="w-5 h-5" />
                          </Button>

                          <Button
                            className="p-2 bg-orange-100 text-orange-600 hover:bg-orange-200"
                            onClick={() =>
                              navigate("/employee/update-client", {
                                state: { clientId: client._id },
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
                                <AlertDialogTitle>Delete Client?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the client and all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(client._id)}
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
                      colSpan="6"
                      className="px-6 py-10 text-center text-gray-500 dark:text-white"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Users className="w-12 h-12 text-gray-300" />
                        <p>No clients found. Add one to get started.</p>
                      </div>
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
                    Client Info
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                    Status
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
                  {data?.clients?.length ? (data?.page - 1) * data?.limit + 1 : 0}{" "}
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

        {/* Client Details Sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className="w-[600px] sm:w-[540px] overflow-y-auto">
            <SheetHeader className="pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  {selectedClient?.profileImage ? (
                    <img
                      src={selectedClient.profileImage}
                      alt={selectedClient.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <Users className="w-5 h-5 text-orange-600" />
                  )}
                </div>
                <div>
                  <SheetTitle className="text-lg font-semibold text-gray-900">
                    {selectedClient?.name || "Client Details"}
                  </SheetTitle>
                </div>
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {getClientByIdLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-600 mr-2" />
                  <span>Loading client details...</span>
                </div>
              ) : selectedClient ? (
                <>
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Basic Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name</label>
                        <p className="text-sm text-gray-900 font-medium mt-1">{selectedClient.name}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Client ID</label>
                        <p className="text-sm text-gray-900 font-mono font-medium mt-1">{selectedClient.clientId}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gender</label>
                        <p className="text-sm text-gray-900 capitalize font-medium mt-1">{selectedClient.gender || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date of Birth</label>
                        <p className="text-sm text-gray-900 font-medium mt-1">
                          {selectedClient.dateOfBirth 
                            ? new Date(selectedClient.dateOfBirth).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : "Not specified"
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Contact Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                          <p className="text-sm text-gray-900 font-medium">{selectedClient.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mobile</label>
                          <p className="text-sm text-gray-900 font-medium">{selectedClient.mobile}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</label>
                        <p className="text-sm text-gray-900 font-medium mt-1">{selectedClient.address}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">City</label>
                          <p className="text-sm text-gray-900 font-medium mt-1">{selectedClient.city}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">State</label>
                          <p className="text-sm text-gray-900 font-medium mt-1">{selectedClient.state}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pincode</label>
                          <p className="text-sm text-gray-900 font-medium mt-1">{selectedClient.pincode}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Branch and Registration Info */}
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Branch & Registration Information
                    </h4>
                    <div className="space-y-3">
                      {selectedClient.branchId && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Branch</label>
                          <p className="text-sm text-gray-900 font-medium mt-1">
                            {selectedClient.branchId.branchName} - {selectedClient.branchId.address}
                          </p>
                        </div>
                      )}
                      {selectedClient.registeredBy && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Registered By</label>
                          <p className="text-sm text-gray-900 font-medium mt-1">
                            {selectedClient.registeredBy.name} ({selectedClient.registeredBy.employeeId}) - {selectedClient.registeredBy.role}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status and Additional Info */}
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Status & Additional Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedClient.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedClient.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {selectedClient.notes && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes</label>
                          <p className="text-sm text-gray-900 font-medium mt-1">{selectedClient.notes}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Registered On</label>
                        <p className="text-sm text-gray-900 font-medium mt-1">
                          {new Date(selectedClient.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Image */}
                  {selectedClient.profileImage && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Profile Image</h4>
                      <div className="flex justify-center">
                        <img
                          src={selectedClient.profileImage}
                          alt={selectedClient.name}
                          className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <Users className="w-12 h-12 text-gray-300 mb-2" />
                  <p>No client data available</p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Clients;
