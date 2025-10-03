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
  Download,
  Plus,
  Loader2,
  CheckCircle,
  User,
  Calendar,
  Package,
  MapPin,
  Phone,
  Mail,
  FileText,
  CreditCard,
  Receipt,
  AlertCircle,
  Edit,
} from "lucide-react";
import toast from "react-hot-toast";
import { useGetAllOrdersQuery } from "@/features/api/orderApi";
import { useGetOrderByIdMutation, useGetOrderForInvoiceMutation, useUpdateBillPaymentStatusMutation, useGetCompletedOrdersStatsQuery } from "@/features/api/orderApi";
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import InvoiceDocument from '@/utils/invoiceTemplate.jsx';
import { useDebounce } from "@/hooks/Debounce";

const CompletedOrders = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderTypeFilter, setOrderTypeFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data, isLoading, refetch } = useGetAllOrdersQuery({
    page: currentPage,
    limit,
    status: "completed",
    orderType: orderTypeFilter === "all" ? undefined : orderTypeFilter || undefined,
    priority: priorityFilter === "all" ? undefined : priorityFilter || undefined,
    search: debouncedSearchQuery || undefined,
  });

  const { data: statsData, isLoading: statsLoading } = useGetCompletedOrdersStatsQuery();

  const [getOrderById, { isLoading: getOrderByIdLoading }] = useGetOrderByIdMutation();
  const [getOrderForInvoice, { isLoading: isGeneratingInvoice }] = useGetOrderForInvoiceMutation();
  const [updateBillPaymentStatus, { isLoading: isUpdatingPayment }] = useUpdateBillPaymentStatusMutation();
  const [invoiceData, setInvoiceData] = useState(null);
  const [showInvoiceViewer, setShowInvoiceViewer] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentFormData, setPaymentFormData] = useState({
    paymentStatus: "",
    paymentAmount: "",
    paymentMethod: "",
    paymentNotes: ""
  });

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

  const handleDownloadInvoice = async (order) => {
    if (!order.bill) {
      toast.error("No bill found for this order");
      return;
    }

    try {
      const response = await getOrderForInvoice(order._id);
      
      if (response.data?.success) {
        setInvoiceData(response.data.invoiceData);
        toast.success("Invoice data loaded successfully");
      } else {
        toast.error("Failed to load invoice data");
      }
    } catch (error) {
      console.error("Error loading invoice data:", error);
      toast.error("Error loading invoice data");
    }
  };

  const handleViewInvoice = async (order) => {
    if (!order.bill) {
      toast.error("No bill found for this order");
      return;
    }

    try {
      const response = await getOrderForInvoice(order._id);
      
      if (response.data?.success) {
        setInvoiceData(response.data.invoiceData);
        setShowInvoiceViewer(true);
        toast.success("Invoice loaded successfully");
      } else {
        toast.error("Failed to load invoice data");
      }
    } catch (error) {
      console.error("Error loading invoice data:", error);
      toast.error("Error loading invoice data");
    }
  };

  const handlePDFError = (error) => {
    console.error("PDF Generation Error:", error);
    toast.error("Error generating PDF. Please try downloading instead.");
  };

  const handleEditPayment = (order) => {
    setEditingPayment(order._id);
    setPaymentFormData({
      paymentStatus: order.paymentStatus || order.bill?.paymentStatus || "pending",
      paymentAmount: order.paymentAmount || order.bill?.totalAmount || "",
      paymentMethod: order.paymentMethod || "",
      paymentNotes: order.paymentNotes || ""
    });
  };

  const handleCancelEdit = () => {
    setEditingPayment(null);
    setPaymentFormData({
      paymentStatus: "",
      paymentAmount: "",
      paymentMethod: "",
      paymentNotes: ""
    });
  };

  const handlePaymentUpdate = async (orderId) => {
    try {
      const { data } = await updateBillPaymentStatus({
        orderId,
        ...paymentFormData
      });
      
      if (data?.success) {
        toast.success("Payment status updated successfully");
        setEditingPayment(null);
        setPaymentFormData({
          paymentStatus: "",
          paymentAmount: "",
          paymentMethod: "",
          paymentNotes: ""
        });
        refetch(); // Refresh the orders list
      } else {
        toast.error(data?.message || "Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Error updating payment status");
    }
  };

  const handlePaymentFormChange = (field, value) => {
    setPaymentFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
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
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-full shadow-lg mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Completed Orders</h1>
              <p className="text-gray-600 text-sm">View and manage completed orders with bills</p>
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
            {/* Total Completed Orders */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{statsData.stats.overview.totalCompletedOrders}</p>
                  <p className="text-xs text-green-600 mt-1">
                    +{statsData.stats.overview.recentCompleted} this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
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
                  <p className="text-xs text-blue-600 mt-1">
                    {statsData.stats.overview.collectionRate}% collected
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Pending Payments */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(statsData.stats.overview.pendingAmount)}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    {statsData.stats.paymentBreakdown.pending.count} orders
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Average Order Value */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(statsData.stats.overview.avgOrderValue)}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    Total: {formatCurrency(statsData.stats.overview.totalOrderValue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Status Breakdown */}
        {statsData?.stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Paid Orders</p>
                  <p className="text-lg font-bold text-green-900">{statsData.stats.paymentBreakdown.paid.count}</p>
                  <p className="text-xs text-green-600">{formatCurrency(statsData.stats.paymentBreakdown.paid.amount)}</p>
                </div>
                <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-700" />
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">Pending Orders</p>
                  <p className="text-lg font-bold text-yellow-900">{statsData.stats.paymentBreakdown.pending.count}</p>
                  <p className="text-xs text-yellow-600">{formatCurrency(statsData.stats.paymentBreakdown.pending.amount)}</p>
                </div>
                <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-yellow-700" />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Partial Payments</p>
                  <p className="text-lg font-bold text-blue-900">{statsData.stats.paymentBreakdown.partial.count}</p>
                  <p className="text-xs text-blue-600">{formatCurrency(statsData.stats.paymentBreakdown.partial.amount)}</p>
                </div>
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-blue-700" />
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">Overdue Orders</p>
                  <p className="text-lg font-bold text-red-900">{statsData.stats.paymentBreakdown.overdue.count}</p>
                  <p className="text-xs text-red-600">{formatCurrency(statsData.stats.paymentBreakdown.overdue.amount)}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>

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
              <CheckCircle className="w-12 h-12 text-gray-300 mb-2" />
              <p>No completed orders found</p>
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
                  <TableHead>Bill #</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Completed</TableHead>
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
                      {formatCurrency((order.bill?.totalAmount ?? order.totalAmount) || 0)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {(order.bill?.billNumber || "N/A").replace('-BILL-', '-')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {editingPayment === order._id ? (
                        <div className="space-y-2">
                          <Select
                            value={paymentFormData.paymentStatus}
                            onValueChange={(value) => handlePaymentFormChange("paymentStatus", value)}
                          >
                            <SelectTrigger className="h-8 w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="overdue">Overdue</SelectItem>
                              <SelectItem value="partial">Partial</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => handlePaymentUpdate(order._id)}
                              disabled={isUpdatingPayment}
                              className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                            >
                              {isUpdatingPayment ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="h-6 px-2 text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge className={getPaymentStatusColor(order.paymentStatus || order.bill?.paymentStatus)}>
                            {order.paymentStatus || order.bill?.paymentStatus || "pending"}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPayment(order)}
                            className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="Edit Payment Status"
                          >
                            <CreditCard className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(order.actualDeliveryDate || order.updatedAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewOrder(order._id)}
                          className="h-8 w-8 p-0 hover:bg-blue-50"
                          title="View Order Details"
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewInvoice(order)}
                          disabled={isGeneratingInvoice || !order.bill}
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                          title="View Invoice"
                        >
                          <FileText className="w-4 h-4" />
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

        {/* Order Details Sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className="w-[600px] sm:w-[540px] overflow-y-auto">
            <SheetHeader className="pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <SheetTitle className="text-lg font-semibold text-gray-900">
                    {selectedOrder?.orderNumber || "Order Details"}
                  </SheetTitle>
                  <SheetDescription className="text-sm text-gray-500">
                    Completed Order
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {getOrderByIdLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-600 mr-2" />
                  <span>Loading order details...</span>
                </div>
              ) : selectedOrder ? (
                <>
                  {/* Order Information */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Order Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order Number</label>
                        <p className="text-sm text-gray-900 font-medium mt-1">{selectedOrder.orderNumber}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order Type</label>
                        <p className="text-sm text-gray-900 font-medium mt-1 capitalize">
                          {selectedOrder.orderType?.replace("_", " ")}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Priority</label>
                        <Badge className={getPriorityColor(selectedOrder.priority)}>
                          {selectedOrder.priority}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
                        <Badge className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Amount</label>
                        <p className="text-sm text-gray-900 font-medium mt-1">
                          {formatCurrency(selectedOrder.totalAmount || 0)}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Completed Date</label>
                        <p className="text-sm text-gray-900 font-medium mt-1">
                          {formatDate(selectedOrder.actualDeliveryDate || selectedOrder.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bill Information */}
                  {selectedOrder.bill && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Receipt className="w-4 h-4" />
                        Bill Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bill Number</label>
                          <p className="text-sm text-gray-900 font-medium mt-1 font-mono">
                            {selectedOrder.bill.billNumber}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bill Date</label>
                          <p className="text-sm text-gray-900 font-medium mt-1">
                            {formatDate(selectedOrder.bill.billDate)}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Due Date</label>
                          <p className="text-sm text-gray-900 font-medium mt-1">
                            {formatDate(selectedOrder.bill.dueDate)}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Payment Status</label>
                          <Badge className={getPaymentStatusColor(selectedOrder.paymentStatus || selectedOrder.bill.paymentStatus)}>
                            {selectedOrder.paymentStatus || selectedOrder.bill.paymentStatus}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Subtotal</label>
                          <p className="text-sm text-gray-900 font-medium mt-1">
                            {formatCurrency(selectedOrder.bill.subtotal || 0)}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tax Amount</label>
                          <p className="text-sm text-gray-900 font-medium mt-1">
                            {formatCurrency(selectedOrder.bill.taxAmount || 0)}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Amount</label>
                          <p className="text-lg text-gray-900 font-bold mt-1">
                            {formatCurrency(selectedOrder.bill.totalAmount || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Client Information */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Client Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-blue-600" />
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
                          <p className="text-sm text-gray-900 font-medium">
                            {selectedOrder.clientDetails?.name || selectedOrder.client?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mobile</label>
                          <p className="text-sm text-gray-900 font-medium">
                            {selectedOrder.clientDetails?.mobile || selectedOrder.client?.mobile}
                          </p>
                        </div>
                      </div>
                      {selectedOrder.clientDetails?.email || selectedOrder.client?.email ? (
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                            <p className="text-sm text-gray-900 font-medium">
                              {selectedOrder.clientDetails?.email || selectedOrder.client?.email}
                            </p>
                          </div>
                        </div>
                      ) : null}
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</label>
                          <p className="text-sm text-gray-900 font-medium">
                            {selectedOrder.clientDetails?.address || selectedOrder.client?.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Order Items
                    </h4>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item, index) => (
                        <div key={index} className="bg-white rounded p-3 border border-orange-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{item.itemType?.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                              {item.fabric && (
                                <p className="text-xs text-gray-500">Fabric: {item.fabric?.name}</p>
                              )}
                              {item.style && (
                                <p className="text-xs text-gray-500">Style: {item.style?.styleName}</p>
                              )}
                            </div>
                            <p className="text-sm font-medium">
                              {formatCurrency(item.totalPrice || 0)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Pricing Breakdown
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Subtotal:</span>
                        <span className="text-sm font-medium">{formatCurrency(selectedOrder.subtotal || 0)}</span>
                      </div>
                      
                      {selectedOrder.discountAmount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Discount ({selectedOrder.discountType === 'percentage' ? `${selectedOrder.discountValue}%` : 'Fixed'}):
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            -{formatCurrency(selectedOrder.discountAmount || 0)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Taxable Amount:</span>
                        <span className="text-sm font-medium">{formatCurrency(selectedOrder.taxableAmount || selectedOrder.subtotal || 0)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">GST ({selectedOrder.taxRate || 18}%):</span>
                        <span className="text-sm font-medium">{formatCurrency(selectedOrder.taxAmount || 0)}</span>
                      </div>
                      
                      <div className="border-t border-orange-300 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-800">Total Amount:</span>
                          <span className="text-sm font-bold text-orange-600">{formatCurrency(selectedOrder.totalAmount || 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Branch Information */}
                  {selectedOrder.branchId && (
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Branch Information
                      </h4>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Branch</label>
                        <p className="text-sm text-gray-900 font-medium mt-1">
                          {selectedOrder.branchId?.branchName} - {selectedOrder.branchId?.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleViewInvoice(selectedOrder)}
                      disabled={isGeneratingInvoice || !selectedOrder.bill}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      {isGeneratingInvoice ? "Loading..." : "View Invoice"}
                    </Button>
                    {/* <Button
                      onClick={() => handleDownloadInvoice(selectedOrder)}
                      disabled={isGeneratingInvoice || !selectedOrder.bill}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isGeneratingInvoice ? "Loading..." : "Download Invoice"}
                    </Button> */}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 text-gray-300 mb-2" />
                  <p>No order data available</p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Invoice PDF Viewer Modal */}
        {showInvoiceViewer && invoiceData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Invoice Preview</h3>
                <div className="flex gap-2">
                  {invoiceData && (
                    <PDFDownloadLink
                      document={<InvoiceDocument {...invoiceData} />}
                      fileName={`invoice-${invoiceData.invoiceNumber}.pdf`}
                      className="inline-block"
                      onError={handlePDFError}
                    >
                      {({ loading, error }) => (
                        <Button
                          disabled={loading}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => {
                            if (error) {
                              handlePDFError(error);
                            }
                          }}
                        >
                          {loading ? "Generating..." : error ? "Error - Retry" : "Download PDF"}
                        </Button>
                      )}
                    </PDFDownloadLink>
                  )}
                  <Button
                    onClick={() => {
                      setShowInvoiceViewer(false);
                      setInvoiceData(null);
                    }}
                    variant="outline"
                  >
                    Close
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                {invoiceData ? (
                  <PDFViewer 
                    className="w-full h-full"
                    onError={handlePDFError}
                  >
                    <InvoiceDocument {...invoiceData} />
                  </PDFViewer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading PDF...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PDF Download Link (hidden) */}
        {invoiceData && (
          <div className="hidden">
            <PDFDownloadLink
              document={<InvoiceDocument {...invoiceData} />}
              fileName={`invoice-${invoiceData.invoiceNumber}.pdf`}
            >
              {({ loading, error }) => (
                <Button
                  disabled={loading}
                  onClick={() => {
                    if (error) {
                      console.error("PDF generation error:", error);
                      toast.error("Failed to generate PDF");
                    } else {
                      toast.success("PDF download started");
                    }
                  }}
                >
                  {loading ? "Generating..." : error ? "Error - Retry" : "Download PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedOrders;
