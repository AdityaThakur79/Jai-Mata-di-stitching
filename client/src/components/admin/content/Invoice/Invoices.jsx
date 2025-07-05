import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  MoreHorizontal,
  Download,
  Eye,
  Edit,
  Trash2,
  FileText,
  DollarSign,
  Calendar,
  User,
  Receipt,
  Filter,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { useGetAllInvoicesQuery, useDeleteInvoiceMutation, useGenerateInvoicePDFMutation } from "@/features/api/invoiceApi";

const Invoices = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const { data, isLoading, refetch, error } = useGetAllInvoicesQuery({
    page,
    limit,
    search,
    status: statusFilter,
  }, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 0,  
  });

  // Debug logging
  console.log('Invoices data:', data?.invoices);
  console.log('Invoices loading:', isLoading);
  console.log('Invoices error:', error);
  
  // Simplified logic - show data if available, ignore loading state
  const hasData = data && data.invoices && data.invoices.length > 0;
  
  console.log('Has data:', hasData);
  console.log('Data received:', !!data);

  // Force refetch on mount
  useEffect(() => {
    console.log('Component mounted, forcing refetch...');
    refetch();
  }, []);

  // Test direct API call
//   useEffect(() => {
//     const testAPI = async () => {
//       try {
//         const response = await fetch('https://jai-mata-di-stitching.onrender.com/api/invoice/all?page=1&limit=10&status=all', {
//           credentials: 'include'
//         });
//         const result = await response.json();
//         console.log('Direct API call result:', result);
//       } catch (err) {
//         console.error('Direct API call error:', err);
//       }
//     };
//     testAPI();
//   }, []);

  // Cleanup PDF URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const [deleteInvoice] = useDeleteInvoiceMutation();
  const [generatePDF] = useGenerateInvoicePDFMutation();

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleDelete = async (invoiceId) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteInvoice(invoiceId).unwrap();
        toast.success("Invoice deleted successfully");
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete invoice");
      }
    }
  };

  const handleViewPDF = async (invoice) => {
    setSelectedInvoice(invoice);
    setIsPdfLoading(true);
    setPdfUrl(null);
    
    try {
      const response = await fetch(`https://jai-mata-di-stitching.onrender.com/api/invoice/${invoice._id}/pdf`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
      
      // Check if PDF was already generated and saved
      if (invoice.pdfUrl) {
        // Use the saved PDF URL directly
        const fullUrl = invoice.pdfUrl.startsWith('http') 
          ? invoice.pdfUrl 
          : `https://jai-mata-di-stitching.onrender.com${invoice.pdfUrl}`;
        console.log('Using saved PDF URL:', fullUrl);
        setPdfUrl(fullUrl);
      } else {
        // Generate new PDF and create blob URL
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        console.log('Created blob URL for PDF');
        setPdfUrl(url);
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error("Failed to generate PDF for viewing");
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleDownloadPDF = async (invoiceId) => {
    try {
      // First try to get the invoice to check if PDF already exists
      const invoiceResponse = await fetch(`https://jai-mata-di-stitching.onrender.com/api/invoice/${invoiceId}`, {
        credentials: 'include'
      });
      
      if (invoiceResponse.ok) {
        const invoiceData = await invoiceResponse.json();
        const invoice = invoiceData.invoice;
        
        if (invoice.pdfUrl) {
          // PDF already exists, download directly
          const downloadUrl = `https://jai-mata-di-stitching.onrender.com${invoice.pdfUrl}`;
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `invoice-${invoice.invoiceNumber}.pdf`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success("PDF downloaded successfully");
          return;
        }
      }
      
      // Generate new PDF if it doesn't exist
      const response = await fetch(`https://jai-mata-di-stitching.onrender.com/api/invoice/${invoiceId}/pdf`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error('PDF download error:', error);
      toast.error("Failed to download PDF");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { variant: "secondary", label: "Draft" },
      generated: { variant: "default", label: "Generated" },
      sent: { variant: "default", label: "Sent" },
      paid: { variant: "default", label: "Paid" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    };

    const config = statusConfig[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const paymentConfig = {
      pending: { variant: "destructive", label: "Pending" },
      partial: { variant: "default", label: "Partial" },
      paid: { variant: "default", label: "Paid" },
    };

    const config = paymentConfig[paymentStatus] || { variant: "secondary", label: paymentStatus };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Invoices
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and track all invoices
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/pending-orders")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Invoice
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                  <p className="text-2xl font-bold">{data?.total || 0}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      data?.invoices?.reduce((sum, inv) => sum + inv.totalAmount, 0) || 0
                    )}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
                  <p className="text-2xl font-bold">
                    {data?.invoices?.filter(inv => inv.paymentStatus === "paid").length || 0}
                  </p>
                </div>
                <Receipt className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Payment</p>
                  <p className="text-2xl font-bold">
                    {data?.invoices?.filter(inv => inv.paymentStatus === "pending").length || 0}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by invoice number or customer name..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="generated">Generated</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  console.log('Manual refresh clicked');
                  refetch();
                }}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {!data && isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <RefreshCw className="animate-spin w-8 h-8 mx-auto mb-4" />
                  <p>Loading invoices...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-600 mb-4">
                  <RefreshCw className="w-12 h-12 mx-auto mb-2" />
                  <p>Error loading invoices</p>
                  <p className="text-sm">{error?.data?.message || error?.message}</p>
                </div>
                <Button onClick={() => refetch()} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : !hasData ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No invoices found</p>
                {data && !data.invoices && (
                  <p className="text-sm text-gray-500 mt-2">
                    Data received but no invoices array found. Data structure: {JSON.stringify(Object.keys(data))}
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.invoices?.map((invoice) => (
                        <TableRow key={invoice._id}>
                          <TableCell className="font-medium">
                            {invoice.invoiceNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{invoice.customer?.name}</p>
                              <p className="text-sm text-gray-600">
                                {invoice.customer?.mobile}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {invoice.pendingOrder?.tokenNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {formatCurrency(invoice.totalAmount)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Paid: {formatCurrency(invoice.paidAmount)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(invoice.status)}
                          </TableCell>
                          <TableCell>
                            {getPaymentStatusBadge(invoice.paymentStatus)}
                          </TableCell>
                          <TableCell>
                            {formatDate(invoice.dueDate)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleViewPDF(invoice)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDownloadPDF(invoice._id)}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download PDF
                                </DropdownMenuItem>
                                {invoice.status === "draft" && (
                                  <DropdownMenuItem
                                    onClick={() => navigate(`/admin/invoices/${invoice._id}/edit`)}
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                )}
                                {invoice.status === "draft" && (
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(invoice._id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-600">
                      Showing {((page - 1) * limit) + 1} to{" "}
                      {Math.min(page * limit, data.total)} of {data.total} results
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {page} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* PDF Viewer Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="max-w-4xl h-[90vh] p-0">
      
          <div className="flex-1 overflow-hidden p-6">
            {isPdfLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <RefreshCw className="animate-spin w-6 h-6 mx-auto mb-3" />
                  <p className="text-sm">Generating PDF...</p>
                </div>
              </div>
            ) : pdfUrl ? (
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadPDF(selectedInvoice._id)}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(pdfUrl, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Open in New Tab
                  </Button>
                </div>
                <div className="flex-1 border rounded-lg overflow-hidden">
                  <iframe
                    src={pdfUrl}
                    className="w-full h-full border-0"
                    title="Invoice PDF"
                    onError={(e) => {
                      console.error('PDF iframe error:', e);
                      toast.error("Failed to load PDF in viewer");
                    }}
                    onLoad={() => {
                      console.log('PDF iframe loaded successfully');
                    }}
                  />
                </div>
                <div className="text-center mt-2 text-xs text-gray-500">
                  If the PDF doesn't display properly, use the "Open in New Tab" button above.
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 text-sm">PDF not available</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewPDF(selectedInvoice)}
                    className="mt-3"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invoices;