import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Loader2,
  ShoppingCart,
  User,
  Calendar,
  Package,
  MapPin,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  X,
  Hash,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Clock,
  CreditCard,
  Receipt,
} from "lucide-react";
import toast from "react-hot-toast";
import { useGetAllOrdersQuery, useGetAllOrdersStatsQuery } from "@/features/api/orderApi";
import { useGetOrderByIdMutation, useDeleteOrderMutation, useGenerateBillMutation, useUpdateOrderStatusMutation, useUpdatePaymentStatusMutation } from "@/features/api/orderApi";
import { useDebounce } from "@/hooks/Debounce";
import { Label } from "recharts";

const PendingOrders = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderTypeFilter, setOrderTypeFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data, isLoading, refetch } = useGetAllOrdersQuery({
    page: currentPage,
    limit,
    status: statusFilter === "all" ? undefined : statusFilter || undefined,
    orderType: orderTypeFilter === "all" ? undefined : orderTypeFilter || undefined,
    priority: priorityFilter === "all" ? undefined : priorityFilter || undefined,
    search: debouncedSearchQuery || undefined,
  });

  const { data: statsData, isLoading: statsLoading } = useGetAllOrdersStatsQuery();

  const [getOrderById, { isLoading: getOrderByIdLoading }] = useGetOrderByIdMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const [generateBill, { isLoading: isGeneratingBill }] = useGenerateBillMutation();
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();
  const [updatePaymentStatus, { isLoading: isUpdatingPayment }] = useUpdatePaymentStatusMutation();

  // Status and payment management states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrderForUpdate, setSelectedOrderForUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [inlinePaymentStatus, setInlinePaymentStatus] = useState("");

  const handleViewOrder = async (orderId) => {
    setOpen(true);
    try {
      const { data } = await getOrderById(orderId);
      if (data?.success) {
        setSelectedOrder(data?.order);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Error fetching order details");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const { data } = await deleteOrder(orderId);
        if (data?.success) {
          toast.success("Order deleted successfully");
          refetch();
        } else {
          toast.error(data?.message || "Failed to delete order");
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error("Error deleting order");
      }
    }
  };

  const handleGenerateBill = async (orderId) => {
    try {
      const { data } = await generateBill({ orderId });
      if (data?.success) {
        toast.success("Bill generated successfully");
        refetch();
        setOpen(false);
      } else {
        toast.error(data?.message || "Failed to generate bill");
      }
    } catch (error) {
      console.error("Error generating bill:", error);
      toast.error("Error generating bill");
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrderForUpdate || !newStatus) return;
    
    try {
      const { data } = await updateOrderStatus({
        orderId: selectedOrderForUpdate._id,
        status: newStatus,
        notes: statusNotes,
      });
      
      if (data?.success) {
        toast.success("Order status updated successfully");
        setShowStatusModal(false);
        setNewStatus("");
        setStatusNotes("");
        setSelectedOrderForUpdate(null);
        refetch();
        if (selectedOrder?._id === selectedOrderForUpdate._id) {
          setSelectedOrder(data.order);
        }
      } else {
        toast.error(data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    }
  };

  const handleUpdatePayment = async () => {
    if (!selectedOrderForUpdate || !paymentStatus) return;
    
    try {
      const { data } = await updatePaymentStatus({
        orderId: selectedOrderForUpdate._id,
        paymentStatus,
        paymentAmount: paymentAmount ? parseFloat(paymentAmount) : undefined,
        paymentMethod,
        paymentNotes,
      });
      
      if (data?.success) {
        toast.success("Payment status updated successfully");
        setShowPaymentModal(false);
        setPaymentStatus("");
        setPaymentAmount("");
        setPaymentMethod("");
        setPaymentNotes("");
        setSelectedOrderForUpdate(null);
        refetch();
        if (selectedOrder?._id === selectedOrderForUpdate._id) {
          setSelectedOrder(data.order);
        }
      } else {
        toast.error(data?.message || "Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Error updating payment status");
    }
  };

  const openStatusModal = (order) => {
    setSelectedOrderForUpdate(order);
    setNewStatus(order.status);
    setStatusNotes("");
    setShowStatusModal(true);
  };

  const openPaymentModal = (order) => {
    setSelectedOrderForUpdate(order);
    setPaymentStatus(order.paymentStatus || "pending");
    setPaymentAmount(order.paymentAmount?.toString() || "");
    setPaymentMethod(order.paymentMethod || "");
    setPaymentNotes(order.paymentNotes || "");
    setShowPaymentModal(true);
  };

  const handleInlineStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    try {
      const { data } = await updateOrderStatus({
        orderId,
        status: newStatus,
        notes: "Status updated from table",
      });
      
      if (data?.success) {
        toast.success("Status updated successfully");
        refetch();
        setEditingOrder(null);
        setEditingField(null);
      } else {
        toast.error(data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handleInlinePriorityUpdate = async (orderId, newPriority) => {
    setUpdatingOrder(orderId);
    try {
      const { data } = await updateOrderStatus({
        orderId,
        priority: newPriority,
        notes: "Priority updated from table",
      });
      
      if (data?.success) {
        toast.success("Priority updated successfully");
        refetch();
        setEditingOrder(null);
        setEditingField(null);
      } else {
        toast.error(data?.message || "Failed to update priority");
      }
    } catch (error) {
      console.error("Error updating priority:", error);
      toast.error("Error updating priority");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handleInlinePaymentUpdate = async (orderId) => {
    if (!inlinePaymentStatus) return;
    setUpdatingOrder(orderId);
    try {
      const { data } = await updatePaymentStatus({
        orderId,
        paymentStatus: inlinePaymentStatus,
      });
      if (data?.success) {
        toast.success("Payment updated successfully");
        refetch();
        setEditingOrder(null);
        setEditingField(null);
        setInlinePaymentStatus("");
      } else {
        toast.error(data?.message || "Failed to update payment");
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error("Error updating payment");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const startEditing = (orderId, field) => {
    setEditingOrder(orderId);
    setEditingField(field);
  };

  const cancelEditing = () => {
    setEditingOrder(null);
    setEditingField(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-indigo-100 text-indigo-800";
      case "measurement_taken":
        return "bg-purple-100 text-purple-800";
      case "cutting":
        return "bg-pink-100 text-pink-800";
      case "stitching":
        return "bg-cyan-100 text-cyan-800";
      case "quality_check":
        return "bg-orange-100 text-orange-800";
      case "ready_for_delivery":
        return "bg-teal-100 text-teal-800";
      case "out_for_delivery":
        return "bg-amber-100 text-amber-800";
      case "delivered":
        return "bg-emerald-100 text-emerald-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "on_hold":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "partial":
        return "bg-orange-100 text-orange-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-600 rounded-full shadow-lg mb-3">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">All Orders</h1>
              <p className="text-gray-600 text-sm">Manage and track all orders</p>
            </div>
            <Button
              onClick={() => navigate("/employee/create-order")}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Order
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        {statsData?.stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Orders */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{statsData.stats.overview.totalOrders}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    +{statsData.stats.overview.recentOrders} this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Active Orders */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{statsData.stats.overview.activeOrders}</p>
                  <p className="text-xs text-orange-600 mt-1">
                    {statsData.stats.overview.completionRate}% completed
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(statsData.stats.overview.totalRevenue)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {formatCurrency(statsData.stats.overview.avgOrderValue)} avg
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Bill Generation Rate */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bill Generation</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsData.stats.overview.billGenerationRate}%
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    {statsData.stats.overview.ordersWithBills} of {statsData.stats.overview.totalOrders} orders
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Breakdown */}
        {statsData?.stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">Pending</p>
                  <p className="text-lg font-bold text-yellow-900">{statsData.stats.statusBreakdown.pending.count}</p>
                  <p className="text-xs text-yellow-600">{formatCurrency(statsData.stats.statusBreakdown.pending.amount)}</p>
                </div>
                <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-700" />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">In Progress</p>
                  <p className="text-lg font-bold text-blue-900">{statsData.stats.statusBreakdown.in_progress.count}</p>
                  <p className="text-xs text-blue-600">{formatCurrency(statsData.stats.statusBreakdown.in_progress.amount)}</p>
                </div>
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                  <Package className="w-4 h-4 text-blue-700" />
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Completed</p>
                  <p className="text-lg font-bold text-green-900">{statsData.stats.statusBreakdown.completed.count}</p>
                  <p className="text-xs text-green-600">{formatCurrency(statsData.stats.statusBreakdown.completed.amount)}</p>
                </div>
                <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-700" />
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">Cancelled</p>
                  <p className="text-lg font-bold text-red-900">{statsData.stats.statusBreakdown.cancelled.count}</p>
                  <p className="text-xs text-red-600">{formatCurrency(statsData.stats.statusBreakdown.cancelled.amount)}</p>
                </div>
                <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
                  <X className="w-4 h-4 text-red-700" />
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-800">High Priority</p>
                  <p className="text-lg font-bold text-orange-900">{statsData.stats.priorityBreakdown.high.count}</p>
                  <p className="text-xs text-orange-600">{formatCurrency(statsData.stats.priorityBreakdown.high.amount)}</p>
                </div>
                <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-orange-700" />
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">Urgent</p>
                  <p className="text-lg font-bold text-red-900">{statsData.stats.priorityBreakdown.urgent.count}</p>
                  <p className="text-xs text-red-600">{formatCurrency(statsData.stats.priorityBreakdown.urgent.amount)}</p>
                </div>
                <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-700" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={orderTypeFilter} onValueChange={setOrderTypeFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Order Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="fabric">Fabric Only</SelectItem>
                <SelectItem value="fabric_stitching">Fabric + Stitching</SelectItem>
                <SelectItem value="stitching">Stitching Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setOrderTypeFilter("all");
                setPriorityFilter("all");
              }}
              className="h-9"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-orange-600 mr-2" />
              <span>Loading orders...</span>
            </div>
          ) : data?.orders?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <ShoppingCart className="w-12 h-12 text-gray-300 mb-2" />
              <p>No orders found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      Priority
                      <span className="text-xs text-gray-400">(click to edit)</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      Status
                      <span className="text-xs text-gray-400">(click to edit)</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Payment</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.orders?.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.clientDetails?.name || order.client?.name}</p>
                        <p className="text-sm text-gray-500">{order.clientDetails?.mobile || order.client?.mobile}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {order.orderType?.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.items?.length || 0}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order.totalAmount || 0)}
                    </TableCell>
                    <TableCell>
                      {editingOrder === order._id && editingField === 'priority' ? (
                        <div className="flex items-center gap-2">
                          <Select
                            value={order.priority}
                            onValueChange={(value) => handleInlinePriorityUpdate(order._id, value)}
                            disabled={updatingOrder === order._id}
                          >
                            <SelectTrigger className="w-24 h-6 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                          {updatingOrder === order._id ? (
                            <Loader2 className="w-3 h-3 animate-spin text-orange-600" />
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelEditing}
                              className="h-6 w-6 p-0 text-gray-400 "
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div 
                          className="cursor-pointer rounded px-2 py-1 hover:bg-transparent"
                          onClick={() => startEditing(order._id, 'priority')}
                        >
                          <Badge className={getPriorityColor(order.priority)}>
                            {order.priority}
                          </Badge>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingOrder === order._id && editingField === 'status' ? (
                        <div className="flex items-center gap-2">
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleInlineStatusUpdate(order._id, value)}
                            disabled={updatingOrder === order._id}
                          >
                            <SelectTrigger className="w-32 h-6 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="measurement_taken">Measurement Taken</SelectItem>
                              <SelectItem value="cutting">Cutting</SelectItem>
                              <SelectItem value="stitching">Stitching</SelectItem>
                              <SelectItem value="quality_check">Quality Check</SelectItem>
                              <SelectItem value="ready_for_delivery">Ready for Delivery</SelectItem>
                              <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                              <SelectItem value="on_hold">On Hold</SelectItem>
                            </SelectContent>
                          </Select>
                          {updatingOrder === order._id ? (
                            <Loader2 className="w-3 h-3 animate-spin text-orange-600" />
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelEditing}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div 
                          className="cursor-pointer rounded px-2 py-1 hover:bg-transparent"
                          onClick={() => startEditing(order._id, 'status')}
                        >
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingOrder === order._id && editingField === 'payment' ? (
                        <div className="flex items-center gap-2 justify-center">
                          <Select
                            value={inlinePaymentStatus || order.paymentStatus || "pending"}
                            onValueChange={(value) => setInlinePaymentStatus(value)}
                            disabled={updatingOrder === order._id}
                          >
                            <SelectTrigger className="w-28 h-6 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="partial">Partial</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="overdue">Overdue</SelectItem>
                              <SelectItem value="refunded">Refunded</SelectItem>
                            </SelectContent>
                          </Select>
                          {updatingOrder === order._id ? (
                            <Loader2 className="w-3 h-3 animate-spin text-orange-600" />
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleInlinePaymentUpdate(order._id)}
                                className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                                title="Save"
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={cancelEditing}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                                title="Cancel"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      ) : (
                        <div 
                          className="cursor-pointer rounded px-2 py-1 hover:bg-transparent flex items-center justify-center"
                          onClick={() => { startEditing(order._id, 'payment'); setInlinePaymentStatus(order.paymentStatus || 'pending'); }}
                          title="Click to change"
                        >
                          <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                            {order.paymentStatus || 'pending'}
                          </Badge>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewOrder(order._id)}
                          className="h-8 w-8 p-0 hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/employee/edit-order/${order._id}`)}
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          title="Edit Order"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {!order.bill && (order.status === "pending" || order.status === "completed") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGenerateBill(order._id)}
                            disabled={isGeneratingBill}
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                            title="Generate Bill"
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        )}
                        {order.bill && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/employee/completed-client-orders`)}
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="View Bill"
                          >
                            <Receipt className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteOrder(order._id)}
                          disabled={isDeleting}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {data?.totalPage > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-700">
              Showing {data?.currentPageCount} of {data?.total} orders
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {data?.totalPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === data?.totalPage}
              >
                Next
              </Button>
            </div>
          </div>
        )}

      {/* Order Details Sheet - Enhanced UI */}
 

        {/* Status Update Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Update Order Status</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">New Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="measurement_taken">Measurement Taken</SelectItem>
                      <SelectItem value="cutting">Cutting</SelectItem>
                      <SelectItem value="stitching">Stitching</SelectItem>
                      <SelectItem value="quality_check">Quality Check</SelectItem>
                      <SelectItem value="ready_for_delivery">Ready for Delivery</SelectItem>
                      <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Notes (Optional)</Label>
                  <Input
                    placeholder="Add notes about status change"
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  onClick={() => setShowStatusModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateStatus}
                  disabled={isUpdatingStatus || !newStatus}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isUpdatingStatus ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Update Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Update Payment Status</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Payment Status</Label>
                  <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Payment Amount (₹)</Label>
                  <Input
                    type="number"
                    placeholder="Enter payment amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="mt-1"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Payment Notes (Optional)</Label>
                  <Input
                    placeholder="Add payment notes"
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  onClick={() => setShowPaymentModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdatePayment}
                  disabled={isUpdatingPayment || !paymentStatus}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {isUpdatingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Payment"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingOrders;
