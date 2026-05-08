import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, Loader2, User, Package, Users, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useCreatePendingOrderMutation } from "@/features/api/pendingOrderApi";
import {
  useCreateInvoiceMutation,
  useGenerateInvoicePDFMutation,
} from "@/features/api/invoiceApi";
import { useGetAllItemMastersQuery } from "@/features/api/itemApi";
import { useGetAllMastersQuery } from "@/features/api/masterApi";
import { useGetAllSalesmenQuery } from "@/features/api/salesmanApi";
import { useGetAllFabricsQuery } from "@/features/api/fabricApi";
import { useGetAllStylesQuery } from "@/features/api/styleApi";
import { useGetAllCustomersQuery } from "@/features/api/customerApi";
import { useGetAllBranchesQuery } from "@/features/api/branchApi";
import { PDFViewer } from "@react-pdf/renderer";
import InvoiceDocument from "@/utils/invoiceTemplate.jsx";

const CreatePendingOrder = () => {
  const navigate = useNavigate();

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
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  });
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

  const [createPendingOrder, { isLoading }] = useCreatePendingOrderMutation();
  const [createInvoice, { isLoading: isCreatingInvoice }] = useCreateInvoiceMutation();
  const [generateInvoicePDF, { isLoading: isDownloadingInvoice }] =
    useGenerateInvoicePDFMutation();
  const [showInvoiceViewer, setShowInvoiceViewer] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [createdInvoiceId, setCreatedInvoiceId] = useState("");

  const mapInvoiceToTemplateData = (invoice) => {
    const selectedBranch = branchesData?.branches?.find((b) => b._id === branchId) || {};
    return {
      invoiceNumber: invoice?.invoiceNumber,
      invoiceDate: new Date(invoice?.billDate || Date.now()).toLocaleDateString("en-IN"),
      dueDate: new Date(invoice?.dueDate || Date.now()).toLocaleDateString("en-IN"),
      companyName: "JMD STITCHING PRIVATE LIMITED",
      companyAddress: selectedBranch?.address || "",
      companyPhone: selectedBranch?.phone || "",
      companyEmail: selectedBranch?.email || "",
      companyGST: selectedBranch?.gst || "",
      companyPAN: selectedBranch?.pan || "",
      clientName: invoice?.customer?.name || customerDetails?.name || "",
      clientMobile: invoice?.customer?.mobile || customerDetails?.mobile || "",
      clientEmail: invoice?.customer?.email || customerDetails?.email || "",
      clientAddress: invoice?.customer?.address || "",
      clientCity: invoice?.customer?.city || "",
      clientState: invoice?.customer?.state || "",
      clientPincode: invoice?.customer?.pincode || "",
      gstin: "",
      subtotal: invoice?.subtotal || 0,
      taxableAmount: invoice?.subtotal - (invoice?.discountAmount || 0) || 0,
      taxRate: invoice?.gstPercentage || 0,
      taxAmount: invoice?.gstAmount || 0,
      discountAmount: invoice?.discountAmount || 0,
      totalAmount: invoice?.totalAmount || 0,
      paymentStatus: invoice?.paymentStatus || "pending",
      paidAmount: invoice?.paidAmount || 0,
      pendingAmount: invoice?.balanceAmount || 0,
      branchQrCodeImage: selectedBranch?.qrCodeImage || "",
      shippingDetails: {
        shippingAddress: shippingDetails.shippingAddress || "",
        shippingCity: shippingDetails.shippingCity || "",
        shippingState: shippingDetails.shippingState || "",
        shippingPincode: shippingDetails.shippingPincode || "",
        shippingPhone: shippingDetails.shippingPhone || "",
        shippingMethod: shippingDetails.shippingMethod || "",
        deliveryStatus: shippingDetails.deliveryStatus || "",
        deliveryPerson: shippingDetails.deliveryPerson || "",
        deliveryNotes: shippingDetails.deliveryNotes || "",
      },
      items: (invoice?.items || []).map((item) => ({
        name: item?.itemType?.name || "Item",
        quantity: Number(item?.quantity) || 1,
        unitPrice:
          (item?.fabricAmount || 0) +
          (item?.stitchingAmount || 0) +
          ((item?.alteration || 0) + (item?.handwork || 0) + (item?.otherCharges || 0)),
        totalPrice: item?.totalAmount || 0,
        description: item?.description || "",
        designNumber: item?.designNumber || "",
        alteration: Number(item?.alteration) || 0,
        handwork: Number(item?.handwork) || 0,
        otherCharges: Number(item?.otherCharges) || 0,
      })),
    };
  };

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

    try {
      const createRes = await createPendingOrder(body);
      const pendingOrderId = createRes?.data?.orderId;
      if (!pendingOrderId) {
        toast.error(createRes?.error?.data?.message || "Failed to create order");
        return;
      }

      const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      const invoiceRes = await createInvoice({
        pendingOrderId,
        dueDate,
      });

      if (invoiceRes?.data?.invoice) {
        toast.success("Order and invoice created successfully");
        setCreatedInvoiceId(invoiceRes.data.invoice._id);
        setInvoiceData(mapInvoiceToTemplateData(invoiceRes.data.invoice));
        setShowInvoiceViewer(true);
      } else {
        toast.error(invoiceRes?.error?.data?.message || "Order created but invoice generation failed");
        navigate("/employee/pending-orders");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <div className="container mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create Pending Order
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Add a new pending order with customer and item details
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/employee/pending-orders")}
          >
            Back to Orders
          </Button>
        </div>

        <div className="space-y-4">
          {/* Main Form */}
          <div className="space-y-4">
            {/* Order Type Card */}
            <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
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
            <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
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
            <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
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
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          className="mt-1"
                          value={item.alteration || 0}
                          onChange={(e) => handleItemChange(index, "alteration", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Handwork (₹)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          className="mt-1"
                          value={item.handwork || 0}
                          onChange={(e) => handleItemChange(index, "handwork", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Other Charges (₹)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          className="mt-1"
                          value={item.otherCharges || 0}
                          onChange={(e) => handleItemChange(index, "otherCharges", e.target.value)}
                        />
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
            <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <Input className="mt-1" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
                <div>
                  <Label className="text-sm font-medium">Special Instructions</Label>
                  <Input className="mt-1" value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle>Shipping Details</CardTitle>
              </CardHeader>
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
          <div className="space-y-4">
            {/* Staff Assignment Card */}
            <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
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
            <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                    disabled={isLoading || isCreatingInvoice}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading || isCreatingInvoice ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        Creating...
                      </>
                    ) : (
                      "Create Pending Order"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showInvoiceViewer && invoiceData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Invoice Preview</h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => createdInvoiceId && generateInvoicePDF(createdInvoiceId)}
                  variant="outline"
                  disabled={!createdInvoiceId || isDownloadingInvoice}
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  Download PDF
                </Button>
                <Button
                  onClick={() => setShowPDFModal(true)}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  View PDF
                </Button>
                <Button
                  onClick={() => {
                    setShowInvoiceViewer(false);
                    setInvoiceData(null);
                    navigate("/employee/pending-orders");
                  }}
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <PDFViewer className="w-full h-full">
                <InvoiceDocument {...invoiceData} />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}

      {showPDFModal && invoiceData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">PDF Viewer</h3>
              <Button onClick={() => setShowPDFModal(false)} variant="outline">
                Close
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <PDFViewer className="w-full h-full">
                <InvoiceDocument {...invoiceData} />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePendingOrder;
