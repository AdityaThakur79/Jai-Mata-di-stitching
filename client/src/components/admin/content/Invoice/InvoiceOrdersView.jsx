import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { PDFViewer } from "@react-pdf/renderer";
import InvoiceDocument from "@/utils/invoiceTemplate.jsx";
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
import {
  useGetAllInvoicesQuery,
  useLazyGetInvoicePreviewDataQuery,
  useGenerateInvoicePDFMutation,
} from "@/features/api/invoiceApi";

const getPaymentBadgeClass = (status) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "partial":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getSourceBadgeClass = (source) =>
  source === "client" ? "bg-purple-100 text-purple-800" : "bg-teal-100 text-teal-800";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount || 0);

const formatInvoiceDateTime = (invoice) =>
  new Date(invoice.billDate || invoice.createdAt).toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const getInvoiceOrderNumber = (invoice) =>
  invoice.clientOrder?.orderNumber || invoice.pendingOrder?.tokenNumber || invoice.invoiceNumber;

const getInvoiceParty = (invoice) => {
  const source = invoice.orderSource || (invoice.clientOrder ? "client" : invoice.pendingOrder ? "customer" : null);
  if (source === "client") {
    return {
      name: invoice.client?.name || invoice.clientOrder?.clientDetails?.name || "—",
      mobile: invoice.client?.mobile || invoice.clientOrder?.clientDetails?.mobile || "",
    };
  }
  return {
    name: invoice.customer?.name || "—",
    mobile: invoice.customer?.mobile || "",
  };
};

const getInvoiceSource = (invoice) => {
  if (invoice.orderSource) return invoice.orderSource;
  if (invoice.clientOrder) return "client";
  if (invoice.pendingOrder) return "customer";
  return "customer";
};

const getInvoiceSourceLabel = (source) =>
  source === "client" ? "Client Invoice" : "Customer Invoice";

const InvoiceOrdersView = ({
  title,
  subtitle,
  fixedOrderType = null,
  fixedOrderSource = null,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [orderSourceFilter, setOrderSourceFilter] = useState(fixedOrderSource || "all");
  const [orderTypeFilter, setOrderTypeFilter] = useState(fixedOrderType || "all");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [showInvoiceViewer, setShowInvoiceViewer] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [loadingInvoiceId, setLoadingInvoiceId] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [getInvoicePreview] = useLazyGetInvoicePreviewDataQuery();
  const [generateInvoicePDF, { isLoading: isDownloadingPDF }] = useGenerateInvoicePDFMutation();

  const { data, isLoading, isFetching, refetch } = useGetAllInvoicesQuery({
    page,
    limit,
    paymentStatus: paymentFilter === "all" ? undefined : paymentFilter,
    orderSource: fixedOrderSource || orderSourceFilter === "all" ? undefined : orderSourceFilter,
    orderType: fixedOrderType || orderTypeFilter === "all" ? (fixedOrderType || undefined) : orderTypeFilter,
    search: searchQuery || undefined,
    documentType: "invoice",
  });

  const invoices = data?.invoices || [];
  const stats = data?.stats || {};
  const totalPages = data?.totalPage || 1;

  const handleViewBill = async (invoiceId) => {
    try {
      setLoadingInvoiceId(invoiceId);
      const result = await getInvoicePreview(invoiceId).unwrap();
      if (result?.success && result?.invoiceData) {
        setInvoiceData(result.invoiceData);
        setShowInvoiceViewer(true);
      } else {
        toast.error("Failed to load invoice data");
      }
    } catch (error) {
      console.error("Error loading invoice:", error);
      toast.error("Error loading invoice");
    } finally {
      setLoadingInvoiceId(null);
    }
  };

  const closeInvoiceViewer = () => {
    setShowInvoiceViewer(false);
    setInvoiceData(null);
    setShowPDFModal(false);
  };

  return (
    <>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 text-sm">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card><CardContent className="p-5"><p className="text-sm text-gray-500">Total Invoices</p><p className="text-2xl font-bold">{stats.totalInvoices ?? data?.total ?? 0}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-gray-500">Total Revenue</p><p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-gray-500">Paid Invoices</p><p className="text-2xl font-bold">{stats.paidCount ?? 0}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-gray-500">Pending Payment</p><p className="text-2xl font-bold">{stats.pendingCount ?? 0}</p></CardContent></Card>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search invoices, orders, clients..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10 h-9"
              />
            </div>

            <Select value={paymentFilter} onValueChange={(v) => { setPaymentFilter(v); setPage(1); }}>
              <SelectTrigger className="h-9"><SelectValue placeholder="Payment Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>

            {!fixedOrderSource ? (
              <Select value={orderSourceFilter} onValueChange={(v) => { setOrderSourceFilter(v); setPage(1); }}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Invoice Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Invoices</SelectItem>
                  <SelectItem value="client">Client Invoice</SelectItem>
                  <SelectItem value="customer">Customer Invoice (Slip for Billing)</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="h-9 rounded-md border px-3 flex items-center text-sm bg-gray-50">
                {fixedOrderSource === "client" ? "Client Invoice" : "Customer Invoice (Slip for Billing)"}
              </div>
            )}

            {!fixedOrderType ? (
              <Select value={orderTypeFilter} onValueChange={(v) => { setOrderTypeFilter(v); setPage(1); }}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Order Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
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
              <Button variant="outline" className="h-9" onClick={() => refetch()} disabled={isFetching}>
                <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              </Button>
              <Button
                variant="outline"
                className="h-9"
                onClick={() => {
                  setSearchQuery("");
                  setPaymentFilter("all");
                  if (!fixedOrderSource) setOrderSourceFilter("all");
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
          ) : invoices.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No invoices found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Order #</TableHead>
                  <TableHead>Client / Customer</TableHead>
                  <TableHead>Invoice Type</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => {
                  const party = getInvoiceParty(invoice);
                  const source = getInvoiceSource(invoice);
                  return (
                    <TableRow key={invoice._id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{getInvoiceOrderNumber(invoice)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{party.name}</p>
                          <p className="text-xs text-gray-500">{party.mobile}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`capitalize ${getSourceBadgeClass(source)}`}>
                          {getInvoiceSourceLabel(source)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {(invoice.orderType || invoice.invoiceType || "mixed").replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                      <TableCell>
                        <Badge className={`capitalize ${getPaymentBadgeClass(invoice.paymentStatus)}`}>
                          {invoice.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatInvoiceDateTime(invoice)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewBill(invoice._id)}
                          disabled={loadingInvoiceId === invoice._id}
                        >
                          {loadingInvoiceId === invoice._id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            "View Bill"
                          )}
                        </Button>
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
            <p className="text-sm text-gray-600">Showing {invoices.length} of {data?.total || 0} invoices</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span className="text-sm px-2 py-1">Page {page} of {totalPages}</span>
              <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}

        {showInvoiceViewer && invoiceData && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeInvoiceViewer}
          >
            <div
              className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Invoice Preview</h3>
                <div className="flex gap-2">
                  {invoiceData?.pdfUrl ? (
                    <>
                      <Button
                        onClick={() => window.open(invoiceData.pdfUrl, "_blank")}
                        variant="default"
                        className="bg-orange-600 hover:bg-orange-700 text-white"
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
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        const activeInvoice = invoices.find((inv) => inv.invoiceNumber === invoiceData.invoiceNumber);
                        if (activeInvoice?._id) generateInvoicePDF(activeInvoice._id);
                      }}
                      variant="default"
                      disabled={isDownloadingPDF}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      {isDownloadingPDF ? "Downloading..." : "Download PDF"}
                    </Button>
                  )}
                  <Button onClick={closeInvoiceViewer} variant="outline">
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

        {showPDFModal && invoiceData?.pdfUrl && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPDFModal(false)}
          >
            <div
              className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">PDF Viewer</h3>
                <Button onClick={() => setShowPDFModal(false)} variant="outline">
                  Close
                </Button>
              </div>
              <div className="flex-1 overflow-hidden">
                <iframe
                  src={invoiceData.pdfUrl}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                  title="Invoice PDF"
                />
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default InvoiceOrdersView;
