import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Loader2, 
  User, 
  Package, 
  Receipt, 
  ArrowLeft, 
  Calculator,
  FileText,
  Download
} from "lucide-react";
import toast from "react-hot-toast";
import { useCreateInvoiceMutation } from "@/features/api/invoiceApi";
import { useGetPendingOrderByIdMutation } from "@/features/api/pendingOrderApi";

const GenerateBill = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  const [pendingOrder, setPendingOrder] = useState(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  
  // Invoice form state
  const [gstPercentage, setGstPercentage] = useState(18);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");

  const [createInvoice, { isLoading: isCreatingInvoice }] = useCreateInvoiceMutation();
  const [getPendingOrderById] = useGetPendingOrderByIdMutation();

  // Load pending order data
  useEffect(() => {
    if (!orderId) {
      toast.error("No order ID provided");
      navigate("/admin/pending-orders");
      return;
    }

    loadPendingOrder();
  }, [orderId]);

  const loadPendingOrder = async () => {
    setIsLoadingOrder(true);
    try {
      const result = await getPendingOrderById( orderId ).unwrap();
      if (result?.order) {
        setPendingOrder(result.order);
        
        // Set default due date to 7 days from now
        const defaultDueDate = new Date();
        defaultDueDate.setDate(defaultDueDate.getDate() + 7);
        setDueDate(defaultDueDate.toISOString().split('T')[0]);
      }
    } catch (err) {
      toast.error("Failed to load order details");
      navigate("/admin/pending-orders");
    } finally {
      setIsLoadingOrder(false);
    }
  };

  const calculateItemTotals = () => {
    if (!pendingOrder?.items) return { subtotal: 0, items: [] };

    const itemsWithTotals = pendingOrder.items.map(item => {
      const fabricRate = item.fabric?.pricePerMeter || 0;
      const stitchingRate = item.itemType?.stitchingCharge || 0;
      const fabricAmount = (item.fabricMeters || 0) * fabricRate;
      const stitchingAmount = item.quantity * stitchingRate;
      const totalAmount = fabricAmount + stitchingAmount;

      return {
        ...item,
        fabricRate,
        fabricAmount,
        stitchingRate,
        stitchingAmount,
        totalAmount,
      };
    });

    const subtotal = itemsWithTotals.reduce((sum, item) => sum + item.totalAmount, 0);
    const gstAmount = (subtotal * gstPercentage) / 100;
    const discountAmount = (subtotal * discountPercentage) / 100;
    const totalAmount = subtotal + gstAmount - discountAmount;

    return {
      subtotal,
      gstAmount,
      discountAmount,
      totalAmount,
      items: itemsWithTotals,
    };
  };

  const handleSubmit = async () => {
    if (!dueDate) {
      toast.error("Please select a due date");
      return;
    }

    const calculations = calculateItemTotals();
    
    const invoiceData = {
      pendingOrderId: orderId,
      gstPercentage,
      discountPercentage,
      dueDate,
      remarks,
      termsAndConditions,
    };

    try {
      await createInvoice(invoiceData).unwrap();
      toast.success("Invoice created successfully!");
      navigate("/admin/pending-orders");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create invoice");
    }
  };

  const calculations = calculateItemTotals();

  if (isLoadingOrder) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 mx-auto mb-4" />
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!pendingOrder) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p>Order not found</p>
          <Button onClick={() => navigate("/admin/pending-orders")} className="mt-4">
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/pending-orders")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Generate Bill
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create invoice for order {pendingOrder.tokenNumber}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Token Number</Label>
                    <p className="text-lg font-semibold text-orange-600">
                      {pendingOrder.tokenNumber}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Order Type</Label>
                    <p className="text-lg capitalize">
                      {pendingOrder.orderType.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Customer</Label>
                  <p className="text-lg">{pendingOrder.customer?.name}</p>
                  <p className="text-sm text-gray-600">
                    {pendingOrder.customer?.mobile} • {pendingOrder.customer?.email}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Items Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {calculations.items.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                        <div>
                          <Label className="text-sm font-medium">Item</Label>
                          <p className="font-medium">{item.itemType?.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Fabric</Label>
                          <p>{item.fabric?.name || "N/A"}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Style</Label>
                          <p>{item.style?.name || "N/A"}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Quantity</Label>
                          <p>{item.quantity}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Fabric:</span>
                          <p className="font-medium">
                            {item.fabricMeters || 0}m × ₹{item.fabricRate} = ₹{item.fabricAmount}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Stitching:</span>
                          <p className="font-medium">
                            {item.quantity} × ₹{item.stitchingRate} = ₹{item.stitchingAmount}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-gray-600">Total:</span>
                          <p className="font-bold text-lg">₹{item.totalAmount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Billing Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Billing Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Due Date *</Label>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">GST Percentage (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={gstPercentage}
                      onChange={(e) => setGstPercentage(parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Discount Percentage (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={discountPercentage}
                      onChange={(e) => setDiscountPercentage(parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Remarks</Label>
                  <Textarea
                    placeholder="Additional notes for the customer..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Terms & Conditions</Label>
                  <Textarea
                    placeholder="Payment terms and conditions..."
                    value={termsAndConditions}
                    onChange={(e) => setTermsAndConditions(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Invoice Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Invoice Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{calculations.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">GST ({gstPercentage}%):</span>
                    <span className="font-medium">₹{calculations.gstAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Discount ({discountPercentage}%):</span>
                    <span className="font-medium text-red-600">-₹{calculations.discountAmount}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-green-600">₹{calculations.totalAmount}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={isCreatingInvoice || !dueDate}
                    className="w-full"
                    size="lg"
                  >
                    {isCreatingInvoice ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        Creating Invoice...
                      </>
                    ) : (
                      <>
                        <Receipt className="w-4 h-4 mr-2" />
                        Generate Invoice
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/pending-orders")}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Orders
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateBill; 