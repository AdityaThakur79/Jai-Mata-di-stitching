import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, Loader2, User, Package, Users, ShoppingCart, Calendar, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateOrderMutation, useGenerateBillMutation, useGetOrderForInvoiceMutation } from "@/features/api/orderApi";
import { useGetAllItemMastersQuery } from "@/features/api/itemApi";
import { useGetAllBranchesQuery } from "@/features/api/branchApi";
import { useGetAllFabricsQuery } from "@/features/api/fabricApi";
import { useGetAllStylesQuery } from "@/features/api/styleApi";
import { useGetAllClientsQuery, useCreateClientMutation } from "@/features/api/clientApi";
import { PDFViewer } from '@react-pdf/renderer';
import InvoiceDocument from '@/utils/invoiceTemplate.jsx';

// Form Section Component
const FormSection = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
      <Icon className="w-4 h-4 text-gray-600" />
      <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
    </div>
    {children}
  </div>
);

// Form Field Component
const FormField = ({ label, required, children, className = "" }) => (
  <div className={`space-y-1 ${className}`}>
    <Label className="text-xs font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    {children}
  </div>
);

const CreateOrder = () => {
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState("");
  const [existingClient, setExistingClient] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clientDetails, setClientDetails] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstin: "",
    pan: "",
  });
  const [branchId, setBranchId] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 13);
    return d.toISOString().split("T")[0];
  });
  const [priority, setPriority] = useState("medium");
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
      alteration: 0,
      handwork: 0,
      otherCharges: 0,
      clientOrderNumber: "",
    },
  ]);
  const [notes, setNotes] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  // Shipping state (to match Update Order)
  const [shippingDetails, setShippingDetails] = useState({
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingPincode: "",
    shippingPhone: "",
    shippingMethod: "home_delivery",
    shippingCost: 0,
    // trackingNumber removed
    deliveryNotes: "",
    deliveryPerson: "",
    deliveryPersonContact: "",
    deliveryStatus: "pending",
    extraField1Label: "",
    extraField1Value: "",
    extraField2Label: "",
    extraField2Value: "",
  });
  
  // Pricing state
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [discountNarration, setDiscountNarration] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [referenceName, setReferenceName] = useState("");
  const [taxRate, setTaxRate] = useState("5");
  
  // Payment state
  const [advancePayment, setAdvancePayment] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  // --- STATE ADDITIONS ---
  const [paymentStatus, setPaymentStatus] = useState("pending"); // default as in model
  // --- STATE ADDITIONS ---

  // API calls
  const { data: itemData } = useGetAllItemMastersQuery({ page: 1, limit: 100 });
  const { data: branchesData } = useGetAllBranchesQuery();
  const { data: fabricsData } = useGetAllFabricsQuery({ page: 1, limit: 100 });
  const { data: stylesData } = useGetAllStylesQuery({ page: 1, limit: 100 });
  const { data: clientsData } = useGetAllClientsQuery({ page: 1, limit: 100 });

  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [createClient, { isLoading: isCreatingClient }] = useCreateClientMutation();
  const [generateBill] = useGenerateBillMutation();
  const [getOrderForInvoice] = useGetOrderForInvoiceMutation();
  const [lookupMode] = useState("gstin");

  // Invoice preview modal state
  const [showInvoiceViewer, setShowInvoiceViewer] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);

  // Auto-fill city/state based on pincode
  useEffect(() => {
    const pincode = (clientDetails.pincode || "").trim();
    if (pincode && /^[0-9]{6}$/.test(pincode)) {
      const fetchPincodeDetails = async () => {
        try {
          const attempts = [
            () => fetch(`https://www.postalpincode.in/api/pincode/${pincode}`),
            () => fetch(`https://api.postalpincode.in/pincode/${pincode}`),
            () => fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`http://www.postalpincode.in/api/pincode/${pincode}`)}`),
            () => fetch(`https://cors-anywhere.herokuapp.com/https://www.postalpincode.in/api/pincode/${pincode}`),
            () => fetch(`https://thingproxy.freeboard.io/fetch/https://www.postalpincode.in/api/pincode/${pincode}`),
          ];

          let data = null;
          for (const attempt of attempts) {
            try {
              const res = await attempt();
              if (!res.ok) continue;
              data = await res.json();
              break;
            } catch (_) {}
          }

          if (data) {
            const arr = Array.isArray(data) ? data : [data];
            const first = arr[0];
            const offices = first?.PostOffice || [];
            if (offices.length > 0) {
              const po = offices[0];
              setClientDetails(prev => ({
                ...prev,
                city: po?.District || prev.city,
                state: po?.State || prev.state,
              }));
            }
          }
        } catch (_) {}
      };
      fetchPincodeDetails();
    }
  }, [clientDetails.pincode]);

  const handleLookup = async () => {};

  // Basic GSTIN validation (Indian format)
  const isValidGSTIN = (value) => {
    if (!value) return true; // empty allowed where optional
    const gstin = String(value).trim().toUpperCase();
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return regex.test(gstin);
  };

  // Calculate detailed item breakdown
  const calculateItemBreakdown = (item, index) => {
    // Additional charges
    const alteration = parseFloat(item.alteration) || 0;
    const handwork = parseFloat(item.handwork) || 0;
    const otherCharges = parseFloat(item.otherCharges) || 0;
    const additionalCharges = alteration + handwork + otherCharges;

    // Fabric-only orders: compute only fabric cost, no itemType required
    if (orderType === "fabric") {
      let fabricCost = 0;
      const breakdown = [];
      if (item.fabric && item.fabricMeters && parseFloat(item.fabricMeters) > 0) {
        const selectedFabric = fabricsData?.fabrics?.find(f => f._id === item.fabric);
        if (selectedFabric) {
          const totalMeters = parseFloat(item.fabricMeters);
          fabricCost = selectedFabric.pricePerMeter * totalMeters;
          breakdown.push({
            type: 'fabric',
            name: selectedFabric.name,
            rate: selectedFabric.pricePerMeter,
            quantity: totalMeters,
            total: fabricCost,
            unit: 'meters (total for order)'
          });
        }
      }
      // Add additional charges to breakdown
      if (alteration > 0) {
        breakdown.push({
          type: 'alteration',
          name: 'Alteration',
          rate: alteration,
          quantity: 1,
          total: alteration,
          unit: 'one-time'
        });
      }
      if (handwork > 0) {
        breakdown.push({
          type: 'handwork',
          name: 'Handwork',
          rate: handwork,
          quantity: 1,
          total: handwork,
          unit: 'one-time'
        });
      }
      if (otherCharges > 0) {
        breakdown.push({
          type: 'other',
          name: 'Other Charges',
          rate: otherCharges,
          quantity: 1,
          total: otherCharges,
          unit: 'one-time'
        });
      }
      const totalPrice = fabricCost + additionalCharges;
      if (totalPrice <= 0) return null;
      return {
        itemName: 'Fabric',
        quantity: 1,
        unitPrice: totalPrice,
        totalPrice: totalPrice,
        breakdown,
        fabric: item.fabric ? fabricsData?.fabrics?.find(f => f._id === item.fabric) : null
      };
    }

    // Other orders require itemType and quantity
    if (!item.itemType || !item.quantity) return null;
    const selectedItem = itemData?.items?.find(i => i._id === item.itemType);
    if (!selectedItem) return null;

    let fabricCost = 0;
    let stitchingCost = 0;
    const breakdown = [];
    // Fabric cost when applicable
    if ((orderType === "fabric_stitching") && item.fabric && item.fabricMeters && parseFloat(item.fabricMeters) > 0) {
      const selectedFabric = fabricsData?.fabrics?.find(f => f._id === item.fabric);
      if (selectedFabric) {
        const totalMeters = parseFloat(item.fabricMeters);
        fabricCost = selectedFabric.pricePerMeter * totalMeters;
        breakdown.push({
          type: 'fabric',
          name: selectedFabric.name,
          rate: selectedFabric.pricePerMeter,
          quantity: totalMeters,
          total: fabricCost,
          unit: 'meters (total for order)'
        });
      }
    }

    // Item stitching/base cost
    stitchingCost = (selectedItem.stitchingCharge || 0) * parseInt(item.quantity);
    if ((selectedItem.stitchingCharge || 0) > 0) {
      breakdown.push({
        type: 'item_cost',
        name: 'Item Cost',
        rate: selectedItem.stitchingCharge || 0,
        quantity: parseInt(item.quantity),
        total: stitchingCost,
        unit: 'per item'
      });
    }

    // Add additional charges to breakdown
    if (alteration > 0) {
      breakdown.push({
        type: 'alteration',
        name: 'Alteration',
        rate: alteration,
        quantity: 1,
        total: alteration,
        unit: 'one-time'
      });
    }
    if (handwork > 0) {
      breakdown.push({
        type: 'handwork',
        name: 'Handwork',
        rate: handwork,
        quantity: 1,
        total: handwork,
        unit: 'one-time'
      });
    }
    if (otherCharges > 0) {
      breakdown.push({
        type: 'other',
        name: 'Other Charges',
        rate: otherCharges,
        quantity: 1,
        total: otherCharges,
        unit: 'one-time'
      });
    }

    const totalItemPrice = fabricCost + stitchingCost + additionalCharges;
    return {
      itemName: selectedItem.name,
      quantity: parseInt(item.quantity),
      unitPrice: stitchingCost / parseInt(item.quantity) + (fabricCost / parseInt(item.quantity)),
      totalPrice: totalItemPrice,
      breakdown,
      fabric: item.fabric ? fabricsData?.fabrics?.find(f => f._id === item.fabric) : null
    };
  };

  // Calculate order total
  const calculateOrderTotal = () => {
    let subtotal = 0;
    const itemBreakdowns = [];
    
    items.forEach((item, index) => {
      // Ensure quantity=1 for fabric-only so backend schema validates
      if (orderType === "fabric" && (!item.quantity || parseInt(item.quantity) < 1)) {
        item.quantity = 1;
      }
      const breakdown = calculateItemBreakdown(item, index);
      if (breakdown) {
        subtotal += breakdown.totalPrice;
        itemBreakdowns.push(breakdown);
      }
    });
    
    // Calculate discount
    let discountAmount = 0;
    if (discountValue && parseFloat(discountValue) > 0) {
      if (discountType === "percentage") {
        discountAmount = (subtotal * parseFloat(discountValue)) / 100;
      } else {
        discountAmount = parseFloat(discountValue);
      }
    }
    
    // Shipping cost
    const shippingCost = parseFloat(shippingDetails.shippingCost) || 0;
    
    // Calculate taxable amount (including shipping)
    const taxableAmount = subtotal - discountAmount + shippingCost;
    
    // Calculate tax
    const taxAmount = (taxableAmount * parseFloat(taxRate)) / 100;
    
    // Calculate total
    const totalAmount = taxableAmount + taxAmount;
    
    // Calculate advance payment
    const advanceAmount = advancePayment ? parseFloat(advancePayment) : 0;
    const balanceAmount = totalAmount - advanceAmount;
    
    return {
      subtotal,
      discountAmount,
      taxableAmount,
      taxAmount,
      shippingCost,
      totalAmount,
      advanceAmount,
      balanceAmount,
      itemBreakdowns
    };
  };

  const orderTotal = calculateOrderTotal();

  // Force re-render when pricing dependencies change
  useEffect(() => {
    // This will trigger recalculation when items, discount, tax rate, or payment changes
  }, [items, discountType, discountValue, taxRate, orderType, itemData, fabricsData, advancePayment]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const handleItemChange = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;
    
    // Reset measurements when item type changes
    if (key === "itemType") {
      updated[index].measurement = {};
      updated[index].style = ""; // Reset style when item type changes
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
      extra2Label: "Vehicle Number",
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
          extraField1Label: config.extra1Label || "",
          extraField2Label: config.extra2Label || "",
          // keep values so user can switch back if needed
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
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
        alteration: 0,
        handwork: 0,
        otherCharges: 0,
        clientOrderNumber: "",
      },
    ]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // --- MEASUREMENT BUTTON LOGIC ---
  const [showMeasurementIdxs, setShowMeasurementIdxs] = useState([]); // array of indices
  const toggleShowMeasurements = (idx) => {
    setShowMeasurementIdxs(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };
  // --- MEASUREMENT BUTTON LOGIC ---

  const validateForm = () => {
    // Check required fields
    if (!orderType) {
      toast.error("Please select an order type");
      return false;
    }

    if (!branchId) {
      toast.error("Please select a branch");
      return false;
    }

    // Check client details
    if (existingClient && !selectedClientId) {
      toast.error("Please select a client");
      return false;
    }

    if (!existingClient) {
      if (!clientDetails.name || !clientDetails.mobile || !clientDetails.address || !clientDetails.city || !clientDetails.state || !clientDetails.pincode) {
        toast.error("Please fill in all required client details");
        return false;
      }
      // Validate client GSTIN if provided
      if (clientDetails.gstin && !isValidGSTIN(clientDetails.gstin)) {
        toast.error("Please enter a valid client GSTIN");
        return false;
      }
    }

    // Check items based on order type
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (orderType !== "fabric" && (!item.itemType || item.itemType.trim() === "")) {
        toast.error(`Please select item type for item ${i + 1}`);
        return false;
      }

      if (orderType !== "fabric") {
        if (!item.quantity || item.quantity < 1) {
          toast.error(`Please enter valid quantity for item ${i + 1}`);
          return false;
        }
      }

      // Fabric validations
      if (orderType === "fabric" || orderType === "fabric_stitching") {
        if (item.fabric && (!item.fabricMeters || parseFloat(item.fabricMeters) <= 0)) {
          toast.error(`Fabric meters must be greater than 0 for item ${i + 1}`);
          return false;
        }
      }
    }

    // Validate any GST fields in shipping extra fields
    const gstLikeLabels = ["gst", "g.s.t"];
    if (
      gstLikeLabels.some((k) =>
        (shippingDetails.extraField1Label || "").toLowerCase().includes(k)
      ) &&
      shippingDetails.extraField1Value &&
      !isValidGSTIN(shippingDetails.extraField1Value)
    ) {
      toast.error("Please enter a valid GST number in shipping details");
      return false;
    }
    if (
      gstLikeLabels.some((k) =>
        (shippingDetails.extraField2Label || "").toLowerCase().includes(k)
      ) &&
      shippingDetails.extraField2Value &&
      !isValidGSTIN(shippingDetails.extraField2Value)
    ) {
      toast.error("Please enter a valid GST number in shipping details");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      let clientId = null;
      let finalClientDetails = {};

      if (existingClient) {
        // Use existing client
        clientId = selectedClientId;
        const selectedClient = clientsData?.clients?.find(c => c._id === selectedClientId);
        if (selectedClient) {
          finalClientDetails = {
            name: selectedClient.name,
            mobile: selectedClient.mobile,
            email: selectedClient.email,
            gstin: selectedClient.gstin,
            pan: selectedClient.pan,
            address: selectedClient.address,
            city: selectedClient.city,
            state: selectedClient.state,
            pincode: selectedClient.pincode,
          };
        }
      } else {
        // Create new client first
        const clientFormData = new FormData();
        Object.keys(clientDetails).forEach(key => {
          clientFormData.append(key, clientDetails[key]);
        });

        const clientResponse = await createClient(clientFormData);
        if (clientResponse.data?.success) {
          clientId = clientResponse.data.client._id;
          finalClientDetails = clientDetails;
        } else {
          const errorMsg = clientResponse.data?.message || clientResponse.error?.data?.message || "Failed to create client";
          toast.error(errorMsg);
          return;
        }
      }

      // Create order
      const orderData = {
        orderType,
        client: clientId,
        clientDetails: finalClientDetails,
        paymentStatus,
        items: items.map(item => ({
          ...item,
          itemType: item.itemType && item.itemType.trim() !== "" ? item.itemType : null,
          fabricMeters: item.fabric ? parseFloat(item.fabricMeters) : undefined,
          quantity: orderType === "fabric" ? 1 : parseInt(item.quantity),
          alteration: parseFloat(item.alteration) || 0,
          handwork: parseFloat(item.handwork) || 0,
          otherCharges: parseFloat(item.otherCharges) || 0,
          clientOrderNumber: item.clientOrderNumber !== undefined && item.clientOrderNumber !== null 
            ? item.clientOrderNumber 
            : undefined,
        })),
        branchId,
        expectedDeliveryDate: expectedDeliveryDate || null,
        priority,
        notes,
        specialInstructions,
        discountNarration: discountNarration || undefined,
        promoCode: promoCode || undefined,
        referenceName: referenceName || undefined,
        discountType,
        discountValue: discountValue ? parseFloat(discountValue) : 0,
        taxRate: parseFloat(taxRate),
        advancePayment: advancePayment ? parseFloat(advancePayment) : 0,
        paymentMethod: paymentMethod || undefined,
        paymentNotes,
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
      };

      const response = await createOrder(orderData);
      
      if (response.data?.success) {
        toast.success("Order created successfully!");

        const createdOrderId = response.data?.order?._id || response.data?.orderId;
        if (!createdOrderId) {
          toast.error("Order ID missing. Cannot generate invoice.");
          return;
        }

        // Generate bill for the created order (server computes totals and creates bill)
        const billRes = await generateBill({ orderId: createdOrderId, dueDate: new Date().toISOString() });
        if (!billRes.data?.success) {
          const billErrorMsg = billRes.data?.message || billRes.error?.data?.message || "Failed to generate bill";
          toast.error(billErrorMsg);
          return;
        }

        // Fetch invoice data for PDF rendering
        const invRes = await getOrderForInvoice(createdOrderId);
        if (invRes.data?.success && invRes.data?.invoiceData) {
          const inv = invRes.data.invoiceData;
          const normalized = {
            ...inv,
            gstin: inv.gstin || inv.clientDetails?.gstin || inv.client?.gstin || finalClientDetails?.gstin || clientDetails?.gstin,
            pdfUrl: inv.pdfUrl, // Include PDF URL from Cloudinary (image format for free plan)
            pdfOriginalUrl: inv.pdfOriginalUrl, // Original PDF URL
            pdfDeliveryFormat: inv.pdfDeliveryFormat, // Delivery format
            pdfPublicId: inv.pdfPublicId, // Include PDF public ID
          };
          setInvoiceData(normalized);
          setShowInvoiceViewer(true);
          
          // Show success message with PDF URL
          if (inv.pdfUrl) {
            toast.success(`Order created`);
          } else {
            toast.success("Order created successfully!");
          }
        } else {
          const invErrorMsg = invRes.data?.message || invRes.error?.data?.message || "Failed to load invoice data";
          toast.error(invErrorMsg);
        }
      } else {
        toast.error(response.data?.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      
      // Extract specific error message from the error response
      let errorMessage = "An error occurred while creating the order";
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      // Handle specific validation errors
      if (errorMessage.includes("validation failed")) {
        const validationErrors = error?.data?.errors || error?.response?.data?.errors;
        if (validationErrors) {
          const fieldErrors = Object.keys(validationErrors).map(field => {
            return `${field}: ${validationErrors[field].message}`;
          }).join(", ");
          errorMessage = `Validation Error: ${fieldErrors}`;
        }
      }
      
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-600 rounded-full shadow-lg mb-3">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Order</h1>
          <p className="text-gray-600 text-sm">Create a new order with client and item details</p>
        </div>

        <div className="space-y-4">
          {/* Order Information */}
          <FormSection title="Order Information" icon={ShoppingCart}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <FormField label="Order Type" required>
                <Select value={orderType} onValueChange={setOrderType}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select order type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fabric">Fabric Only</SelectItem>
                    <SelectItem value="fabric_stitching">Fabric + Stitching</SelectItem>
                    <SelectItem value="stitching">Stitching Only</SelectItem>
                    <SelectItem value="readymade">Readymade</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Priority">
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Expected Delivery Date">
                <Input
                  type="date"
                  value={expectedDeliveryDate}
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>

              <FormField label="Branch" required>
                <Select value={branchId} onValueChange={setBranchId}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branchesData?.branches?.filter(b => b._id && b._id.trim() !== '' && b.branchName).length > 0 ? (
                      branchesData.branches.filter(b => b._id && b._id.trim() !== '' && b.branchName).map((b) => (
                        <SelectItem key={b._id} value={b._id}>
                          {b.branchName} - {b.address}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-branches" disabled>
                        No branches available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </FormSection>

          {/* Client Information */}
          <FormSection title="Client Information" icon={User}>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label className="text-sm font-medium">Client Type:</Label>
                <Select
                  value={existingClient ? "existing" : "new"}
                  onValueChange={(v) => setExistingClient(v === "existing")}
                >
                  <SelectTrigger className="w-48 h-8 text-sm">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Client</SelectItem>
                    <SelectItem value="existing">Existing Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {existingClient ? (
                <FormField label="Select Client" required>
                  <Select
                    value={selectedClientId}
                    onValueChange={setSelectedClientId}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Choose existing client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientsData?.clients?.filter(c => c._id && c._id.trim() !== '' && c.name).length > 0 ? (
                        clientsData.clients.filter(c => c._id && c._id.trim() !== '' && c.name).map((c) => (
                          <SelectItem key={c._id} value={c._id}>
                            {c.name} - {c.mobile}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-clients" disabled>
                          No clients available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormField>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <FormField label="GSTIN">
                      <Input
                        placeholder="Enter GSTIN"
                        value={clientDetails.gstin}
                        onChange={(e) => setClientDetails({ ...clientDetails, gstin: e.target.value.toUpperCase() })}
                        className="h-8 text-sm"
                      />
                    </FormField>
                  </div>
                  <FormField label="Name" required>
                    <Input
                      placeholder="Client name"
                      value={clientDetails.name}
                      onChange={(e) =>
                        setClientDetails({ ...clientDetails, name: e.target.value })
                      }
                      className="h-8 text-sm"
                    />
                  </FormField>

                  <FormField label="Mobile" required>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">91</span>
                      <Input
                        placeholder="10-digit mobile"
                        value={clientDetails.mobile}
                        onChange={(e) => {
                          const digitsOnly = (e.target.value || "").replace(/\D/g, "").slice(0, 10);
                          setClientDetails({ ...clientDetails, mobile: digitsOnly });
                        }}
                        className="h-8 text-sm"
                      />
                    </div>
                  </FormField>

                  <FormField label="Email">
                    <Input
                      placeholder="Email address"
                      type="email"
                      value={clientDetails.email}
                      onChange={(e) =>
                        setClientDetails({ ...clientDetails, email: e.target.value })
                      }
                      className="h-8 text-sm"
                    />
                  </FormField>

                  <FormField label="Address" required>
                    <Input
                      placeholder="Complete address"
                      value={clientDetails.address}
                      onChange={(e) =>
                        setClientDetails({ ...clientDetails, address: e.target.value })
                      }
                      className="h-8 text-sm"
                    />
                  </FormField>

                  <FormField label="City" required>
                    <Input
                      placeholder="City"
                      value={clientDetails.city}
                      onChange={(e) =>
                        setClientDetails({ ...clientDetails, city: e.target.value })
                      }
                      className="h-8 text-sm"
                    />
                  </FormField>

                  <FormField label="State" required>
                    <Input
                      placeholder="State"
                      value={clientDetails.state}
                      onChange={(e) =>
                        setClientDetails({ ...clientDetails, state: e.target.value })
                      }
                      className="h-8 text-sm"
                    />
                  </FormField>

                  <FormField label="Pincode" required>
                    <Input
                      placeholder="Pincode"
                      value={clientDetails.pincode}
                      onChange={(e) =>
                        setClientDetails({ ...clientDetails, pincode: e.target.value })
                      }
                      className="h-8 text-sm"
                    />
                  </FormField>
                </div>
              )}
            </div>
          </FormSection>


          {/* Order Items */}
          <FormSection title="Order Items" icon={Package}>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">
                      Item {index + 1}
                    </h4>
                    {items.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700 h-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  <FormField label="Client Order Number">
                <Input
                  placeholder="Client's Order Number"
                  value={item.clientOrderNumber || ""}
                  onChange={e => handleItemChange(index, "clientOrderNumber", e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>
                    {orderType !== "fabric" && (
                    <FormField label="Item Type" required>
                      <Select
                        value={item.itemType}
                        onValueChange={(v) => handleItemChange(index, "itemType", v)}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select item type" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemData?.items?.filter(i => i._id && i._id.trim() !== '' && i.name).length > 0 ? (
                            itemData.items.filter(i => i._id && i._id.trim() !== '' && i.name).map((i) => (
                              <SelectItem key={i._id} value={i._id}>
                                {i.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-items" disabled>
                              No items available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </FormField>
                    )}

                    {orderType !== "fabric" && (
                      <FormField label="Quantity" required>
                        <Input
                          type="number"
                          min={1}
                          placeholder="Quantity"
                          value={item.quantity || 1}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
                          }
                          className="h-8 text-sm"
                        />
                      </FormField>
                    )}

                    {orderType !== "fabric" && (
                    <FormField label="Style">
                      <Select
                        value={item.style}
                        onValueChange={(v) => handleItemChange(index, "style", v)}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemData?.items?.find((i) => i._id === item.itemType)?.styles?.filter(s => s.styleId && s.styleId.trim() !== '' && s.styleName).length > 0 ? (
                            itemData.items.find((i) => i._id === item.itemType).styles
                              .filter(s => s.styleId && s.styleId.trim() !== '' && s.styleName) // Filter out empty styleIds and styleNames
                              .map((s) => (
                                <SelectItem key={s.styleId} value={s.styleId}>
                                  {s.styleName}
                                </SelectItem>
                              ))
                          ) : (
                            <SelectItem value="no-styles" disabled>
                              No styles available for this item
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </FormField>
                    )}

                    {(orderType === "fabric" || orderType === "fabric_stitching") && (
                      <FormField label="Fabric">
                        <Select
                          value={item.fabric}
                          onValueChange={(v) => handleItemChange(index, "fabric", v)}
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Select fabric" />
                          </SelectTrigger>
                          <SelectContent>
                            {fabricsData?.fabrics?.filter(f => f._id && f._id.trim() !== '' && f.name).length > 0 ? (
                              fabricsData.fabrics.filter(f => f._id && f._id.trim() !== '' && f.name).map((f) => (
                                <SelectItem key={f._id} value={f._id}>
                                  {f.name} - ₹{f.pricePerMeter}/m
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-fabrics" disabled>
                                No fabrics available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </FormField>
                    )}

                    {(orderType === "fabric" || orderType === "fabric_stitching") && (
                      <FormField label={`Fabric Meters ${item.fabric ? "*" : ""}`}>
                        <Input
                          type="number"
                          min={0.01}
                          step={0.01}
                          placeholder="Enter meters"
                          value={item.fabricMeters || ""}
                          onChange={(e) =>
                            handleItemChange(index, "fabricMeters", e.target.value)
                          }
                          className="h-8 text-sm"
                          disabled={!item.fabric}
                        />
                      </FormField>
                    )}

                    <FormField label="Design Number">
                      <Input
                        placeholder="Design number"
                        value={item.designNumber || ""}
                        onChange={(e) =>
                          handleItemChange(index, "designNumber", e.target.value)
                        }
                        className="h-8 text-sm"
                      />
                    </FormField>
                  </div>

                  {/* Additional Charges */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <FormField label="Alteration (₹)">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={item.alteration || 0}
                        onChange={(e) =>
                          handleItemChange(index, "alteration", e.target.value)
                        }
                        className="h-8 text-sm"
                      />
                    </FormField>

                    <FormField label="Handwork (₹)">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={item.handwork || 0}
                        onChange={(e) =>
                          handleItemChange(index, "handwork", e.target.value)
                        }
                        className="h-8 text-sm"
                      />
                    </FormField>

                    <FormField label="Other Charges (₹)">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={item.otherCharges || 0}
                        onChange={(e) =>
                          handleItemChange(index, "otherCharges", e.target.value)
                        }
                        className="h-8 text-sm"
                      />
                    </FormField>
                  </div>

                  {/* Measurements */}
                  {orderType !== "fabric" && (
                    <div className="mb-3">
                      <Button variant="outline" type="button" size="sm" onClick={() => toggleShowMeasurements(index)}>
                        {showMeasurementIdxs.includes(index) ? "Hide" : "Add"} Measurement
                      </Button>
                    </div>
                  )}
                  {/* Measurements shown only if toggled */}
                  {orderType !== "fabric" && showMeasurementIdxs.includes(index) && itemData?.items?.find((i) => i._id === item.itemType)?.fields && (
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
                              onChange={(e) =>
                                handleMeasurementChange(index, field, e.target.value)
                              }
                              className="h-8 text-sm"
                            />
                          ))}
                      </div>
                    </div>
                  )}

                  <FormField label="Description">
                    <Input
                      placeholder="Additional notes"
                      value={item.description || ""}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      className="h-8 text-sm"
                    />
                  </FormField>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="w-full h-8"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Another Item
              </Button>
            </div>
          </FormSection>

          {/* Additional Information */}
          <FormSection title="Additional Information" icon={Calendar}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField label="Notes">
                <Input
                  placeholder="Order notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>

              <FormField label="Special Instructions">
                <Input
                  placeholder="Special instructions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>
              <FormField label="Discount Narration">
                <Input
                  placeholder="Narration for discount (optional)"
                  value={discountNarration}
                  onChange={(e) => setDiscountNarration(e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>
            </div>
          </FormSection>

          {/* Shipping Details - to match Update Order */}
          <FormSection title="Shipping Details" icon={MapPin}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <FormField label="Shipping Address">
                <Input
                  placeholder="Enter shipping address"
                  value={shippingDetails.shippingAddress}
                  onChange={(e) => handleShippingChange("shippingAddress", e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>
              <FormField label="City">
                <Input
                  placeholder="City"
                  value={shippingDetails.shippingCity}
                  onChange={(e) => handleShippingChange("shippingCity", e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>
              <FormField label="State">
                <Input
                  placeholder="State"
                  value={shippingDetails.shippingState}
                  onChange={(e) => handleShippingChange("shippingState", e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>
              <FormField label="Pincode">
                <Input
                  placeholder="Pincode"
                  value={shippingDetails.shippingPincode}
                  onChange={(e) => handleShippingChange("shippingPincode", e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>
              <FormField label="Phone">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">+91</span>
                  <Input
                    placeholder="10-digit phone"
                    value={shippingDetails.shippingPhone}
                    onChange={(e) => {
                      const digitsOnly = (e.target.value || "").replace(/\D/g, "").slice(0, 10);
                      handleShippingChange("shippingPhone", digitsOnly);
                    }}
                    className="h-8 text-sm"
                  />
                </div>
              </FormField>
              <FormField label="Shipping Method">
                <Select value={shippingDetails.shippingMethod} onValueChange={(v) => handleShippingChange("shippingMethod", v)}>
                  <SelectTrigger className="h-8 text-sm">
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
              </FormField>
              <FormField label="Shipping Cost (₹)">
                <Input
                  type="number"
                  placeholder="0"
                  value={shippingDetails.shippingCost}
                  onChange={(e) => handleShippingChange("shippingCost", e.target.value)}
                  className="h-8 text-sm"
                  min="0"
                  step="0.01"
                />
              </FormField>
              
              {/* Dynamic extra fields based on shipping method */}
              {shippingDetails.extraField1Label && (
                <FormField label={shippingDetails.extraField1Label}>
                  <Input
                    type="text"
                    value={shippingDetails.extraField1Value}
                    onChange={(e) =>
                      handleShippingChange("extraField1Value", e.target.value)
                    }
                    className="h-8 text-sm"
                  />
                </FormField>
              )}
              {shippingDetails.extraField2Label && (
                <FormField label={shippingDetails.extraField2Label}>
                  <Input
                    type="text"
                    value={shippingDetails.extraField2Value}
                    onChange={(e) =>
                      handleShippingChange("extraField2Value", e.target.value)
                    }
                    className="h-8 text-sm"
                  />
                </FormField>
              )}
              
              <FormField label="Delivery Person">
                <Input
                  placeholder="Delivery person"
                  value={shippingDetails.deliveryPerson}
                  onChange={(e) => handleShippingChange("deliveryPerson", e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>
              <FormField label="Delivery Person Contact">
                <Input
                  placeholder="Contact number"
                  value={shippingDetails.deliveryPersonContact}
                  onChange={(e) => handleShippingChange("deliveryPersonContact", e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>
              <FormField label="Delivery Status">
                <Select value={shippingDetails.deliveryStatus} onValueChange={(v) => handleShippingChange("deliveryStatus", v)}>
                  <SelectTrigger className="h-8 text-sm">
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
              </FormField>
              <FormField label="Delivery Notes">
                <Input
                  placeholder="Delivery notes"
                  value={shippingDetails.deliveryNotes}
                  onChange={(e) => handleShippingChange("deliveryNotes", e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>
            </div>
          </FormSection>
        </div>

        {/* Pricing Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6 mb-6">
          <FormSection title="Pricing & Discount" icon={Package}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Client Order Number */}
             
            

              <FormField label="Discount Type">
                <Select value={discountType} onValueChange={setDiscountType}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Discount Value">
                <Input
                  type="number"
                  placeholder={discountType === "percentage" ? "0" : "0"}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="h-8 text-sm"
                  min="0"
                  step={discountType === "percentage" ? "0.01" : "1"}
                />
              </FormField>

              <div className="md:col-span-2 -mt-2">
                <p className="text-xs text-gray-500">Add discount promo code if applicable or any reference name</p>
              </div>

              <FormField label="Promo Code">
                <Input
                  placeholder="Enter promo code (optional)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>

              <FormField label="Reference Name">
                <Input
                  placeholder="Reference person/name (optional)"
                  value={referenceName}
                  onChange={(e) => setReferenceName(e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>

              <FormField label="GST Rate (%)" required>
                <Input
                  type="number"
                  placeholder="18"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="h-8 text-sm"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </FormField>

              <FormField label="Advance Payment (₹)">
                <Input
                  type="number"
                  placeholder="0"
                  value={advancePayment}
                  onChange={(e) => setAdvancePayment(e.target.value)}
                  className="h-8 text-sm"
                  min="0"
                  step="0.01"
                />
              </FormField>

              <FormField label="Payment Method">
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="h-8 text-sm">
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
              </FormField>

   {/* Payment Status */}
   <FormField label="Payment Status" required>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
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
              </FormField>

              <FormField label="Payment Notes">
                <Input
                  placeholder="Payment notes (optional)"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="h-8 text-sm"
                />
              </FormField>
            </div>
          </FormSection>

          {/* Order Total Display */}
          <FormSection title="Order Summary" icon={ShoppingCart}>
            <div className={`rounded-lg p-4 border ${
              orderTotal.totalAmount > 0 
                ? 'bg-orange-50 border-orange-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              {orderTotal.totalAmount === 0 ? (
                <div className="text-center py-6">
                  <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Add items to see order total</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Detailed Item Breakdown */}
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
                          
                          {/* Item Cost Breakdown */}
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
                            
                            {/* Unit Price Summary */}
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
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
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
                            Discount ({discountType === 'percentage' ? `${discountValue}%` : 'Fixed'}):
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
                        <span className="text-sm font-medium text-gray-600">GST ({taxRate}%):</span>
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

                      {/* Payment Information */}
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
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col">
            {orderTotal.totalAmount > 0 && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">
                  {orderTotal.advanceAmount > 0 ? "Balance Amount: " : "Order Total: "}
                </span>
                <span className="text-lg font-bold text-orange-600">
                  {formatCurrency(orderTotal.advanceAmount > 0 ? orderTotal.balanceAmount : orderTotal.totalAmount)}
                </span>
                {orderTotal.advanceAmount > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Total: {formatCurrency(orderTotal.totalAmount)} | 
                    Advance: {formatCurrency(orderTotal.advanceAmount)}
                  </div>
                )}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {orderTotal.totalAmount === 0 
                ? "Add items and complete the form to create order"
                : "Review the order details before submitting"
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={() => navigate("/employee/pending-client-orders")}
              className="h-10 px-6 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md shadow-sm transition-colors text-sm"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isCreatingOrder || isCreatingClient || orderTotal.totalAmount <= 0}
              className={`h-10 px-8 font-medium rounded-md shadow-sm transition-colors text-sm ${
                orderTotal.totalAmount > 0
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isCreatingOrder || isCreatingClient ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Order...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Create Order
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    
    {/* Invoice PDF Viewer Modal */}
    {showInvoiceViewer && invoiceData && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Invoice Preview</h3>
            <div className="flex gap-2">
              {invoiceData?.pdfUrl && (
                <>
                  <Button
                    onClick={() => {
                      // Open PDF in new tab using the raw URL
                      window.open(invoiceData.pdfUrl, '_blank');
                    }}
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Download PDF
                  </Button>
                  <Button
                    onClick={() => {
                      // Show PDF in iframe modal
                      setShowPDFModal(true);
                    }}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    View PDF
                  </Button>
                </>
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
            <PDFViewer 
              className="w-full h-full"
            >
              <InvoiceDocument {...invoiceData} />
            </PDFViewer>
          </div>
        </div>
      </div>
    )}

    {/* PDF Modal with iframe */}
    {showPDFModal && invoiceData?.pdfUrl && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">PDF Viewer</h3>
            <Button
              onClick={() => setShowPDFModal(false)}
              variant="outline"
            >
              Close
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <iframe
              src={invoiceData.pdfUrl}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title="Invoice PDF"
            />
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default CreateOrder;
