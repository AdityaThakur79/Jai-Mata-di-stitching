import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  useGetTailorSlipStatsQuery,
  useGetTailorSlipsQuery,
  usePrintTailorSlipMutation,
} from "@/features/api/pendingOrderApi";
import { Printer, RefreshCw, Search, Package2 } from "lucide-react";

const statusLabel = {
  pending: "Pending",
  printed: "Printed",
  assigned: "Assigned",
  completed: "Completed",
  cancelled: "Cancelled",
};

const TailorSlipBoard = ({ statusFilter = "all", title = "Tailor Slips" }) => {
  const [search, setSearch] = useState("");
  const [page] = useState(1);
  const [limit] = useState(50);
  const { data, isLoading, refetch } = useGetTailorSlipsQuery({
    page,
    limit,
    search,
    status: statusFilter,
  });
  const { data: statsData } = useGetTailorSlipStatsQuery();
  const [printTailorSlip, { isLoading: isPrinting }] = usePrintTailorSlipMutation();

  const slips = useMemo(() => data?.slips || [], [data]);
  const { recentSlips, oldSlips } = useMemo(() => {
    if (statusFilter !== "pending") return { recentSlips: slips, oldSlips: [] };
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recent = [];
    const old = [];
    slips.forEach((slip) => {
      const createdAt = new Date(slip.createdAt).getTime();
      if (createdAt >= twentyFourHoursAgo) {
        recent.push(slip);
      } else {
        old.push(slip);
      }
    });
    return { recentSlips: recent, oldSlips: old };
  }, [slips, statusFilter]);

  const groupByOrder = (slipList = []) =>
    Object.values(
      slipList.reduce((acc, slip) => {
        const key = slip.tokenNumber || slip.order?._id || "NO_ORDER";
        if (!acc[key]) {
          acc[key] = {
            key,
            tokenNumber: slip.tokenNumber || "-",
            customerName: slip.customer?.name || slip.customerName || "-",
            slips: [],
          };
        }
        acc[key].slips.push(slip);
        return acc;
      }, {})
    );

  const recentGroups = useMemo(() => groupByOrder(recentSlips), [recentSlips]);
  const oldGroups = useMemo(() => groupByOrder(oldSlips), [oldSlips]);
  const allGroups = useMemo(() => groupByOrder(slips), [slips]);

  const handlePrint = async (slipId) => {
    try {
      const response = await printTailorSlip(slipId).unwrap();
      const { slip, barcodeImage, printMeta } = response;

      const iframe = document.createElement("iframe");
      iframe.setAttribute("aria-hidden", "true");
      Object.assign(iframe.style, {
        position: "fixed",
        left: "-9999px",
        top: "0",
        width: "210mm",
        height: "297mm",
        border: "0",
        visibility: "hidden",
      });
      document.body.appendChild(iframe);
      const printWindow = iframe.contentWindow;
      const printDocument = iframe.contentDocument;
      if (!printWindow || !printDocument) {
        iframe.remove();
        toast.error("Could not open print preview");
        return;
      }

      const measurementRows = Object.entries(slip.measurement || {})
        .map(([key, value]) => `<tr><td>${key}</td><td>${value}</td></tr>`)
        .join("");

      printDocument.write(`
        <html>
          <head>
            <title>${slip.slipNumber}</title>
            <style>
              * { box-sizing: border-box; }
              body {
                font-family: Arial, sans-serif;
                padding: 18px;
                color: #111827;
                margin: 0;
              }
              .slip {
                border: 2px solid #ea580c;
                border-radius: 10px;
                padding: 14px;
              }
              .top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px dashed #fb923c;
                padding-bottom: 10px;
                margin-bottom: 10px;
              }
              .brand {
                font-size: 28px;
                font-weight: 800;
                color: #c2410c;
                margin: 0;
              }
              .meta-small {
                font-size: 12px;
                color: #4b5563;
              }
              .dup {
                color: #b91c1c;
                font-size: 18px;
                font-weight: 800;
                margin: 4px 0 10px;
                border: 1px solid #fecaca;
                background: #fee2e2;
                border-radius: 6px;
                display: inline-block;
                padding: 4px 8px;
              }
              .meta {
                border: 1px solid #fed7aa;
                background: #fff7ed;
                border-radius: 8px;
                padding: 10px;
                margin-bottom: 12px;
                line-height: 1.5;
              }
              .meta p { margin: 0; }
              .barcode-wrap {
                border: 1px solid #d1d5db;
                border-radius: 8px;
                padding: 10px;
                margin-bottom: 12px;
                text-align: center;
                background: #ffffff;
              }
              .barcode-title {
                font-size: 13px;
                color: #374151;
                margin-bottom: 6px;
                font-weight: 600;
              }
              .barcode-number {
                margin-top: 6px;
                font-size: 14px;
                font-weight: 700;
                letter-spacing: 1px;
                color: #111827;
                border-top: 1px dashed #d1d5db;
                padding-top: 6px;
              }
              table { width: 100%; border-collapse: collapse; margin-top: 8px; }
              th {
                border: 1px solid #d1d5db;
                padding: 8px;
                text-align: left;
                background: #fff7ed;
              }
              td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
              h2 {
                margin: 0 0 8px;
                color: #c2410c;
                font-size: 22px;
              }
              img {
                max-width: 100%;
                height: auto;
                display: block;
                margin-left: auto;
                margin-right: auto;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .barcode-wrap {
                  break-inside: avoid;
                  page-break-inside: avoid;
                }
                img {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
              }
            </style>
          </head>
          <body>
            <div class="slip">
              <div class="top">
                <h1 class="brand">JMD Tailor Slip</h1>
                <div class="meta-small">
                  <div><strong>Date:</strong> ${new Date().toLocaleString("en-IN")}</div>
                  <div><strong>Slip #:</strong> ${slip.slipNumber}</div>
                </div>
              </div>
              ${printMeta?.isDuplicate ? '<div class="dup">DUPLICATE COPY</div>' : ""}
              <div class="meta">
                <p><strong>Token:</strong> ${slip.tokenNumber}</p>
                <p><strong>Item Code:</strong> ${slip.itemCode}</p>
                <p><strong>Customer:</strong> ${slip.customer?.name || slip.customerName || "-"}</p>
                <p><strong>Item:</strong> ${slip.itemType?.name || slip.itemTypeName || "-"}</p>
                <p><strong>Style:</strong> ${slip.style?.name || slip.styleName || "-"}</p>
                <p><strong>Qty:</strong> ${slip.quantity || 1}</p>
                <p><strong>Instruction:</strong> ${slip.specialInstructions || slip.notes || "-"}</p>
              </div>
              <div class="barcode-wrap">
                <div class="barcode-title">Scan this barcode to assign slip</div>
                <img id="slip-barcode" src="${barcodeImage}" alt="" />
                <div class="barcode-number">${slip.barcodeValue || slip.slipNumber}</div>
              </div>
              <h2>Measurements</h2>
              <table>
                <thead><tr><th>Field</th><th>Value</th></tr></thead>
                <tbody>${measurementRows || "<tr><td colspan='2'>No measurements</td></tr>"}</tbody>
              </table>
            </div>
          </body>
        </html>
      `);
      printDocument.close();

      const removeIframe = () => {
        iframe.remove();
      };

      const runPrint = () => {
        printWindow.focus();
        printWindow.print();
        toast.success(printMeta?.isDuplicate ? "Duplicate slip printed" : "Slip printed");
        refetch();
        printWindow.addEventListener("afterprint", removeIframe, { once: true });
        window.setTimeout(removeIframe, 90_000);
      };

      // Chrome print/PDF often drops data-URL images if print() runs before decode/layout finishes.
      const barcodeEl = printDocument.getElementById("slip-barcode");
      const afterImagesReady = () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.setTimeout(runPrint, 100);
          });
        });
      };

      if (barcodeEl && barcodeImage) {
        const whenReady = barcodeEl.decode
          ? barcodeEl.decode().catch(() => {})
          : Promise.resolve();
        whenReady.then(() => afterImagesReady()).catch(() => afterImagesReady());
      } else {
        afterImagesReady();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to print slip");
    }
  };

  const renderGroupedSlipBoxes = (groups) => (
    <div className="space-y-4">
      {groups.map((group) => (
        <Card key={group.key} className="border-orange-200 shadow-sm">
          <CardHeader className="bg-orange-50 border-b border-orange-100 py-3">
            <CardTitle className="text-base flex items-center justify-between text-orange-900">
              <span className="flex items-center gap-2">
                <Package2 className="w-4 h-4" />
                Order: {group.tokenNumber}
              </span>
              <span className="text-xs font-medium text-orange-700">
                {group.slips.length} slip{group.slips.length > 1 ? "s" : ""}
              </span>
            </CardTitle>
            <p className="text-xs text-orange-800">Customer: {group.customerName}</p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {group.slips.map((slip) => (
                <div key={slip._id} className="rounded-lg border border-orange-100 bg-white p-3">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-900">{slip.slipNumber}</p>
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                      {statusLabel[slip.status] || slip.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-gray-700">
                    <p><strong>Item:</strong> {slip.itemType?.name || slip.itemTypeName || "-"}</p>
                    <p><strong>Item Code:</strong> {slip.itemCode}</p>
                    <p><strong>Printed:</strong> {slip.printCount || 0} times</p>
                    {slip.scannedByName && <p><strong>Assigned To:</strong> {slip.scannedByName}</p>}
                  </div>
                  <Button
                    onClick={() => handlePrint(slip._id)}
                    disabled={isPrinting}
                    className="w-full mt-3 bg-orange-600 hover:bg-orange-700 text-white"
                    size="sm"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    {Number(slip.printCount || 0) > 0 ? "Reprint Slip" : "Print Slip"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-orange-700">{title}</h1>
          <p className="text-sm text-orange-900/70">Manage tailor pending and printed slips</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} className="border-orange-300 text-orange-700 hover:bg-orange-50">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-3"><p className="text-xs">Total</p><p className="text-xl font-semibold">{statsData?.stats?.total || 0}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-xs">Pending</p><p className="text-xl font-semibold">{statsData?.stats?.pending || 0}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-xs">Printed</p><p className="text-xl font-semibold">{statsData?.stats?.printed || 0}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-xs">Duplicate Prints</p><p className="text-xl font-semibold">{statsData?.stats?.duplicatePrints || 0}</p></CardContent></Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search slip/token/item code"
        />
      </div>

      <div className="space-y-5">
        {statusFilter === "pending" && (
          <div>
            <h2 className="text-sm font-semibold mb-2 text-orange-800">Last 24 Hours</h2>
            {renderGroupedSlipBoxes(recentGroups)}
          </div>
        )}

        {statusFilter === "pending" && (
          <div>
            <h2 className="text-sm font-semibold mb-2 text-orange-800">Older Pending Slips</h2>
            {renderGroupedSlipBoxes(oldGroups)}
          </div>
        )}

        {statusFilter !== "pending" && (
          <div>{renderGroupedSlipBoxes(allGroups)}</div>
        )}
        {isLoading && <p>Loading slips...</p>}
        {!isLoading && slips.length === 0 && <p>No slips available.</p>}
      </div>
    </div>
  );
};

export default TailorSlipBoard;
