import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Package, User, MapPin, ShoppingCart, ArrowLeft, Receipt } from "lucide-react";
import toast from "react-hot-toast";
import { useGetOrderByIdMutation } from "@/features/api/orderApi";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount || 0);
};

const formatDate = (date) => {
  return date ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-";
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

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [getOrderById, { isLoading }] = useGetOrderByIdMutation();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getOrderById(id);
        if (data?.success) {
          setOrder(data.order);
        } else {
          toast.error(data?.message || "Failed to load order");
        }
      } catch (e) {
        console.error(e);
        toast.error("Error loading order");
      }
    };
    if (id) fetch();
  }, [id, getOrderById]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <div className="container mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-600 rounded-full shadow-lg mb-3">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Detail</h1>
              <p className="text-gray-600 text-sm">View order information</p>
            </div>
            <Button
              type="button"
              onClick={() => navigate("/employee/pending-client-orders")}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Client Orders
            </Button>
          </div>
        </div>

        {!order ? (
          <div className="flex items-center justify-center py-12 text-gray-500">No order found</div>
        ) : (
          <div className="space-y-6">
            {/* Order Information */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Order Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order Number</label>
                  <p className="text-sm text-gray-900 font-medium mt-1">{order.orderNumber}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order Type</label>
                  <p className="text-sm text-gray-900 font-medium mt-1 capitalize">{order.orderType?.replace("_", " ")}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Priority</label>
                  <div className="mt-1"><Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge></div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
                  <p className="text-sm text-gray-900 font-medium mt-1">{order.status}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Expected Delivery</label>
                  <p className="text-sm text-gray-900 font-medium mt-1">{formatDate(order.expectedDeliveryDate)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created</label>
                  <p className="text-sm text-gray-900 font-medium mt-1">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Amount</label>
                  <p className="text-sm text-gray-900 font-medium mt-1">{formatCurrency(order.totalAmount)}</p>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" /> Client Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
                  <p className="text-sm text-gray-900 font-medium mt-1">{order.clientDetails?.name || order.client?.name}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mobile</label>
                  <p className="text-sm text-gray-900 font-medium mt-1">{order.clientDetails?.mobile || order.client?.mobile}</p>
                </div>
                {order.clientDetails?.email || order.client?.email ? (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                    <p className="text-sm text-gray-900 font-medium mt-1">{order.clientDetails?.email || order.client?.email}</p>
                  </div>
                ) : null}
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</label>
                  <p className="text-sm text-gray-900 font-medium mt-1">{order.clientDetails?.address || order.client?.address}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" /> Order Items
              </h4>
              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div key={index} className="bg-white rounded p-3 border border-orange-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{item.itemType?.name || (order.orderType === "fabric" ? "Fabric" : "Item")}</p>
                        {order.orderType !== "fabric" && (
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        )}
                        {item.fabric && (
                          <p className="text-xs text-gray-500">Fabric: {item.fabric?.name} {item.fabricMeters ? `(${item.fabricMeters}m)` : ""}</p>
                        )}
                        {item.style && (
                          <p className="text-xs text-gray-500">Style: {item.style?.styleName}</p>
                        )}
                      </div>
                      <p className="text-sm font-medium">{formatCurrency(item.totalPrice || 0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Pricing Breakdown
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="text-sm font-medium">{formatCurrency(order.subtotal || 0)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Discount ({order.discountType === 'percentage' ? `${order.discountValue}%` : 'Fixed'}):</span>
                    <span className="text-sm font-medium text-green-600">-{formatCurrency(order.discountAmount || 0)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Taxable Amount:</span>
                  <span className="text-sm font-medium">{formatCurrency(order.taxableAmount || order.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">GST ({order.taxRate || 5}%):</span>
                  <span className="text-sm font-medium">{formatCurrency(order.taxAmount || 0)}</span>
                </div>
                <div className="border-t border-orange-300 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-800">Total Amount:</span>
                    <span className="text-sm font-bold text-orange-600">{formatCurrency(order.totalAmount || 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Branch */}
            {order.branchId && (
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Branch Information
                </h4>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Branch</label>
                  <p className="text-sm text-gray-900 font-medium mt-1">{order.branchId?.branchName} - {order.branchId?.address}</p>
                </div>
              </div>
            )}

            {/* Bill */}
            {order.bill && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Receipt className="w-4 h-4" /> Bill Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bill Number</label>
                    <p className="text-sm text-gray-900 font-medium mt-1 font-mono">{(order.bill.billNumber || '').replace('-BILL-', '-')}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bill Date</label>
                    <p className="text-sm text-gray-900 font-medium mt-1">{formatDate(order.bill.billDate)}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Due Date</label>
                    <p className="text-sm text-gray-900 font-medium mt-1">{formatDate(order.bill.dueDate)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;


