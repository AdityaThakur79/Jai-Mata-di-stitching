import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useGetTailorSlipsQuery,
  useScanTailorSlipMutation,
  useUpdatePendingOrderItemWorkMutation,
  useUpdateTailorSlipStatusMutation,
} from "@/features/api/pendingOrderApi";

const ScanTailorSlipPage = () => {
  const [barcodeValue, setBarcodeValue] = useState("");
  const [lastAssigned, setLastAssigned] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusDraft, setStatusDraft] = useState({});
  const [scanTailorSlip, { isLoading }] = useScanTailorSlipMutation();
  const [updatePendingOrderItemWork, { isLoading: isUpdatingItemStatus }] = useUpdatePendingOrderItemWorkMutation();
  const [updateTailorSlipStatus, { isLoading: isUpdatingStatus }] = useUpdateTailorSlipStatusMutation();
  const { data, isLoading: isTableLoading, refetch } = useGetTailorSlipsQuery({
    page,
    limit,
    search,
    status: "all",
    scannedOnly: true,
  });
  const inputRef = useRef(null);

  const performScan = async () => {
    const value = barcodeValue.trim();
    if (!value) return;

    try {
      const response = await scanTailorSlip(value).unwrap();
      setLastAssigned(response);
      toast.success("Slip assigned successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to assign slip");
    } finally {
      setBarcodeValue("");
      inputRef.current?.focus();
      refetch();
    }
  };

  const handleScan = async (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    await performScan();
  };

  const handleStatusSave = async (slip) => {
    const nextItemStatus = statusDraft[slip._id] || mapSlipStatusToItemStatus(slip.status);
    try {
      if (slip.pendingOrder && slip.itemCode) {
        await updatePendingOrderItemWork({
          orderId: slip.pendingOrder,
          itemCode: slip.itemCode,
          payload: { itemStatus: nextItemStatus },
        }).unwrap();
      }

      await updateTailorSlipStatus({
        slipId: slip._id,
        status: mapItemStatusToSlipStatus(nextItemStatus),
      }).unwrap();

      toast.success("Employee work status updated");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update slip status");
    }
  };

  const mapSlipStatusToItemStatus = (slipStatus) => {
    if (slipStatus === "completed") return "ready";
    if (slipStatus === "assigned") return "in_progress";
    if (slipStatus === "pending") return "pending";
    if (slipStatus === "cancelled") return "pending";
    return "in_progress";
  };

  const mapItemStatusToSlipStatus = (itemStatus) => {
    if (itemStatus === "ready") return "completed";
    if (itemStatus === "partial_ready" || itemStatus === "in_progress") return "assigned";
    return "pending";
  };

  const slips = data?.slips || [];
  const total = Number(data?.total || 0);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Scan Tailor Slip</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col md:flex-row gap-2">
            <Input
              ref={inputRef}
              value={barcodeValue}
              onChange={(e) => setBarcodeValue(e.target.value)}
              onKeyDown={handleScan}
              placeholder="Scan barcode or type manually"
              disabled={isLoading}
              autoFocus
            />
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white"
              disabled={isLoading || !barcodeValue.trim()}
              onClick={performScan}
            >
              Scan Now
            </Button>
          </div>
          <Button variant="outline" disabled={isLoading} onClick={() => inputRef.current?.focus()}>
            Focus Scanner Input
          </Button>
        </CardContent>
      </Card>

      {lastAssigned?.slip && (
        <Card>
          <CardHeader>
            <CardTitle>Last Assignment</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p><strong>Slip:</strong> {lastAssigned.slip.slipNumber}</p>
            <p><strong>Token:</strong> {lastAssigned.slip.tokenNumber}</p>
            <p><strong>Tailor:</strong> {lastAssigned.assignedTailor?.name}</p>
            <p><strong>Role:</strong> {lastAssigned.assignedTailor?.role}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Scanned Slips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Search by slip/token/item code"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <div className="overflow-x-auto rounded border">
            <table className="w-full text-sm">
              <thead className="bg-orange-50">
                <tr>
                  <th className="text-left px-3 py-2">Slip</th>
                  <th className="text-left px-3 py-2">Token</th>
                  <th className="text-left px-3 py-2">Item</th>
                  <th className="text-left px-3 py-2">Assigned To</th>
                  <th className="text-left px-3 py-2">Scanned At</th>
                  <th className="text-left px-3 py-2">Work Status</th>
                  <th className="text-left px-3 py-2">Save</th>
                </tr>
              </thead>
              <tbody>
                {isTableLoading && (
                  <tr><td className="px-3 py-3" colSpan={7}>Loading scanned slips...</td></tr>
                )}
                {!isTableLoading && slips.length === 0 && (
                  <tr><td className="px-3 py-3" colSpan={7}>No scanned slips found.</td></tr>
                )}
                {!isTableLoading && slips.map((slip) => (
                  <tr key={slip._id} className="border-t">
                    <td className="px-3 py-2">{slip.slipNumber}</td>
                    <td className="px-3 py-2">{slip.tokenNumber}</td>
                    <td className="px-3 py-2">{slip.itemCode}</td>
                    <td className="px-3 py-2">{slip.scannedByName || "-"}</td>
                    <td className="px-3 py-2">{slip.scannedAt ? new Date(slip.scannedAt).toLocaleString("en-IN") : "-"}</td>
                    <td className="px-3 py-2 min-w-40">
                      <Select
                        value={statusDraft[slip._id] || mapSlipStatusToItemStatus(slip.status)}
                        onValueChange={(value) => setStatusDraft((prev) => ({ ...prev, [slip._id]: value }))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="partial_ready">Partial Ready</SelectItem>
                          <SelectItem value="ready">Ready</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2">
                      <Button
                        size="sm"
                        disabled={isUpdatingStatus || isUpdatingItemStatus}
                        onClick={() => handleStatusSave(slip)}
                      >
                        Save
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">
              Page {page} of {totalPages} ({total} records)
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanTailorSlipPage;
