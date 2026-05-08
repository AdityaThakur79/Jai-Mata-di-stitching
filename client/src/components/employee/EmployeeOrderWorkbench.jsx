import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";
import {
  useGetSlipWorkDetailsMutation,
  useScanTailorSlipMutation,
  useUpdatePendingOrderItemWorkMutation,
} from "@/features/api/pendingOrderApi";

const ITEM_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "partial_ready", label: "Partial Ready" },
  { value: "ready", label: "Ready" },
];

const EmployeeOrderWorkbench = () => {
  const inputRef = useRef(null);
  const [barcodeValue, setBarcodeValue] = useState("");
  const [workDetail, setWorkDetail] = useState(null);
  const [form, setForm] = useState({
    description: "",
    designNumber: "",
    quantity: 1,
    fabricMeters: 0,
    alteration: 0,
    handwork: 0,
    otherCharges: 0,
    itemStatus: "in_progress",
  });
  const [measurementText, setMeasurementText] = useState("{}");

  const [getSlipWorkDetails, { isLoading: isFetching }] = useGetSlipWorkDetailsMutation();
  const [scanTailorSlip] = useScanTailorSlipMutation();
  const [updatePendingOrderItemWork, { isLoading: isSaving }] = useUpdatePendingOrderItemWorkMutation();

  const readySummary = useMemo(() => {
    const total = Number(workDetail?.progress?.totalItems || 0);
    const ready = Number(workDetail?.progress?.readyItems || 0);
    return `${ready}/${total} item(s) ready`;
  }, [workDetail]);

  const applyItemToForm = (item) => {
    const measurementObj = item?.measurement && typeof item.measurement === "object" ? item.measurement : {};
    setForm({
      description: item?.description || "",
      designNumber: item?.designNumber || "",
      quantity: Number(item?.quantity || 1),
      fabricMeters: Number(item?.fabricMeters || 0),
      alteration: Number(item?.alteration || 0),
      handwork: Number(item?.handwork || 0),
      otherCharges: Number(item?.otherCharges || 0),
      itemStatus: item?.itemStatus || "in_progress",
    });
    setMeasurementText(JSON.stringify(measurementObj, null, 2));
  };

  const performScan = async () => {
    const value = barcodeValue.trim();
    if (!value) return;

    try {
      // Mark slip as scanned/assigned so it appears in scanned slips table.
      try {
        await scanTailorSlip(value).unwrap();
      } catch (scanError) {
        const msg = String(scanError?.data?.message || "").toLowerCase();
        if (!msg.includes("already scanned")) {
          throw scanError;
        }
      }
      const data = await getSlipWorkDetails(value).unwrap();
      setWorkDetail(data);
      applyItemToForm(data.item);
      toast.success("Slip scanned. Update work details below.");
    } catch (error) {
      toast.error(error?.data?.message || "Unable to fetch slip details");
    } finally {
      setBarcodeValue("");
      inputRef.current?.focus();
    }
  };

  const handleScan = async (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    await performScan();
  };

  const handleSave = async () => {
    if (!workDetail?.order?._id || !workDetail?.item?.itemCode) {
      toast.error("Scan a slip first.");
      return;
    }

    let measurementObj = {};
    try {
      measurementObj = measurementText?.trim() ? JSON.parse(measurementText) : {};
    } catch {
      toast.error("Measurements must be valid JSON format.");
      return;
    }

    try {
      const response = await updatePendingOrderItemWork({
        orderId: workDetail.order._id,
        itemCode: workDetail.item.itemCode,
        payload: { ...form, measurement: measurementObj },
      }).unwrap();

      const nextDetail = {
        ...workDetail,
        order: response.order,
        item: response.item,
        progress: {
          totalItems: response.order?.items?.length || 0,
          readyItems: (response.order?.items || []).filter((row) =>
            ["partial_ready", "ready"].includes(row.itemStatus)
          ).length,
        },
      };
      setWorkDetail(nextDetail);
      applyItemToForm(response.item);
      toast.success("Item saved. Status and stock buckets updated.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save order item");
    }
  };

  return (
    <div className="space-y-5">
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-700">Scan Slip to Start Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col md:flex-row gap-2">
            <Input
              ref={inputRef}
              placeholder="Scan barcode or type manually"
              value={barcodeValue}
              onChange={(e) => setBarcodeValue(e.target.value)}
              onKeyDown={handleScan}
              disabled={isFetching}
              autoFocus
            />
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={performScan}
              disabled={isFetching || !barcodeValue.trim()}
            >
              Scan Now
            </Button>
          </div>
          <Button variant="outline" onClick={() => inputRef.current?.focus()}>
            Focus Scanner Input
          </Button>
        </CardContent>
      </Card>

      {workDetail?.order && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-700">
              Workbench - {workDetail.order.tokenNumber} ({readySummary})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><strong>Customer:</strong> {workDetail.order.customer?.name || "-"}</div>
              <div><strong>Item Code:</strong> {workDetail.item?.itemCode}</div>
              <div><strong>Item:</strong> {workDetail.item?.itemType?.name || "-"}</div>
              <div><strong>Current Status:</strong> {workDetail.item?.itemStatus || "pending"}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></div>
              <div><Label>Design Number</Label><Input value={form.designNumber} onChange={(e) => setForm((p) => ({ ...p, designNumber: e.target.value }))} /></div>
              <div>
                <Label>Item Status</Label>
                <Select value={form.itemStatus} onValueChange={(value) => setForm((p) => ({ ...p, itemStatus: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ITEM_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Quantity</Label><Input type="number" value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: Number(e.target.value || 0) }))} /></div>
              <div><Label>Fabric Meters</Label><Input type="number" value={form.fabricMeters} onChange={(e) => setForm((p) => ({ ...p, fabricMeters: Number(e.target.value || 0) }))} /></div>
              <div><Label>Alteration</Label><Input type="number" value={form.alteration} onChange={(e) => setForm((p) => ({ ...p, alteration: Number(e.target.value || 0) }))} /></div>
              <div><Label>Handwork</Label><Input type="number" value={form.handwork} onChange={(e) => setForm((p) => ({ ...p, handwork: Number(e.target.value || 0) }))} /></div>
              <div><Label>Other Charges</Label><Input type="number" value={form.otherCharges} onChange={(e) => setForm((p) => ({ ...p, otherCharges: Number(e.target.value || 0) }))} /></div>
            </div>

            <div>
              <Label>Measurements (JSON)</Label>
              <textarea
                className="w-full min-h-40 border rounded-md p-3 text-sm"
                value={measurementText}
                onChange={(e) => setMeasurementText(e.target.value)}
              />
            </div>

            <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleSave} disabled={isSaving}>
              Save Work Entry
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeOrderWorkbench;
