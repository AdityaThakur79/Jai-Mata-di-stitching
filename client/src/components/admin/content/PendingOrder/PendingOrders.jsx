import React, { useEffect, useState } from "react";
import {
  User2,
  Phone,
  Tag,
  ShoppingBag,
  Shirt,
  Boxes,
  UserCog,
  UserCircle2,
  Loader2,
  EyeIcon,
  FileText,
  Trash2,
  Search,
  Plus,
  RefreshCw,
  Calendar,
  Clock,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetAllPendingOrdersQuery,
  useDeletePendingOrderMutation,
  useGetPendingOrderByIdMutation,
  useGetRecentPendingOrdersQuery,
} from "@/features/api/pendingOrderApi";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useDebounce } from "@/hooks/Debounce";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Drawer } from "antd";
import { MdEmail } from "react-icons/md";

const PendingOrders = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data, isLoading, refetch } = useGetRecentPendingOrdersQuery({
    page: currentPage,
    limit,
    search: debouncedSearch,
  });

  const [deletePendingOrder, { isSuccess, isError }] =
    useDeletePendingOrderMutation();
  const [getPendingOrderById] = useGetPendingOrderByIdMutation();

  const handleDelete = async (orderId) => {
    try {
      await deletePendingOrder(orderId);
    } catch {
      toast.error("Error deleting order");
    }
  };

  const handleGenerateBill = (orderId) => {
    navigate("/admin/generate-bill", { state: { orderId } });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Order deleted successfully");
      refetch();
    } else if (isError) {
      toast.error("Failed to delete order");
    }
  }, [isSuccess, isError]);

  const handleView = async (orderId) => {
    setDrawerOpen(true);
    try {
      const { data } = await getPendingOrderById(orderId);
      if (data?.order) {
        setSelectedOrder(data.order);
      }
    } catch (err) {
      toast.error("Failed to fetch order details");
      setDrawerOpen(false);
    }
  };

  const getPageNumbers = () => {
    const totalPages = Math.ceil((data?.total || 0) / limit);
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    let start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    let end = Math.min(start + 4, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "secondary", text: "Pending" },
      billed: { variant: "default", text: "Billed" },
      expired: { variant: "destructive", text: "Expired" },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 md:p-6 p-2">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Pending Orders
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and track all pending orders
            </p>
          </div>
          <Button 
            onClick={() => navigate("/admin/create-pending-order")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Order
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data?.total || 0}
                  </p>
                </div>
                <ShoppingBag className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {data?.orders?.filter(o => o.status === 'pending').length || 0}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Billed
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {data?.orders?.filter(o => o.status === 'billed').length || 0}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Expired
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {data?.orders?.filter(o => o.status === 'expired').length || 0}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by token number or customer name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-3">
                <Select
                  value={limit.toString()}
                  onValueChange={(v) => setLimit(Number(v))}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 20, 50].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => refetch()}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders within 24 hours</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300">
                      Token
                    </th>
                    <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300">
                      Customer
                    </th>
                    <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300">
                      Order Type
                    </th>
                    <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300">
                      Staff
                    </th>
                    <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </th>
                    <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300">
                      Created
                    </th>
                    <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin w-5 h-5" />
                          <span className="text-gray-500">Loading orders...</span>
                        </div>
                      </td>
                    </tr>
                  ) : data?.orders?.length > 0 ? (
                    data.orders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-orange-600" />
                            <span className="font-mono font-medium text-orange-600 dark:text-orange-400">
                              {order.tokenNumber}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {order.customer?.name}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {order.customer?.mobile}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="capitalize">
                            {order.orderType.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="text-gray-500">Master:</span> {order.master?.name}
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-500">Salesman:</span> {order.salesman?.name}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(order.createdAt)}
                          </p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(order._id)}
                              className="text-blue-600 hover:text-blue-700"
                              title="View Details"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleGenerateBill(order._id)}
                              className="text-green-600 hover:text-green-700"
                              title="Generate Bill"
                            >
                              <Receipt className="w-4 h-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  title="Delete Order"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Order</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this order? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(order._id)}
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
                      <td colSpan="7" className="text-center py-12">
                        <div className="text-gray-500">
                          <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium">No orders found</p>
                          <p className="text-sm">Try adjusting your search criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {data?.total > limit && (
          <Card>
            <CardContent className="p-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {getPageNumbers().map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-primary text-primary-foreground" : "cursor-pointer"}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className={currentPage >= Math.ceil(data.total / limit) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Order Details Drawer */}
      <Drawer
        title="Order Details"
        placement="right"
        width={600}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        {selectedOrder ? (
          <div className="space-y-6 text-sm text-gray-700 dark:text-gray-100 px-1">
            {/* Token Number */}
            <div className="border-b pb-2">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Token Number
              </div>
              <div className="text-base font-semibold text-orange-600">
                <Tag className="inline-block w-4 h-4 mr-1" />{" "}
                {selectedOrder.tokenNumber}
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-500">
                <User2 className="w-4 h-4" /> Customer
              </div>
              <div className="ml-6">
                <p className="font-medium">{selectedOrder.customer?.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {selectedOrder.customer?.mobile}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MdEmail className="w-3 h-3" />{" "}
                  {selectedOrder.customer?.email}
                </p>
              </div>
            </div>

            {/* Order Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500">
                <ShoppingBag className="w-4 h-4" /> Order Info
              </div>
              <div className="ml-6 space-y-1">
                <p>
                  <span className="font-medium">Order Type:</span>{" "}
                  <span className="capitalize">{selectedOrder.orderType.replace('_', ' ')}</span>
                </p>
                <p>
                  <span className="font-medium">Master:</span>{" "}
                  {selectedOrder.master?.name}
                </p>
                <p>
                  <span className="font-medium">Salesman:</span>{" "}
                  {selectedOrder.salesman?.name}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {getStatusBadge(selectedOrder.status)}
                </p>
                <p>
                  <span className="font-medium">Created:</span>{" "}
                  {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500">
                <Boxes className="w-4 h-4" /> Items
              </div>
              <ul className="ml-6 space-y-3">
                {selectedOrder.items?.map((item, idx) => {
                  const fabricRate = item.fabric?.pricePerMeter || 0;
                  const stitchingRate = item.itemType?.stitchingCharge || 0;
                  const fabricCharge = fabricRate * (item.fabricMeters || 0);
                  const stitchingCharge = stitchingRate * item.quantity;

                  return (
                    <li
                      key={idx}
                      className="border p-3 rounded-md dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                    >
                      <p className="text-sm text-gray-500 mb-2">
                        Item {idx + 1}
                      </p>
                      <div className="space-y-1 text-sm">
                        <p><strong>Code:</strong> {item.itemCode}</p>
                        <p><strong>Type:</strong> {item.itemType?.name}</p>
                        <p><strong>Style:</strong> {item.style?.name || "N/A"}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                        <p><strong>Fabric:</strong> {item.fabric?.name || "N/A"}</p>
                        {item.fabricMeters && (
                          <p><strong>Fabric Meters:</strong> {item.fabricMeters}m</p>
                        )}
                        {item.designNumber && (
                          <p><strong>Design Number:</strong> {item.designNumber}</p>
                        )}
                        {item.description && (
                          <p><strong>Description:</strong> {item.description}</p>
                        )}
                        <div className="pt-2 border-t">
                          <p><strong>Fabric Price/m:</strong> ₹{fabricRate}</p>
                          <p><strong>Fabric Total:</strong> ₹{fabricCharge}</p>
                          <p><strong>Stitching Charge:</strong> ₹{stitchingCharge}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin w-6 h-6" />
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default PendingOrders;
