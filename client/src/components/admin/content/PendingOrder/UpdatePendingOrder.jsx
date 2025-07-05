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
import { useNavigate, useLocation } from "react-router-dom";
import { PlusCircle, Trash2, Loader2, User, Package, Users, ShoppingCart, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useUpdatePendingOrderMutation } from "@/features/api/pendingOrderApi";
import { useGetAllItemMastersQuery } from "@/features/api/itemApi";
import { useGetAllMastersQuery } from "@/features/api/masterApi";
import { useGetAllSalesmenQuery } from "@/features/api/salesmanApi";
import { useGetAllFabricsQuery } from "@/features/api/fabricApi";
import { useGetAllStylesQuery } from "@/features/api/styleApi";
import { useGetAllCustomersQuery } from "@/features/api/customerApi";

const UpdatePendingOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

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

  const [updatePendingOrder, { isLoading, isSuccess, isError, error, data }] =
    useUpdatePendingOrderMutation();

  // Load existing order data if orderId is provided
  useEffect(() => {
    if (!orderId) {
      toast.error("No order ID provided");
      navigate("/admin/pending-orders");
      return;
    }

    // Here you would typically fetch the order data
    // For now, we'll show a placeholder
    toast.info("Order update functionality coming soon");
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

      // Check fabric validation
      if (item.fabric && (!item.fabricMeters || item.fabricMeters < 2)) {
        toast.error(`Fabric meters must be at least 2 for item ${i + 1}`);
        return false;
      }
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
      items: items.map(item => ({
        ...item,
        fabricMeters: item.fabric ? parseFloat(item.fabricMeters) : undefined,
        quantity: parseInt(item.quantity)
      })),
    };

    await updatePendingOrder(body);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Pending Order updated successfully");
      navigate("/admin/pending-orders");
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
              onClick={() => navigate("/admin/pending-orders")}
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
                        <Label className="text-sm font-medium">
                          Fabric Meters {item.fabric && "*"}
                        </Label>
                        <Input
                          type="number"
                          min={2}
                          step={0.1}
                          placeholder="Enter meters"
                          value={item.fabricMeters || ""}
                          onChange={(e) =>
                            handleItemChange(index, "fabricMeters", e.target.value)
                          }
                          className="mt-1"
                          disabled={!item.fabric}
                        />
                        {item.fabric && (
                          <p className="text-xs text-gray-500 mt-1">
                            Minimum 2 meters required
                          </p>
                        )}
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
