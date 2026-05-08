import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Search, Filter, RefreshCw } from "lucide-react";
import { useGetAllOrdersQuery } from "@/features/api/orderApi";

const getPaymentBadgeClass = (status) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "partial":
      return "bg-blue-100 text-blue-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusBadgeClass = (status) => {
  if (status === "completed") return "bg-green-100 text-green-800";
  if (status === "cancelled") return "bg-red-100 text-red-700";
  if (status === "in_progress") return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-700";
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount || 0);

const InvoiceOrdersView = ({ title, subtitle, fixedOrderType = null }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [orderTypeFilter, setOrderTypeFilter] = useState(fixedOrderType || "all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching, refetch } = useGetAllOrdersQuery({
    page,
    limit,
    status: statusFilter === "all" ? undefined : statusFilter,
    orderType:
      fixedOrderType || orderTypeFilter === "all" ? (fixedOrderType || undefined) : orderTypeFilter,
    priority: priorityFilter === "all" ? undefined : priorityFilter,
    search: searchQuery || undefined,
  });

  const billedOrders = useMemo(
    () => (data?.orders || []).filter((order) => order.bill),
    [data]
  );

  const totalRevenue = billedOrders.reduce(
    (sum, order) => sum + (order.bill?.totalAmount || order.totalAmount || 0),
    0
  );
  const pendingCount = billedOrders.filter(
    (order) => (order.bill?.paymentStatus || order.paymentStatus) === "pending"
  ).length;
  const paidCount = billedOrders.filter(
    (order) => (order.bill?.paymentStatus || order.paymentStatus) === "paid"
  ).length;
  const totalPages = data?.totalPage || 1;

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 text-sm">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card><CardContent className="p-5"><p className="text-sm text-gray-500">Total Invoices</p><p className="text-2xl font-bold">{billedOrders.length}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-gray-500">Total Revenue</p><p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-gray-500">Paid Invoices</p><p className="text-2xl font-bold">{paidCount}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-gray-500">Pending Payment</p><p className="text-2xl font-bold">{pendingCount}</p></CardContent></Card>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10 h-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {!fixedOrderType ? (
              <Select value={orderTypeFilter} onValueChange={setOrderTypeFilter}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Order Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Order Type</SelectItem>
                  <SelectItem value="fabric">Fabric</SelectItem>
                  <SelectItem value="stitching">Stitching</SelectItem>
                  <SelectItem value="fabric_stitching">Fabric Stitching</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="h-9 rounded-md border px-3 flex items-center text-sm bg-gray-50 capitalize">
                {fixedOrderType.replace("_", " ")}
              </div>
            )}

            <div className="flex gap-2">
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="h-9" onClick={() => refetch()} disabled={isFetching}>
                <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              </Button>
              <Button
                variant="outline"
                className="h-9"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                  if (!fixedOrderType) setOrderTypeFilter("all");
                  setPage(1);
                }}
              >
                <Filter className="w-4 h-4 mr-1" /> Clear
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="py-12 text-center text-gray-500">Loading invoices...</div>
          ) : billedOrders.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No invoices found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billedOrders.map((order) => {
                  const paymentStatus = order.bill?.paymentStatus || order.paymentStatus || "pending";
                  return (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.clientDetails?.name || order.client?.name}</p>
                          <p className="text-xs text-gray-500">{order.clientDetails?.mobile || order.client?.mobile}</p>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{order.orderType?.replace("_", " ")}</Badge></TableCell>
                      <TableCell>{order.items?.length || 0}</TableCell>
                      <TableCell>{formatCurrency(order.bill?.totalAmount || order.totalAmount)}</TableCell>
                      <TableCell><Badge className="capitalize bg-blue-100 text-blue-800">{order.priority}</Badge></TableCell>
                      <TableCell><Badge className={`capitalize ${getStatusBadgeClass(order.status)}`}>{order.status}</Badge></TableCell>
                      <TableCell><Badge className={`capitalize ${getPaymentBadgeClass(paymentStatus)}`}>{paymentStatus}</Badge></TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">View Bill</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">Showing {billedOrders.length} of {data?.total || 0} orders</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span className="text-sm px-2 py-1">Page {page} of {totalPages}</span>
              <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceOrdersView;
