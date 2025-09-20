import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Save,
  Loader2,
  ShoppingCart,
  User,
  Package,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useGetOrderByIdMutation, useUpdateOrderMutation } from "@/features/api/orderApi";
import { useGetAllClientsQuery } from "@/features/api/clientApi";
import { useGetAllItemMastersQuery } from "@/features/api/itemApi";
import { useGetAllFabricsQuery } from "@/features/api/fabricApi";
import { useGetAllBranchesQuery } from "@/features/api/branchApi";

const EditOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    clientId: "",
    orderType: "fabric_stitching",
    priority: "medium",
    expectedDeliveryDate: "",
    notes: "",
    specialInstructions: "",
    discountType: "percentage",
    discountValue: 0,
    taxRate: 18,
    advancePayment: 0,
    paymentMethod: "",
    paymentNotes: "",
  });

  const [items, setItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState({
    subtotal: 0,
    discountAmount: 0,
    taxableAmount: 0,
    taxAmount: 0,
    totalAmount: 0,
    advanceAmount: 0,
    balanceAmount: 0,
    itemBreakdowns: [],
  });

  // API hooks
  const [getOrderById, { isLoading: getOrderLoading }] = useGetOrderByIdMutation();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
  
  const { data: clientsData } = useGetAllClientsQuery({ page: 1, limit: 1000 });
  const { data: itemData } = useGetAllItemMastersQuery({ page: 1, limit: 1000 });
  const { data: fabricsData } = useGetAllFabricsQuery({ page: 1, limit: 1000 });
  const { data: branchesData } = useGetAllBranchesQuery({ page: 1, limit: 1000 });

  // Load order data
  useEffect(() => {
    const loadOrder = async () => {
      try {
        const { data } = await getOrderById(orderId);
        if (data?.success && data?.order) {
          const order = data.order;
          setFormData({
            clientId: order.client?._id || order.clientDetails?._id || "",
            orderType: order.orderType || "fabric_stitching",
            priority: order.priority || "medium",
            expectedDeliveryDate: order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toISOString().split('T')[0] : "",
            notes: order.notes || "",
            specialInstructions: order.specialInstructions || "",
            discountType: order.discountType || "percentage",
            discountValue: order.discountValue || 0,
            taxRate: order.taxRate || 18,
            advancePayment: order.advancePayment || 0,
            paymentMethod: order.paymentMethod || "",
            paymentNotes: order.paymentNotes || "",
          });
          setItems(order.items || []);
        }
      } catch (error) {
        console.error("Error loading order:", error);
        toast.error("Error loading order details");
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId, getOrderById]);

  // Calculate order total
  const calculateItemBreakdown = (item, index) => {
    if (!item.itemType || !item.quantity) return null;
    const selectedItem = itemData?.itemMasters?.find(i => i._id === item.itemType);
    if (!selectedItem) return null;

    let itemPrice = 0;
    let fabricCost = 0;
    let stitchingCost = 0;
    const breakdown = [];

    // Calculate fabric cost
    if (item.fabric && item.fabricMeters) {
      const selectedFabric = fabricsData?.fabrics?.find(f => f._id === item.fabric);
      if (selectedFabric) {
        fabricCost = selectedFabric.pricePerMeter * item.fabricMeters;
        breakdown.push({
          name: "Fabric Cost",
          rate: selectedFabric.pricePerMeter,
          quantity: item.fabricMeters,
          unit: "meters",
          total: fabricCost,
        });
      }
    }

    // Calculate stitching cost
    stitchingCost = selectedItem.stitchingCharge || 0;
    breakdown.push({
      name: "Stitching Charge",
      rate: stitchingCost,
      quantity: 1,
      unit: "item",
      total: stitchingCost,
    });

    itemPrice = fabricCost + stitchingCost;
    const totalItemPrice = itemPrice * parseInt(item.quantity);

    return {
      itemName: selectedItem.name,
      quantity: parseInt(item.quantity),
      unitPrice: itemPrice,
      totalPrice: totalItemPrice,
      breakdown,
      fabric: item.fabric ? fabricsData?.fabrics?.find(f => f._id === item.fabric) : null,
    };
  };

  const calculateOrderTotal = () => {
    let subtotal = 0;
    const itemBreakdowns = [];

    items.forEach((item, index) => {
      const breakdown = calculateItemBreakdown(item, index);
      if (breakdown) {
        subtotal += breakdown.totalPrice;
        itemBreakdowns.push(breakdown);
      }
    });

    const discountAmount = formData.discountType === "percentage" 
      ? (subtotal * formData.discountValue) / 100 
      : formData.discountValue;

    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * formData.taxRate) / 100;
    const totalAmount = taxableAmount + taxAmount;
    const advanceAmount = formData.advancePayment || 0;
    const balanceAmount = totalAmount - advanceAmount;

    setOrderTotal({
      subtotal,
      discountAmount,
      taxableAmount,
      taxAmount,
      totalAmount,
      advanceAmount,
      balanceAmount,
      itemBreakdowns,
    });
  };

  useEffect(() => {
    calculateOrderTotal();
  }, [items, formData.discountType, formData.discountValue, formData.taxRate, formData.advancePayment, itemData, fabricsData]);

  // Handle form changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, {
      itemType: "",
      quantity: 1,
      fabric: "",
      fabricMeters: 0,
      style: {
        styleId: "",
        styleName: "",
        description: ""
      },
      specialInstructions: ""
    }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.clientId) {
      toast.error("Please select a client");
      return;
    }

    if (items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    try {
      const orderData = {
        clientId: formData.clientId,
        orderType: formData.orderType,
        priority: formData.priority,
        expectedDeliveryDate: formData.expectedDeliveryDate,
        notes: formData.notes,
        specialInstructions: formData.specialInstructions,
        items: items.map(item => ({
          itemType: item.itemType,
          quantity: parseInt(item.quantity),
          fabric: item.fabric || null,
          fabricMeters: item.fabricMeters || 0,
          style: {
            styleId: item.style?.styleId || "",
            styleName: item.style?.styleName || "",
            description: item.style?.description || ""
          },
          specialInstructions: item.specialInstructions || ""
        })),
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        taxRate: parseFloat(formData.taxRate),
        advancePayment: parseFloat(formData.advancePayment) || 0,
        paymentMethod: formData.paymentMethod,
        paymentNotes: formData.paymentNotes,
      };

      const { data } = await updateOrder({ orderId, orderData });
      
      if (data?.success) {
        toast.success("Order updated successfully");
        navigate("/employee/pending-client-orders");
      } else {
        toast.error(data?.message || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Error updating order");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (getOrderLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
          <span>Loading order details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => navigate("/employee/pending-client-orders")}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Order</h1>
              <p className="text-gray-600 text-sm">Update order details and items</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Order Information
              </CardTitle>
              <CardDescription>Basic order details and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client *</Label>
                  <Select
                    value={formData.clientId}
                    onValueChange={(value) => handleInputChange("clientId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientsData?.clients?.filter(client => client._id && client.name).map((client) => (
                        <SelectItem key={client._id} value={client._id}>
                          {client.name} - {client.mobile}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderType">Order Type</Label>
                  <Select
                    value={formData.orderType}
                    onValueChange={(value) => handleInputChange("orderType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fabric">Fabric Only</SelectItem>
                      <SelectItem value="fabric_stitching">Fabric + Stitching</SelectItem>
                      <SelectItem value="stitching">Stitching Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleInputChange("priority", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
                  <Input
                    id="expectedDeliveryDate"
                    type="date"
                    value={formData.expectedDeliveryDate}
                    onChange={(e) => handleInputChange("expectedDeliveryDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountType">Discount Type</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value) => handleInputChange("discountType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountValue">Discount Value</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => handleInputChange("discountValue", e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={formData.taxRate}
                    onChange={(e) => handleInputChange("taxRate", e.target.value)}
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advancePayment">Advance Payment (₹)</Label>
                  <Input
                    id="advancePayment"
                    type="number"
                    value={formData.advancePayment}
                    onChange={(e) => handleInputChange("advancePayment", e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange("paymentMethod", value)}
                  >
                    <SelectTrigger>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="notes">Order Notes</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Add order notes..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialInstructions">Special Instructions</Label>
                  <Input
                    id="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                    placeholder="Add special instructions..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentNotes">Payment Notes</Label>
                <Input
                  id="paymentNotes"
                  value={formData.paymentNotes}
                  onChange={(e) => handleInputChange("paymentNotes", e.target.value)}
                  placeholder="Add payment notes..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Items
                  </CardTitle>
                  <CardDescription>Add items to the order</CardDescription>
                </div>
                <Button type="button" onClick={addItem} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">Item #{index + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => removeItem(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Item Type *</Label>
                      <Select
                        value={item.itemType}
                        onValueChange={(value) => handleItemChange(index, "itemType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemData?.itemMasters?.filter(item => item._id && item.name).map((itemType) => (
                            <SelectItem key={itemType._id} value={itemType._id}>
                              {itemType.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Quantity *</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        min="1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Fabric</Label>
                      <Select
                        value={item.fabric}
                        onValueChange={(value) => handleItemChange(index, "fabric", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select fabric" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No Fabric</SelectItem>
                          {fabricsData?.fabrics?.filter(fabric => fabric._id && fabric.name).map((fabric) => (
                            <SelectItem key={fabric._id} value={fabric._id}>
                              {fabric.name} - {formatCurrency(fabric.pricePerMeter)}/meter
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Fabric Meters</Label>
                      <Input
                        type="number"
                        value={item.fabricMeters}
                        onChange={(e) => handleItemChange(index, "fabricMeters", e.target.value)}
                        min="0"
                        step="0.1"
                        disabled={!item.fabric}
                      />
                    </div>
                  </div>

                  {item.itemType && itemData?.itemMasters?.find(i => i._id === item.itemType)?.styles && (
                    <div className="space-y-2">
                      <Label>Style</Label>
                      <Select
                        value={item.style?.styleId}
                        onValueChange={(value) => {
                          const selectedStyle = itemData.itemMasters.find(i => i._id === item.itemType)?.styles?.find(s => s.styleId === value);
                          handleItemChange(index, "style", {
                            styleId: value,
                            styleName: selectedStyle?.styleName || "",
                            description: selectedStyle?.description || ""
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No Style</SelectItem>
                          {itemData.itemMasters.find(i => i._id === item.itemType)?.styles?.filter(style => style.styleId && style.styleName).map((style) => (
                            <SelectItem key={style.styleId} value={style.styleId}>
                              {style.styleName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Special Instructions</Label>
                    <Input
                      value={item.specialInstructions}
                      onChange={(e) => handleItemChange(index, "specialInstructions", e.target.value)}
                      placeholder="Add special instructions for this item..."
                    />
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>No items added yet</p>
                  <p className="text-sm">Click "Add Item" to start adding items to this order</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Order Summary
              </CardTitle>
              <CardDescription>Review the order total and pricing breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                {orderTotal.totalAmount === 0 ? (
                  <div className="text-center py-6">
                    <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Add items to see order total</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Item Breakdown */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Item Details</h4>
                      <div className="space-y-3">
                        {orderTotal.itemBreakdowns.map((item, index) => (
                          <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h5 className="font-medium text-gray-800">{item.itemName}</h5>
                                <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                              </div>
                              <span className="font-semibold text-gray-900">
                                {formatCurrency(item.totalPrice)}
                              </span>
                            </div>
                            <div className="space-y-1 text-xs">
                              {item.breakdown.map((cost, costIndex) => (
                                <div key={costIndex} className="flex justify-between items-center text-gray-600">
                                  <span>
                                    {cost.name}: {formatCurrency(cost.rate)} × {cost.quantity} {cost.unit}
                                  </span>
                                  <span className="font-medium">
                                    {formatCurrency(cost.total)}
                                  </span>
                                </div>
                              ))}
                              <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                                <span className="font-medium text-gray-700">
                                  Unit Price: {formatCurrency(item.unitPrice)} × {item.quantity}
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {formatCurrency(item.totalPrice)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Subtotal:</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(orderTotal.subtotal)}
                          </span>
                        </div>
                        
                        {orderTotal.discountAmount > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">
                              Discount ({formData.discountType === 'percentage' ? `${formData.discountValue}%` : 'Fixed'}):
                            </span>
                            <span className="text-sm font-semibold text-green-600">
                              -{formatCurrency(orderTotal.discountAmount)}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Taxable Amount:</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(orderTotal.taxableAmount)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">GST ({formData.taxRate}%):</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(orderTotal.taxAmount)}
                          </span>
                        </div>
                        
                        <div className="border-t border-gray-300 pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-base font-bold text-gray-800">Total Amount:</span>
                            <span className="text-lg font-bold text-orange-600">
                              {formatCurrency(orderTotal.totalAmount)}
                            </span>
                          </div>
                        </div>

                        {orderTotal.advanceAmount > 0 && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600">Advance Payment:</span>
                              <span className="text-sm font-semibold text-blue-600">
                                -{formatCurrency(orderTotal.advanceAmount)}
                              </span>
                            </div>
                            
                            <div className="border-t border-gray-300 pt-2">
                              <div className="flex justify-between items-center">
                                <span className="text-base font-bold text-gray-800">Balance Amount:</span>
                                <span className="text-lg font-bold text-green-600">
                                  {formatCurrency(orderTotal.balanceAmount)}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => navigate("/employee/pending-client-orders")}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating || orderTotal.totalAmount === 0}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating Order...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Order
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrder;
