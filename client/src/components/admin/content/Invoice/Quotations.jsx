import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Send, IndianRupee, Search } from "lucide-react";
import toast from "react-hot-toast";
import {
  useCreateQuotationMutation,
  useGetAllInvoicesQuery,
  useUpdateQuotationStatusMutation,
} from "@/features/api/invoiceApi";
import { useGetAllClientsQuery } from "@/features/api/clientApi";
import { useGetAllItemMastersQuery } from "@/features/api/itemApi";

const blankItem = {
  itemType: "",
  description: "",
  quantity: 1,
  fabricMeters: 0,
  fabricRate: 0,
  stitchingRate: 0,
};

const Quotations = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [remarks, setRemarks] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [gstPercentage, setGstPercentage] = useState(18);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [sentVia, setSentVia] = useState("manual");
  const [items, setItems] = useState([{ ...blankItem }]);

  const { data: clientsData } = useGetAllClientsQuery({ page: 1, limit: 1000, search: "" });
  const { data: itemMastersData } = useGetAllItemMastersQuery({ page: 1, limit: 1000, search: "", category: "" });
  const { data: quotationsData, refetch, isLoading } = useGetAllInvoicesQuery({
    page: 1,
    limit: 100,
    search: searchQuery,
    status: "all",
    invoiceType: "all",
    documentType: "quotation",
  });

  const [createQuotation, { isLoading: creating }] = useCreateQuotationMutation();
  const [updateQuotationStatus, { isLoading: updatingStatus }] = useUpdateQuotationStatusMutation();

  const customers = clientsData?.clients || [];
  const itemMasters = itemMastersData?.items || [];
  const quotations = quotationsData?.invoices || [];
  const selectedCustomer = customers.find((c) => c._id === customerId);
  const selectedCustomerPhone = selectedCustomer?.mobile || "";

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const qty = Number(item.quantity || 0);
      const fm = Number(item.fabricMeters || 0);
      const fr = Number(item.fabricRate || 0);
      const sr = Number(item.stitchingRate || 0);
      return sum + fm * fr + qty * sr;
    }, 0);
    const gstAmount = (subtotal * Number(gstPercentage || 0)) / 100;
    const discountAmount = (subtotal * Number(discountPercentage || 0)) / 100;
    const total = subtotal + gstAmount - discountAmount;
    return { subtotal, gstAmount, discountAmount, total };
  }, [items, gstPercentage, discountPercentage]);

  const updateItem = (index, key, value) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };
  const handleItemTypeChange = (index, itemTypeId) => {
    const selectedItemMaster = itemMasters.find((item) => item._id === itemTypeId);
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              itemType: itemTypeId,
              description: item.description || selectedItemMaster?.name || "",
              stitchingRate: Number(selectedItemMaster?.stitchingCharge || 0),
            }
          : item
      )
    );
  };

  const addItem = () => setItems((prev) => [...prev, { ...blankItem }]);

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const normalizePhoneForWhatsapp = (phone) => {
    const digits = String(phone || "").replace(/\D/g, "");
    if (!digits) return "";
    if (digits.length === 10) return `91${digits}`;
    if (digits.startsWith("0") && digits.length === 11) return `91${digits.slice(1)}`;
    return digits;
  };

  const buildWhatsappMessage = (quotation) => {
    const total = Number(quotation?.totalAmount || 0).toLocaleString("en-IN");
    const clientName = quotation?.customer?.name || selectedCustomer?.name || "Client";
    const ref = quotation?.quotationReference || quotation?.invoiceNumber || "Quotation";
    const valid = quotation?.validUntil
      ? new Date(quotation.validUntil).toLocaleDateString("en-IN")
      : "-";

    return [
      `Hello ${clientName},`,
      ``,
      `Your quotation is ready from JMD Stitching.`,
      `Reference: ${ref}`,
      `Total Amount: INR ${total}`,
      `Valid Until: ${valid}`,
      ``,
      `Thank you.`,
      `JMD Stitching`,
    ].join("\n");
  };

  const handleCreateQuotation = async (mode = "save") => {
    if (!customerId || !dueDate) {
      toast.error("Customer and due date are required.");
      return;
    }

    const payload = {
      customerId,
      dueDate,
      validUntil: validUntil || dueDate,
      gstPercentage: Number(gstPercentage || 0),
      discountPercentage: Number(discountPercentage || 0),
      remarks,
      termsAndConditions,
      sentVia: mode === "whatsapp" ? "whatsapp" : sentVia,
      items: items.map((item, idx) => ({
        itemCode: `QT-${idx + 1}`,
        itemType: item.itemType || undefined,
        description: item.description,
        quantity: Number(item.quantity || 1),
        fabricMeters: Number(item.fabricMeters || 0),
        fabricRate: Number(item.fabricRate || 0),
        stitchingRate: Number(item.stitchingRate || 0),
      })),
    };

    try {
      const response = await createQuotation(payload).unwrap();
      toast.success("Quotation created successfully.");
      setCustomerId("");
      setDueDate("");
      setValidUntil("");
      setItems([{ ...blankItem }]);
      setRemarks("");
      setTermsAndConditions("");
      setSentVia("manual");
      setGstPercentage(18);
      setDiscountPercentage(0);
      setIsCreateOpen(false);
      refetch();

      if (mode === "whatsapp") {
        const phone = normalizePhoneForWhatsapp(
          response?.quotation?.customer?.mobile || selectedCustomerPhone
        );
        if (!phone) {
          toast.error("Client phone number is missing. Quotation saved, but WhatsApp was not opened.");
          return;
        }
        const text = buildWhatsappMessage(response?.quotation);
        const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
        window.open(waUrl, "_blank");
        toast.success("Quotation saved and WhatsApp opened.");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create quotation.");
    }
  };

  const handleStatusChange = async (invoiceId, quotationStatus) => {
    try {
      await updateQuotationStatus({
        invoiceId,
        quotationData: { quotationStatus },
      }).unwrap();
      toast.success("Quotation status updated.");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update status.");
    }
  };

  return (
    <>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
            <p className="text-sm text-gray-600">Create, store and track quotation status</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Create Quotation</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Quotation</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Client *</p>
                    <Select value={customerId} onValueChange={setCustomerId}>
                      <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                      <SelectContent>
                        {customers.map((c) => (
                          <SelectItem key={c._id} value={c._id}>{c.name} ({c.mobile})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Phone Number</p>
                    <Input value={selectedCustomerPhone} readOnly placeholder="Client phone will appear here" />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Send Via</p>
                    <Select value={sentVia} onValueChange={setSentVia}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Due Date *</p>
                    <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Valid Until</p>
                    <Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">GST %</p>
                    <Input type="number" value={gstPercentage} onChange={(e) => setGstPercentage(e.target.value)} />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Discount %</p>
                    <Input type="number" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} />
                  </div>
                </div>

                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Quotation Items</h3>
                      <Button size="sm" variant="outline" onClick={addItem}>
                        <Plus className="w-4 h-4 mr-1" /> Add Item
                      </Button>
                    </div>
                    {items.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 border p-3 rounded-lg bg-white">
                        <div className="md:col-span-4 space-y-1">
                          <Select value={item.itemType || ""} onValueChange={(value) => handleItemTypeChange(index, value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select item from Item Master" />
                            </SelectTrigger>
                            <SelectContent>
                              {itemMasters.map((master) => (
                                <SelectItem key={master._id} value={master._id}>
                                  {master.name} (₹{master.stitchingCharge || 0})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Item description"
                            value={item.description}
                            onChange={(e) => updateItem(index, "description", e.target.value)}
                          />
                        </div>
                        <Input className="md:col-span-1" type="number" min={1} placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(index, "quantity", e.target.value)} />
                        <Input className="md:col-span-2" type="number" min={0} placeholder="Fabric m" value={item.fabricMeters} onChange={(e) => updateItem(index, "fabricMeters", e.target.value)} />
                        <Input className="md:col-span-2" type="number" min={0} placeholder="Fabric rate" value={item.fabricRate} onChange={(e) => updateItem(index, "fabricRate", e.target.value)} />
                        <Input className="md:col-span-2" type="number" min={0} placeholder="Stitching rate" value={item.stitchingRate} onChange={(e) => updateItem(index, "stitchingRate", e.target.value)} />
                        <Button className="md:col-span-1" variant="ghost" onClick={() => removeItem(index)}>X</Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Textarea placeholder="Remarks to include in quotation..." value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                  <Textarea placeholder="Terms and conditions..." value={termsAndConditions} onChange={(e) => setTermsAndConditions(e.target.value)} />
                </div>

                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><p className="text-gray-500">Subtotal</p><p className="font-semibold">₹{totals.subtotal.toLocaleString("en-IN")}</p></div>
                      <div><p className="text-gray-500">GST</p><p className="font-semibold">₹{totals.gstAmount.toLocaleString("en-IN")}</p></div>
                      <div><p className="text-gray-500">Discount</p><p className="font-semibold">-₹{totals.discountAmount.toLocaleString("en-IN")}</p></div>
                      <div><p className="text-gray-500">Total</p><p className="font-bold text-lg">₹{totals.total.toLocaleString("en-IN")}</p></div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => handleCreateQuotation("save")} disabled={creating}>
                    <Send className="w-4 h-4 mr-2" />
                    {creating ? "Saving..." : "Save Quotation"}
                  </Button>
                  <Button
                    onClick={() => handleCreateQuotation("whatsapp")}
                    disabled={creating || !selectedCustomerPhone}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {creating ? "Saving..." : "Save & Send WhatsApp"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search quotation/customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="py-12 text-center text-gray-500">Loading quotations...</div>
          ) : quotations.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No quotations yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quotation #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Send Via</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Track Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.map((q) => (
                  <TableRow key={q._id}>
                    <TableCell className="font-medium">{q.quotationReference || q.invoiceNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{q.customer?.name || "Customer"}</p>
                        <p className="text-xs text-gray-500">{q.customer?.mobile || ""}</p>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{q.sentVia || "manual"}</TableCell>
                    <TableCell>{q.validUntil ? new Date(q.validUntil).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center">
                        <IndianRupee className="w-4 h-4 mr-1" />
                        {(q.totalAmount || 0).toLocaleString("en-IN")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{q.quotationStatus || "draft"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        disabled={updatingStatus}
                        value={q.quotationStatus || "draft"}
                        onValueChange={(value) => handleStatusChange(q._id, value)}
                      >
                        <SelectTrigger className="w-[140px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{new Date(q.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
    </>
  );
};

export default Quotations;
