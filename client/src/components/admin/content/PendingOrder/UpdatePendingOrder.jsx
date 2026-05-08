import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { PlusCircle, Trash2, Loader2, User, Package, Users, ShoppingCart, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import {
  useUpdatePendingOrderMutation,
  useGetPendingOrderByIdMutation,
} from "@/features/api/pendingOrderApi";
import { useGetAllItemMastersQuery } from "@/features/api/itemApi";
import { useGetAllMastersQuery } from "@/features/api/masterApi";
import { useGetAllSalesmenQuery } from "@/features/api/salesmanApi";
import { useGetAllFabricsQuery } from "@/features/api/fabricApi";
import { useGetAllStylesQuery } from "@/features/api/styleApi";
import { useGetAllCustomersQuery } from "@/features/api/customerApi";
import { useGetAllBranchesQuery } from "@/features/api/branchApi";

const UpdatePendingOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId: orderIdFromParams } = useParams();
  const orderId = orderIdFromParams || location.state?.orderId;

  const [orderType, setOrderType] = useState("");
  const [existingCustomer, setExistingCustomer] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    mobile: "",
    email: "",
  });
  const [master, setMaster] = useState("");
  const [salesman, setSalesman] = useState("");
  const [branchId, setBranchId] = useState("");
  const [priority, setPriority] = useState("medium");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [taxRate, setTaxRate] = useState("5");
  const [advancePayment, setAdvancePayment] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [paymentNotes, setPaymentNotes] = useState("");
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
  const [items, setItems] = useState([
    {
      itemType: "",
      measurement: {},
      fabric: "",
      fabricMeters: "",
      style: "",
      quantity: 1,
      designNumber: "",
      description: "",
      clientOrderNumber: "",
      alteration: 0,
      handwork: 0,
      otherCharges: 0,
    },
  ]);

  const { data: itemData } = useGetAllItemMastersQuery({ page: 1, limit: 100 });
  const { data: masterData } = useGetAllMastersQuery({ page: 1, limit: 100 });
  const { data: salesmenData } = useGetAllSalesmenQuery({
    page: 1,
    limit: 100,
  });
  const { data: fabricsData } = useGetAllFabricsQuery({ page: 1, limit: 100 });
  const { data: stylesData } = useGetAllStylesQuery({ page: 1, limit: 100 });
  const { data: customersData } = useGetAllCustomersQuery({
    page: 1,
    limit: 100,
  });
  const { data: branchesData } = useGetAllBranchesQuery({ page: 1, limit: 100 });

  const [updatePendingOrder, { isLoading, isSuccess, isError, error, data }] =
    useUpdatePendingOrderMutation();
  const [getPendingOrderById] = useGetPendingOrderByIdMutation();

  // Load existing order data if orderId is provided
  useEffect(() => {
    if (!orderId) {
      toast.error("No order ID provided");
      navigate("/employee/pending-orders");
      return;
    }

    const loadOrder = async () => {
      const res = await getPendingOrderById(orderId);
      if (!res?.data?.order) return;
      const order = res.data.order;
      setOrderType(order.orderType || "");
      setMaster(order.master?._id || "");
      setSalesman(order.salesman?._id || "");
      setBranchId(order.branchId?._id || "");
      setPriority(order.priority || "medium");
      setExpectedDeliveryDate(
        order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toISOString().split("T")[0] : ""
      );
      setNotes(order.notes || "");
      setSpecialInstructions(order.specialInstructions || "");
      setDiscountType(order.discountType || "percentage");
      setDiscountValue(order.discountValue?.toString?.() || "");
      setTaxRate(order.taxRate?.toString?.() || "5");
      setAdvancePayment(order.advancePayment?.toString?.() || "");
      setPaymentMethod(order.paymentMethod || "");
      setPaymentStatus(order.paymentStatus || "pending");
      setPaymentNotes(order.paymentNotes || "");
      setShippingDetails({
        shippingAddress: order.shippingDetails?.shippingAddress || "",
        shippingCity: order.shippingDetails?.shippingCity || "",
        shippingState: order.shippingDetails?.shippingState || "",
        shippingPincode: order.shippingDetails?.shippingPincode || "",
        shippingPhone: order.shippingDetails?.shippingPhone || "",
        shippingMethod: order.shippingDetails?.shippingMethod || "home_delivery",
        shippingCost: order.shippingDetails?.shippingCost || 0,
        deliveryNotes: order.shippingDetails?.deliveryNotes || "",
        deliveryPerson: order.shippingDetails?.deliveryPerson || "",
        deliveryPersonContact: order.shippingDetails?.deliveryPersonContact || "",
        deliveryStatus: order.shippingDetails?.deliveryStatus || "pending",
        extraField1Label: order.shippingDetails?.extraField1Label || "",
        extraField1Value: order.shippingDetails?.extraField1Value || "",
        extraField2Label: order.shippingDetails?.extraField2Label || "",
        extraField2Value: order.shippingDetails?.extraField2Value || "",
      });

      if (order.customer?._id) {
        setExistingCustomer(true);
        setSelectedCustomerId(order.customer._id);
      } else if (order.customerDetails) {
        setExistingCustomer(false);
        setCustomerDetails({
          name: order.customerDetails.name || "",
          mobile: order.customerDetails.mobile || "",
          email: order.customerDetails.email || "",
        });
      }

      setItems(
        (order.items || []).map((item) => ({
          itemType: item.itemType?._id || item.itemType || "",
          measurement: item.measurement || {},
          fabric: item.fabric?._id || item.fabric || "",
          fabricMeters: item.fabricMeters || "",
          style: item.style?._id || item.style || "",
          quantity: item.quantity || 1,
          designNumber: item.designNumber || "",
          description: item.description || "",
          itemCode: item.itemCode,
          clientOrderNumber: item.clientOrderNumber || "",
          alteration: item.alteration || 0,
          handwork: item.handwork || 0,
          otherCharges: item.otherCharges || 0,
        }))
      );
    };

    loadOrder();
  }, [orderId, navigate]);

  const handleItemChange = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;
    
    // Reset measurements when item type changes
    if (key === "itemType") {
      updated[index].measurement = {};
    }
    
    // Reset fabric meters when fabric changes
    if (key === "fabric") {
      updated[index].fabricMeters = "";
    }
    
    setItems(updated);
  };

  const handleMeasurementChange = (index, field, value) => {
    const updated = [...items];
    updated[index].measurement[field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        itemType: "",
        measurement: {},
        fabric: "",
        fabricMeters: "",
        style: "",
        quantity: 1,
        designNumber: "",
        description: "",
        clientOrderNumber: "",
        alteration: 0,
        handwork: 0,
        otherCharges: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    // Check required fields
    if (!orderType) {
      toast.error("Please select an order type");
      return false;
    }

    if (!master) {
      toast.error("Please select a master");
      return false;
    }

    if (!salesman) {
      toast.error("Please select a salesman");
      return false;
    }
    if (!branchId) {
      toast.error("Please select a branch");
      return false;
    }

    // Check customer details
    if (existingCustomer && !selectedCustomerId) {
      toast.error("Please select a customer");
      return false;
    }

    if (!existingCustomer) {
      if (!customerDetails.name || !customerDetails.mobile) {
        toast.error("Please fill in customer name and mobile");
        return false;
      }
    }

    // Check items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.itemType) {
        toast.error(`Please select item type for item ${i + 1}`);
        return false;
      }

      if (!item.quantity || item.quantity < 1) {
        toast.error(`Please enter valid quantity for item ${i + 1}`);
        return false;
      }

      // Fabric meters are optional in pending orders
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const body = {
      orderId,
      orderType,
      customer: existingCustomer ? selectedCustomerId : null,
      customerDetails: existingCustomer ? undefined : customerDetails,
      master,
      salesman,
      branchId,
      expectedDeliveryDate: expectedDeliveryDate || null,
      priority,
      notes,
      specialInstructions,
      discountType,
      discountValue: discountValue ? parseFloat(discountValue) : 0,
      taxRate: taxRate ? parseFloat(taxRate) : 5,
      advancePayment: advancePayment ? parseFloat(advancePayment) : 0,
      paymentMethod: paymentMethod || undefined,
      paymentStatus,
      paymentNotes,
      shippingDetails: {
        ...shippingDetails,
        shippingCost: parseFloat(shippingDetails.shippingCost) || 0,
      },
      items: items.map(item => ({
        ...item,
        fabric: item.fabric || undefined,
        style: item.style || undefined,
        fabricMeters: item.fabric ? parseFloat(item.fabricMeters) : undefined,
        quantity: parseInt(item.quantity),
        alteration: parseFloat(item.alteration) || 0,
        handwork: parseFloat(item.handwork) || 0,
        otherCharges: parseFloat(item.otherCharges) || 0,
      })),
    };

    await updatePendingOrder(body);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Pending Order updated successfully");
      navigate("/employee/pending-orders");
    } else if (isError) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  }, [isSuccess, isError]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/employee/pending-orders")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Update Pending Order
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Modify existing order details
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Type Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Order Type *</Label>
                  <Select value={orderType} onValueChange={setOrderType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fabric">Fabric Only</SelectItem>
                      <SelectItem value="fabric_stitching">Fabric + Stitching</SelectItem>
                      <SelectItem value="stitching">Stitching Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Branch *</Label>
                    <Select value={branchId} onValueChange={setBranchId}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branchesData?.branches?.map((b) => (
                          <SelectItem key={b._id} value={b._id}>
                            {b.branchName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Priority</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger className="mt-1">
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
                  <div>
                    <Label className="text-sm font-medium">Expected Delivery Date</Label>
                    <Input
                      type="date"
                      className="mt-1"
                      value={expectedDeliveryDate}
                      onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium">Customer Type:</Label>
                  <Select
                    value={existingCustomer ? "existing" : "new"}
                    onValueChange={(v) => setExistingCustomer(v === "existing")}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Customer</SelectItem>
                      <SelectItem value="existing">Existing Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {existingCustomer ? (
                  <div>
                    <Label className="text-sm font-medium">Select Customer *</Label>
                    <Select
                      value={selectedCustomerId}
                      onValueChange={setSelectedCustomerId}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose existing customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customersData?.customers?.map((c) => (
                          <SelectItem key={c._id} value={c._id}>
                            {c.name} - {c.mobile}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Name *</Label>
                      <Input
                        placeholder="Customer name"
                        value={customerDetails.name}
                        onChange={(e) =>
                          setCustomerDetails({ ...customerDetails, name: e.target.value })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Mobile *</Label>
                      <Input
                        placeholder="Mobile number"
                        value={customerDetails.mobile}
                        onChange={(e) =>
                          setCustomerDetails({
                            ...customerDetails,
                            mobile: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <Input
                        placeholder="Email address"
                        type="email"
                        value={customerDetails.email}
                        onChange={(e) =>
                          setCustomerDetails({
                            ...customerDetails,
                            email: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Items Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Item {index + 1}
                      </h4>
                      {items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label className="text-sm font-medium">Customer Order Number</Label>
                        <Input
                          placeholder="Customer reference"
                          value={item.clientOrderNumber || ""}
                          onChange={(e) =>
                            handleItemChange(index, "clientOrderNumber", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Item Type *</Label>
                        <Select
                          value={item.itemType}
                          onValueChange={(v) => handleItemChange(index, "itemType", v)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select item type" />
                          </SelectTrigger>
                          <SelectContent>
                            {itemData?.items?.map((i) => (
                              <SelectItem key={i._id} value={i._id}>
                                {i.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Quantity *</Label>
                        <Input
                          type="number"
                          min={1}
                          placeholder="Quantity"
                          value={item.quantity || 1}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Style</Label>
                        <Select
                          value={item.style}
                          onValueChange={(v) => handleItemChange(index, "style", v)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            {stylesData?.styles?.map((s) => (
                              <SelectItem key={s._id} value={s._id}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Fabric</Label>
                        <Select
                          value={item.fabric}
                          onValueChange={(v) => handleItemChange(index, "fabric", v)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select fabric" />
                          </SelectTrigger>
                          <SelectContent>
                            {fabricsData?.fabrics?.map((f) => (
                              <SelectItem key={f._id} value={f._id}>
                                {f.name} - ₹{f.pricePerMeter}/m
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Fabric Meters</Label>
                        <Input
                          type="number"
                          min={0}
                          step={0.1}
                          placeholder="Enter meters"
                          value={item.fabricMeters || ""}
                          onChange={(e) =>
                            handleItemChange(index, "fabricMeters", e.target.value)
                          }
                          className="mt-1"
                          disabled={!item.fabric}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Design Number</Label>
                        <Input
                          placeholder="Design number"
                          value={item.designNumber || ""}
                          onChange={(e) =>
                            handleItemChange(index, "designNumber", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label className="text-sm font-medium">Alteration (₹)</Label>
                        <Input type="number" min="0" step="0.01" className="mt-1" value={item.alteration || 0} onChange={(e) => handleItemChange(index, "alteration", e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Handwork (₹)</Label>
                        <Input type="number" min="0" step="0.01" className="mt-1" value={item.handwork || 0} onChange={(e) => handleItemChange(index, "handwork", e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Other Charges (₹)</Label>
                        <Input type="number" min="0" step="0.01" className="mt-1" value={item.otherCharges || 0} onChange={(e) => handleItemChange(index, "otherCharges", e.target.value)} />
                      </div>
                    </div>

                    {/* Measurements */}
                    {itemData?.items?.find((i) => i._id === item.itemType)?.fields && (
                      <div>
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
                                onChange={(e) =>
                                  handleMeasurementChange(index, field, e.target.value)
                                }
                              />
                            ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <Input
                        placeholder="Additional notes"
                        value={item.description || ""}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addItem}
                  className="w-full"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Another Item
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Additional Information</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label className="text-sm font-medium">Notes</Label><Input className="mt-1" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
                <div><Label className="text-sm font-medium">Special Instructions</Label><Input className="mt-1" value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} /></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Shipping Details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input placeholder="Shipping address" value={shippingDetails.shippingAddress} onChange={(e) => setShippingDetails({ ...shippingDetails, shippingAddress: e.target.value })} />
                <Input placeholder="City" value={shippingDetails.shippingCity} onChange={(e) => setShippingDetails({ ...shippingDetails, shippingCity: e.target.value })} />
                <Input placeholder="State" value={shippingDetails.shippingState} onChange={(e) => setShippingDetails({ ...shippingDetails, shippingState: e.target.value })} />
                <Input placeholder="Pincode" value={shippingDetails.shippingPincode} onChange={(e) => setShippingDetails({ ...shippingDetails, shippingPincode: e.target.value })} />
                <Input placeholder="Phone" value={shippingDetails.shippingPhone} onChange={(e) => setShippingDetails({ ...shippingDetails, shippingPhone: e.target.value })} />
                <Select value={shippingDetails.shippingMethod} onValueChange={(v) => setShippingDetails({ ...shippingDetails, shippingMethod: v })}>
                  <SelectTrigger><SelectValue placeholder="Shipping method" /></SelectTrigger>
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
                <Input type="number" min="0" step="0.01" placeholder="Shipping Cost" value={shippingDetails.shippingCost} onChange={(e) => setShippingDetails({ ...shippingDetails, shippingCost: e.target.value })} />
                <Input placeholder="Delivery person" value={shippingDetails.deliveryPerson} onChange={(e) => setShippingDetails({ ...shippingDetails, deliveryPerson: e.target.value })} />
                <Input placeholder="Delivery person contact" value={shippingDetails.deliveryPersonContact} onChange={(e) => setShippingDetails({ ...shippingDetails, deliveryPersonContact: e.target.value })} />
                <Input placeholder="Delivery notes" value={shippingDetails.deliveryNotes} onChange={(e) => setShippingDetails({ ...shippingDetails, deliveryNotes: e.target.value })} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24 self-start">
            {/* Staff Assignment Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Staff Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Master *</Label>
                  <Select value={master} onValueChange={setMaster}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select master" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData?.masters?.map((m) => (
                        <SelectItem key={m._id} value={m._id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Salesman *</Label>
                  <Select value={salesman} onValueChange={setSalesman}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select salesman" />
                    </SelectTrigger>
                    <SelectContent>
                      {salesmenData?.salesmen?.map((s) => (
                        <SelectItem key={s._id} value={s._id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Order Type:</span>
                  <span className="text-sm font-medium capitalize">
                    {orderType || "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Items:</span>
                  <span className="text-sm font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Customer:</span>
                  <span className="text-sm font-medium">
                    {existingCustomer 
                      ? customersData?.customers?.find(c => c._id === selectedCustomerId)?.name || "Not selected"
                      : customerDetails.name || "New customer"
                    }
                  </span>
                </div>
                <Separator />
                <div className="grid grid-cols-1 gap-3">
                  <Select value={discountType} onValueChange={setDiscountType}>
                    <SelectTrigger><SelectValue placeholder="Discount type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" min="0" step="0.01" placeholder="Discount value" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} />
                  <Input type="number" min="0" step="0.01" placeholder="Tax rate (%)" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
                  <Input type="number" min="0" step="0.01" placeholder="Advance payment" value={advancePayment} onChange={(e) => setAdvancePayment(e.target.value)} />
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger><SelectValue placeholder="Payment method" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                    <SelectTrigger><SelectValue placeholder="Payment status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Payment notes" value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)} />
                </div>
                <div className="pt-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        Updating Order...
                      </>
                    ) : (
                      "Update Pending Order"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePendingOrder;
