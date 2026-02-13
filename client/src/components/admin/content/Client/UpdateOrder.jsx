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
// Match CreateOrder section shells
const FormSection = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
      <Icon className="w-4 h-4 text-gray-600" />
      <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
    </div>
    {children}
  </div>
);
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

const UpdateOrder = () => {
  const { id: orderId } = useParams();
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

  // State to track if we've attempted to load data
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  // State for shipping details
  const [shippingDetails, setShippingDetails] = useState({
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingPincode: "",
    shippingPhone: "",
    shippingMethod: "home_delivery",
    shippingCost: 0,
    deliveryNotes: "",
    deliveryPerson: "",
    deliveryPersonContact: "",
    deliveryStatus: "pending",
    extraField1Label: "",
    extraField1Value: "",
    extraField2Label: "",
    extraField2Value: "",
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

  // --- State additions ---
  const [clientOrderNumber, setClientOrderNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [showMeasurementIdxs, setShowMeasurementIdxs] = useState([]);
  const toggleShowMeasurements = (idx) => {
    setShowMeasurementIdxs(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

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
        if (!orderId) {
          console.error("No orderId provided");
          toast.error("No order ID provided");
          return;
        }
        const result = await getOrderById(orderId);
        console.log("Raw API result:", result);
        const { data } = result;
        console.log("Data from API:", data);
        if (data?.success && data?.order) {
          const order = data.order;
          console.log("Order data structure:", JSON.stringify(order, null, 2));
          console.log("Order items:", order.items);
          console.log("Order client:", order.client);
          console.log("Order clientDetails:", order.clientDetails);
          const formDataToSet = {
            clientId: order.client?._id || order.clientDetails?._id || order.client || "",
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
          };
          console.log("Form data to set:", formDataToSet);
          setFormData(formDataToSet);
          
          // Map items to match frontend structure
          console.log("Raw items from backend:", order.items);
          const mappedItems = (order.items || []).map((item, index) => {
            console.log(`Item ${index}:`, item);
            console.log(`Item ${index} itemType:`, item.itemType);
            console.log(`Item ${index} fabric:`, item.fabric);
            console.log(`Item ${index} style:`, item.style);
            
            // Handle itemType - could be populated object or just ID
            let itemTypeId = "";
            if (typeof item.itemType === 'object' && item.itemType !== null) {
              itemTypeId = item.itemType._id || item.itemType;
            } else {
              itemTypeId = item.itemType || "";
            }
            
            // Handle fabric - could be populated object or just ID
            let fabricId = "";
            if (typeof item.fabric === 'object' && item.fabric !== null) {
              fabricId = item.fabric._id || item.fabric;
            } else {
              fabricId = item.fabric || "";
            }
            
            return {
              itemType: itemTypeId,
              quantity: item.quantity || 1,
              fabric: fabricId,
              fabricMeters: item.fabricMeters || 0,
              style: {
                styleId: item.style?.styleId || "",
                styleName: item.style?.styleName || "",
                description: item.style?.description || ""
              },
              specialInstructions: item.specialInstructions || "",
              // Add measurement fields if they exist in the backend item
              measurement: item.measurement || {}
            };
          });
          console.log("Mapped items:", mappedItems);
          setItems(mappedItems);
          console.log("Items state should be set to:", mappedItems);
          
          // Load shipping details
          console.log("Shipping details from backend:", order.shippingDetails);
          if (order.shippingDetails) {
            setShippingDetails({
              shippingAddress: order.shippingDetails.shippingAddress || "",
              shippingCity: order.shippingDetails.shippingCity || "",
              shippingState: order.shippingDetails.shippingState || "",
              shippingPincode: order.shippingDetails.shippingPincode || "",
              shippingPhone: order.shippingDetails.shippingPhone || "",
              shippingMethod: order.shippingDetails.shippingMethod || "home_delivery",
              shippingCost: order.shippingDetails.shippingCost || 0,
              trackingNumber: order.shippingDetails.trackingNumber || "",
              deliveryNotes: order.shippingDetails.deliveryNotes || "",
              deliveryPerson: order.shippingDetails.deliveryPerson || "",
              deliveryStatus: order.shippingDetails.deliveryStatus || "pending",
              extraField1Label: order.shippingDetails.extraField1Label || "",
              extraField1Value: order.shippingDetails.extraField1Value || "",
              extraField2Label: order.shippingDetails.extraField2Label || "",
              extraField2Value: order.shippingDetails.extraField2Value || "",
            });
          }
          // Load new fields if they exist
          setClientOrderNumber(order.clientOrderNumber || "");
          setPaymentStatus(order.paymentStatus || "pending");

        } else {
          toast.error(data?.message || "Order not found or failed to load");
        }
      } catch (error) {
        console.error("Error loading order:", error);
        console.error("Error details:", error.data || error.message);
        toast.error(error.data?.message || error.message || "Error loading order details");
      } finally {
        setHasAttemptedLoad(true);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId, getOrderById]);

  // Calculate order total
  const calculateItemBreakdown = (item, index) => {
    console.log(`calculateItemBreakdown called for item ${index}:`, item);
    console.log(`itemData:`, itemData);
    console.log(`fabricsData:`, fabricsData);
    console.log(`item.itemType:`, item.itemType, typeof item.itemType);
    console.log(`item.quantity:`, item.quantity, typeof item.quantity);
    
    if (!item.itemType || !item.quantity) {
      console.log(`Item ${index} missing itemType or quantity`);
      return null;
    }
    
    console.log(`Looking for item with ID: ${item.itemType}`);
    console.log(`Available itemMasters:`, itemData?.items?.map(i => ({ id: i._id, name: i.name })));
    
    const selectedItem = itemData?.items?.find(i => i._id === item.itemType);
    console.log(`Selected item for ${index}:`, selectedItem);
    if (!selectedItem) {
      console.log(`No item found for ID: ${item.itemType}`);
      console.log(`Available IDs:`, itemData?.items?.map(i => i._id));
      return null;
    }

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

    // Calculate stitching cost only for applicable order types (match Create Order)
    if (formData.orderType === "stitching" || formData.orderType === "fabric_stitching") {
      stitchingCost = selectedItem.stitchingCharge || 0;
      breakdown.push({
        name: "Stitching Charge",
        rate: stitchingCost,
        quantity: 1,
        unit: "item",
        total: stitchingCost,
      });
    }

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
    console.log("calculateOrderTotal called with items:", items);
    console.log("calculateOrderTotal called with itemData:", itemData);
    console.log("calculateOrderTotal called with fabricsData:", fabricsData);
    console.log("items.length:", items.length);
    console.log("itemData?.items?.length:", itemData?.items?.length);
    console.log("fabricsData?.fabrics?.length:", fabricsData?.fabrics?.length);
    
    let subtotal = 0;
    const itemBreakdowns = [];

    items.forEach((item, index) => {
      console.log(`Processing item ${index}:`, item);
      const breakdown = calculateItemBreakdown(item, index);
      console.log(`Breakdown for item ${index}:`, breakdown);
      if (breakdown) {
        subtotal += breakdown.totalPrice;
        itemBreakdowns.push(breakdown);
      }
    });

    const discountAmount =
      formData.discountType === "percentage"
        ? (subtotal * formData.discountValue) / 100
        : formData.discountValue;

    const shippingCost = parseFloat(shippingDetails.shippingCost) || 0;

    const taxableAmount = subtotal - discountAmount + shippingCost;
    const taxAmount = (taxableAmount * formData.taxRate) / 100;
    const totalAmount = taxableAmount + taxAmount;
    const advanceAmount = formData.advancePayment || 0;
    const balanceAmount = totalAmount - advanceAmount;

    const orderTotalData = {
      subtotal,
      discountAmount,
      taxableAmount,
      taxAmount,
      shippingCost,
      totalAmount,
      advanceAmount,
      balanceAmount,
      itemBreakdowns,
    };
    console.log("Setting order total to:", orderTotalData);
    setOrderTotal(orderTotalData);
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

  // Handle shipping details changes
  const SHIPPING_METHOD_CONFIG = {
    pickup: {
      extra1Label: "Transport Name",
      extra2Label: "Transport GST Number",
    },
    home_delivery: {
      extra1Label: "Delivery Partner",
      extra2Label: "Vehicle Number",
    },
    courier: {
      extra1Label: "Courier Name",
      extra2Label: "Courier GST Number",
    },
    express: {
      extra1Label: "Express Service Name",
      extra2Label: "Tracking / AWB Number",
    },
    local_transport: {
      extra1Label: "Transporter Name",
      extra2Label: "Transport GST Number",
    },
    customer_courier: {
      extra1Label: "Customer Courier Name",
      extra2Label: "AWB / Docket Number",
    },
    aggregator: {
      extra1Label: "Aggregator Name",
      extra2Label: "Reference ID",
    },
    other: {
      extra1Label: "Shipping Partner",
      extra2Label: "Reference Details",
    },
  };

  const handleShippingChange = (field, value) => {
    setShippingDetails(prev => {
      if (field === "shippingMethod") {
        const config = SHIPPING_METHOD_CONFIG[value] || {};
        return {
          ...prev,
          shippingMethod: value,
          extraField1Label: config.extra1Label || prev.extraField1Label,
          extraField2Label: config.extra2Label || prev.extraField2Label,
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
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
      specialInstructions: "",
      // Add measurement fields if they exist in the backend item
      measurement: {}
    }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleMeasurementChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index].measurement[field] = value;
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

    // GST validation helper
    const isValidGSTIN = (value) => {
      if (!value) return true;
      const gstin = String(value).trim().toUpperCase();
      const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      return regex.test(gstin);
    };

    const gstLikeLabels = ["gst", "g.s.t"];
    if (
      gstLikeLabels.some((k) =>
        (shippingDetails.extraField1Label || "").toLowerCase().includes(k)
      ) &&
      shippingDetails.extraField1Value &&
      !isValidGSTIN(shippingDetails.extraField1Value)
    ) {
      toast.error("Please enter a valid GST number in shipping details");
      return;
    }
    if (
      gstLikeLabels.some((k) =>
        (shippingDetails.extraField2Label || "").toLowerCase().includes(k)
      ) &&
      shippingDetails.extraField2Value &&
      !isValidGSTIN(shippingDetails.extraField2Value)
    ) {
      toast.error("Please enter a valid GST number in shipping details");
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
          specialInstructions: item.specialInstructions || "",
          // Add measurement fields if they exist in the backend item
          measurement: item.measurement || {}
        })),
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        taxRate: parseFloat(formData.taxRate),
        advancePayment: parseFloat(formData.advancePayment) || 0,
        paymentMethod: formData.paymentMethod,
        paymentNotes: formData.paymentNotes,
        shippingDetails: {
          shippingAddress: shippingDetails.shippingAddress,
          shippingCity: shippingDetails.shippingCity,
          shippingState: shippingDetails.shippingState,
          shippingPincode: shippingDetails.shippingPincode,
          shippingPhone: shippingDetails.shippingPhone,
          shippingMethod: shippingDetails.shippingMethod,
          shippingCost: parseFloat(shippingDetails.shippingCost) || 0,
          trackingNumber: shippingDetails.trackingNumber,
          deliveryNotes: shippingDetails.deliveryNotes,
          deliveryPerson: shippingDetails.deliveryPerson,
          deliveryStatus: shippingDetails.deliveryStatus,
          extraField1Label: shippingDetails.extraField1Label || undefined,
          extraField1Value: shippingDetails.extraField1Value || undefined,
          extraField2Label: shippingDetails.extraField2Label || undefined,
          extraField2Value: shippingDetails.extraField2Value || undefined,
        },
        clientOrderNumber: clientOrderNumber || undefined,
        paymentStatus: paymentStatus || undefined,
      };

      console.log("Sending order data:", orderData);
      console.log("Items being sent:", orderData.items);
      console.log("ClientId being sent:", orderData.clientId);
      console.log("Items length:", orderData.items.length);

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

  // Show error state if no order data is loaded after attempting to load
  if (!formData.clientId && !getOrderLoading && hasAttemptedLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">The order you're trying to edit could not be found.</p>
          <Button onClick={() => navigate("/employee/pending-client-orders")}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <div className="container mx-auto ">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Order Information */}
          <FormSection title="Order Information" icon={FileText}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client *</Label>
                  <Select
                    value={formData.clientId || undefined}
                    onValueChange={(value) => handleInputChange("clientId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientsData?.clients?.filter(client => client._id && client.name && client._id !== "").map((client) => (
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
          </FormSection>

          {/* Shipping Details */}
          <FormSection title="Shipping Details" icon={MapPin}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="shippingAddress">Shipping Address</Label>
                  <Input
                    id="shippingAddress"
                    value={shippingDetails.shippingAddress}
                    onChange={(e) => handleShippingChange("shippingAddress", e.target.value)}
                    placeholder="Enter shipping address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingCity">City</Label>
                  <Input
                    id="shippingCity"
                    value={shippingDetails.shippingCity}
                    onChange={(e) => handleShippingChange("shippingCity", e.target.value)}
                    placeholder="Enter city"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingState">State</Label>
                  <Input
                    id="shippingState"
                    value={shippingDetails.shippingState}
                    onChange={(e) => handleShippingChange("shippingState", e.target.value)}
                    placeholder="Enter state"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingPincode">Pincode</Label>
                  <Input
                    id="shippingPincode"
                    value={shippingDetails.shippingPincode}
                    onChange={(e) => handleShippingChange("shippingPincode", e.target.value)}
                    placeholder="Enter pincode"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingPhone">Phone</Label>
                  <Input
                    id="shippingPhone"
                    value={shippingDetails.shippingPhone}
                    onChange={(e) => handleShippingChange("shippingPhone", e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingMethod">Shipping Method</Label>
                  <Select
                    value={shippingDetails.shippingMethod}
                    onValueChange={(value) => handleShippingChange("shippingMethod", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shipping method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pickup">Pickup</SelectItem>
                      <SelectItem value="home_delivery">Home Delivery</SelectItem>
                      <SelectItem value="courier">Courier</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                      <SelectItem value="local_transport">Local Transport</SelectItem>
                      <SelectItem value="customer_courier">Customer Courier</SelectItem>
                      <SelectItem value="aggregator">Aggregator</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingCost">Shipping Cost (₹)</Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    value={shippingDetails.shippingCost}
                    onChange={(e) => handleShippingChange("shippingCost", e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="Enter shipping cost"
                  />
                </div>

                {shippingDetails.extraField1Label && (
                  <div className="space-y-2">
                    <Label>{shippingDetails.extraField1Label}</Label>
                    <Input
                      value={shippingDetails.extraField1Value}
                      onChange={(e) =>
                        handleShippingChange("extraField1Value", e.target.value)
                      }
                      placeholder={shippingDetails.extraField1Label}
                    />
                  </div>
                )}
                {shippingDetails.extraField2Label && (
                  <div className="space-y-2">
                    <Label>{shippingDetails.extraField2Label}</Label>
                    <Input
                      value={shippingDetails.extraField2Value}
                      onChange={(e) =>
                        handleShippingChange("extraField2Value", e.target.value)
                      }
                      placeholder={shippingDetails.extraField2Label}
                    />
                  </div>
                )}

              


                <div className="space-y-2">
                  <Label htmlFor="deliveryPerson">Delivery Person</Label>
                  <Input
                    id="deliveryPerson"
                    value={shippingDetails.deliveryPerson}
                    onChange={(e) => handleShippingChange("deliveryPerson", e.target.value)}
                    placeholder="Enter delivery person name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryPersonContact">Delivery Person Contact</Label>
                  <Input
                    id="deliveryPersonContact"
                    value={shippingDetails.deliveryPersonContact}
                    onChange={(e) => handleShippingChange("deliveryPersonContact", e.target.value)}
                    placeholder="Enter contact number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryStatus">Delivery Status</Label>
                  <Select
                    value={shippingDetails.deliveryStatus}
                    onValueChange={(value) => handleShippingChange("deliveryStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryNotes">Delivery Notes</Label>
                <Input
                  id="deliveryNotes"
                  value={shippingDetails.deliveryNotes}
                  onChange={(e) => handleShippingChange("deliveryNotes", e.target.value)}
                  placeholder="Add delivery notes..."
                />
              </div>
          </FormSection>

          {/* Order Items */}
          <FormSection title="Order Items" icon={Package}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600">Add items to the order</div>
              <Button type="button" onClick={addItem} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
            <div className="space-y-4">
              {console.log("Rendering items:", items)}
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
                          {itemData?.items?.filter(item => item._id && item.name && item._id !== "").map((itemType) => (
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
                        value={item.fabric || "none"}
                        onValueChange={(value) => handleItemChange(index, "fabric", value === "none" ? "" : value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select fabric" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Fabric</SelectItem>
                          {fabricsData?.fabrics?.filter(fabric => fabric._id && fabric.name && fabric._id !== "").map((fabric) => (
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

                  {item.itemType && itemData?.items?.find(i => i._id === item.itemType)?.styles && (
                    <div className="space-y-2">
                      <Label>Style</Label>
                      <Select
                        value={item.style?.styleId || "none"}
                        onValueChange={(value) => {
                          if (value === "none") {
                            handleItemChange(index, "style", {
                              styleId: "",
                              styleName: "",
                              description: ""
                            });
                          } else {
                            const selectedStyle = itemData.items.find(i => i._id === item.itemType)?.styles?.find(s => s.styleId === value);
                            handleItemChange(index, "style", {
                              styleId: value,
                              styleName: selectedStyle?.styleName || "",
                              description: selectedStyle?.description || ""
                            });
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Style</SelectItem>
                          {itemData.items.find(i => i._id === item.itemType)?.styles?.filter(style => style.styleId && style.styleName && style.styleId !== "").map((style) => (
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

                  {/* Measurement toggle logic in Order Items section: */}
                  {formData.orderType !== "fabric" && (
                    <div className="mb-3">
                      <Button variant="outline" type="button" size="sm" onClick={() => toggleShowMeasurements(index)}>
                        {showMeasurementIdxs.includes(index) ? "Hide" : "Add"} Measurement
                      </Button>
                    </div>
                  )}
                  {/* Measurements shown only if toggled */}
                  {formData.orderType !== "fabric" && showMeasurementIdxs.includes(index) && itemData?.items?.find((i) => i._id === item.itemType)?.fields && (
                    <div className="mb-4">
                      <Label className="text-sm font-medium mb-2 block">
                        Measurements
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {itemData.items
                          .find((i) => i._id === item.itemType)
                          ?.fields?.map((field) => (
                            <Input
                              key={field}
                              type="number"
                              placeholder={`${field} (cm)`}
                              value={item.measurement[field] || ""}
                              onChange={(e) => handleMeasurementChange(index, field, e.target.value)}
                              className="h-8 text-sm"
                            />
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>No items added yet</p>
                  <p className="text-sm">Click "Add Item" to start adding items to this order</p>
                </div>
              )}
            </div>
          </FormSection>

          {/* Order Summary */}
          <FormSection title="Order Summary" icon={FileText}>
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
                        
                        {orderTotal.shippingCost > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Shipping Cost:</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {formatCurrency(orderTotal.shippingCost)}
                            </span>
                          </div>
                        )}
                        
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
          </FormSection>

          {/* Pricing and Payment Section */}
          <FormSection title="Pricing and Payment" icon={ShoppingCart}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="clientOrderNumber">Client Order Number</Label>
                <Input
                  id="clientOrderNumber"
                  placeholder="Client's Order Number (optional)"
                  value={clientOrderNumber}
                  onChange={e => setClientOrderNumber(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select
                  value={paymentStatus}
                  onValueChange={setPaymentStatus}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Payment Status" />
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
            </div>
          </FormSection>

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

export default UpdateOrder;
