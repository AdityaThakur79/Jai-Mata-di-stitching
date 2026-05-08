import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Package,
  CalendarDays,
  Search,
  UserRound,
  Tag,
  ReceiptText,
} from "lucide-react";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetPendingOrderStockBucketsQuery,
  useUpdatePendingOrderItemWorkMutation,
} from "@/features/api/pendingOrderApi";

const PAGE_SIZE = 12;

const ORDER_TYPE_LABEL = {
  fabric: "Fabric only",
  fabric_stitching: "Fabric + stitching",
  stitching: "Stitching",
};

const PRIORITY_RING = {
  low: "ring-slate-200 text-slate-700 bg-white",
  medium: "ring-orange-100 text-orange-900 bg-orange-50/70",
  high: "ring-amber-200 text-amber-950 bg-amber-50/90",
  urgent: "ring-red-300 text-red-900 bg-red-50",
};

const statusBadgeClass = {
  pending: "bg-slate-100 text-slate-700 border-slate-200",
  in_progress: "bg-sky-100 text-sky-800 border-sky-200",
  partial_ready: "bg-amber-100 text-amber-900 border-amber-200",
  ready: "bg-emerald-100 text-emerald-900 border-emerald-200",
};

function fmtDay(d) {
  if (!d) return "—";
  try {
    return format(new Date(d), "dd MMM yyyy");
  } catch {
    return "—";
  }
}

function fmtDayMaybeTime(d) {
  if (!d) return "—";
  try {
    const dt = new Date(d);
    const datePart = format(dt, "dd MMM yyyy");
    const hh = dt.getHours();
    const mi = dt.getMinutes();
    if (hh !== 0 || mi !== 0) return `${datePart}, ${format(dt, "HH:mm")}`;
    return datePart;
  } catch {
    return "—";
  }
}

/** Full / partial ready stock accordion + line-item table */
// eslint-disable-next-line react/prop-types -- routed props (`bucket`, `title`) fixed at call sites
const EmployeeStockBoard = ({ bucket = "partial_ready", title = "Partial Ready" }) => {
  const { data, isLoading } = useGetPendingOrderStockBucketsQuery();
  const [updatePendingOrderItemWork] = useUpdatePendingOrderItemWorkMutation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowSaving, setRowSaving] = useState(null);

  const filtered = useMemo(() => {
    const rows =
      bucket === "full_ready" ? data?.fullReady || [] : data?.partialReady || [];
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((order) => {
      const token = String(order.tokenNumber || "").toLowerCase();
      const cust = String(order.customer?.name || "").toLowerCase();
      const master = String(order.master?.name || "").toLowerCase();
      const salesman = String(order.salesman?.name || "").toLowerCase();
      const otype = String(ORDER_TYPE_LABEL[order.orderType] || order.orderType || "").toLowerCase();
      const itemHit = (order.items || []).some((it) => {
        const hay = [
          it.itemCode,
          it.itemTypeName,
          it.fabricName,
          it.styleName,
          it.designNumber,
        ]
          .map((x) => String(x || "").toLowerCase())
          .join(" ");
        return hay.includes(q);
      });
      return (
        token.includes(q) ||
        cust.includes(q) ||
        master.includes(q) ||
        salesman.includes(q) ||
        otype.includes(q) ||
        itemHit
      );
    });
  }, [bucket, data?.fullReady, data?.partialReady, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(1, totalPages)));
  }, [totalPages]);

  const safePage = Math.min(page, totalPages);
  const pageOrders = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const onItemStatusChange = async (orderId, itemCode, nextStatus, currentStatus) => {
    if (nextStatus === currentStatus) return;
    const key = `${orderId}-${itemCode}`;
    setRowSaving(key);
    try {
      await updatePendingOrderItemWork({
        orderId,
        itemCode,
        payload: { itemStatus: nextStatus },
      }).unwrap();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update status");
    } finally {
      setRowSaving(null);
    }
  };

  const handleSearchChange = (v) => {
    setSearch(v);
    setPage(1);
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h1 className="truncate text-xl font-semibold tracking-tight text-[#9a3412] sm:text-2xl">{title}</h1>
          <Badge
            variant="outline"
            className="h-7 shrink-0 border-orange-300/90 bg-orange-50/95 px-2.5 text-xs font-medium text-orange-900 shadow-sm">
            {filtered.length} orders
          </Badge>
          {bucket === "full_ready" && (
            <Badge
              variant="outline"
              className="h-7 shrink-0 border-emerald-300/90 bg-emerald-50/95 px-2.5 text-xs font-medium text-emerald-900 shadow-sm">
              All lines ready
            </Badge>
          )}
          {bucket === "partial_ready" && (
            <Badge
              variant="outline"
              className="h-7 shrink-0 border-amber-300/90 bg-amber-50/95 px-2.5 text-xs font-semibold text-amber-950 shadow-sm">
              Some in progress
            </Badge>
          )}
        </div>
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/90" />
          <Input
            placeholder="Search token, customer, item, fabric, tailor…"
            className="h-10 rounded-xl border-orange-100/95 bg-white/95 pl-10 text-sm shadow-sm ring-1 ring-orange-950/5 focus-visible:ring-orange-400/35"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      {isLoading && (
        <p className="py-14 text-center text-sm text-muted-foreground">Loading…</p>
      )}

      {!isLoading && filtered.length === 0 && (
        <Card className="border-dashed border-orange-200/90 bg-gradient-to-br from-orange-50/50 to-white py-12 text-center text-sm text-muted-foreground shadow-inner">
          No orders in this list.
        </Card>
      )}

      {!isLoading && filtered.length > 0 && (
        <Card className="overflow-hidden border-orange-100/95 bg-white/90 shadow-[0_22px_50px_-32px_rgba(180,82,23,0.55)] backdrop-blur-sm ring-1 ring-orange-950/5">
          <Accordion type="multiple" className="w-full divide-y divide-orange-100/90">
            {pageOrders.map((order) => {
              const pr = PRIORITY_RING[order.priority] || PRIORITY_RING.medium;
              const typeLbl = ORDER_TYPE_LABEL[order.orderType] || order.orderType || "—";
              return (
                <AccordionItem
                  key={order._id}
                  value={String(order._id)}
                  className="border-0 first:rounded-t-[inherit] odd:bg-orange-50/15">
                  <AccordionTrigger className="items-start px-2 py-2.5 text-left hover:bg-orange-50/40 hover:no-underline data-[state=open]:border-b data-[state=open]:border-orange-100/80 data-[state=open]:bg-gradient-to-br data-[state=open]:from-amber-50/40 data-[state=open]:via-white data-[state=open]:to-orange-50/30 sm:px-3 sm:py-3 [&[data-state=open]>svg]:text-orange-800">
                    <div className="mr-3 flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <Package className="h-5 w-5 shrink-0 text-orange-700" aria-hidden />
                        <span className="font-mono text-base font-bold tabular-nums text-[#6c2f12] sm:text-[17px]">
                          {order.tokenNumber}
                        </span>
                        <span className="hidden text-orange-950/35 sm:inline" aria-hidden>
                          •
                        </span>
                        <span className="min-w-0 max-w-[min(100%,18rem)] truncate text-[15px] font-semibold leading-snug text-[#3f2a1f] sm:max-w-[min(100%,36rem)]">
                          {order.customer?.name || "—"}
                        </span>
                        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
                          <Badge
                            variant="secondary"
                            className="h-7 border border-transparent bg-orange-100/95 px-2.5 tabular-nums text-xs font-semibold text-orange-950 shadow-sm">
                            {order.readyItems}/{order.totalItems} ready
                          </Badge>
                          <Badge
                            variant="outline"
                            className="h-7 border-orange-200/95 bg-white/90 px-2.5 tabular-nums text-xs font-semibold text-orange-950 shadow-sm">
                            {order.pendingItems} pending
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-6">
                        {[
                          {
                            Icon: Clock,
                            label: "Order date",
                            node: fmtDayMaybeTime(order.createdAt),
                          },
                          {
                            Icon: CalendarDays,
                            label: "Due",
                            node: fmtDay(order.expectedDeliveryDate),
                          },
                          {
                            Icon: UserRound,
                            label: "Master / tailor",
                            node: order.master?.name?.trim() || "—",
                          },
                          {
                            Icon: ReceiptText,
                            label: "Sales",
                            node: order.salesman?.name?.trim() || "—",
                          },
                          {
                            Icon: Tag,
                            label: "Order type",
                            node: (
                              <span title={order.orderType}>{typeLbl}</span>
                            ),
                          },
                        ].map(({ Icon: MIcon, label, node }) => (
                          <div
                            key={label}
                            className="flex min-w-0 gap-2 rounded-lg border border-orange-100/80 bg-white/80 px-2.5 py-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85)]">
                            <MIcon
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-700/85"
                              aria-hidden
                            />
                            <div className="min-w-0">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-orange-950/55">
                                {label}
                              </p>
                              <div className="truncate text-[13px] font-medium leading-tight text-[#45230a]">
                                {node}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 ring-1 ring-inset ${pr}`}>
                          <Tag className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-wide opacity-65">Priority</p>
                            <p className="truncate text-[13px] capitalize leading-tight">
                              {(order.priority || "medium").replace(/_/g, " ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-2 pb-0 pt-2 sm:px-3">
                    <div className="overflow-hidden rounded-xl border border-orange-100 bg-gradient-to-b from-white via-orange-50/20 to-white shadow-inner ring-1 ring-orange-950/5">
                      <div className="max-h-[min(70vh,720px)] overflow-auto">
                        <table className="w-full min-w-[880px] border-collapse text-sm">
                          <thead className="sticky top-0 z-10 border-b border-orange-200/95 bg-[linear-gradient(180deg,#fff9f4_0%,#fff3e9_100%)] text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-orange-950/55 shadow-[0_1px_0_0_rgba(234,169,119,0.35)] backdrop-blur-sm">
                            <tr>
                              <th className="w-[10.5rem] px-3 py-2">Code</th>
                              <th className="min-w-[7rem] px-3 py-2">Category</th>
                              <th className="min-w-[6.5rem] px-3 py-2">Style</th>
                              <th className="min-w-[6.5rem] px-3 py-2">Fabric</th>
                              <th className="w-24 px-3 py-2 text-right">Qty</th>
                              <th className="hidden md:table-cell md:w-[6.75rem] px-3 py-2 xl:w-28">
                                Design
                              </th>
                              <th className="hidden lg:table-cell w-[7.75rem] px-3 py-2">Updated</th>
                              <th className="hidden sm:table-cell w-[6.75rem] px-3 py-2">Status</th>
                              <th className="min-w-[8.75rem] px-3 py-2">Set status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(order.items || []).map((item, idx) => {
                              const rowKey = `${order._id}-${item.itemCode}`;
                              const loading = rowSaving === rowKey;
                              const st = item.itemStatus || "pending";
                              const zebra =
                                idx % 2 === 0 ? "bg-white/90" : "bg-orange-50/35";
                              return (
                                <tr
                                  key={item.itemCode}
                                  className={`border-b border-orange-100/80 last:border-b-0 ${zebra} transition-colors hover:bg-orange-100/45`}>
                                  <td className="px-3 py-2 align-middle font-mono text-[13px] font-semibold text-[#58230d]">
                                    {item.itemCode}
                                  </td>
                                  <td className="px-3 py-2 align-middle text-[13px] font-medium text-[#3f2f28]">
                                    <span className="line-clamp-2">{item.itemTypeName || "—"}</span>
                                  </td>
                                  <td className="px-3 py-2 align-middle text-[13px] text-muted-foreground">
                                    <span className="line-clamp-2" title={item.styleName}>
                                      {item.styleName || "—"}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 align-middle text-[13px] text-muted-foreground">
                                    <span className="line-clamp-2" title={item.fabricName}>
                                      {item.fabricName || "—"}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 align-middle text-right tabular-nums text-[13px] font-medium text-[#472a17]">
                                    <span>{item.quantity}</span>
                                    {typeof item.fabricMeters === "number" && item.fabricMeters > 0 ? (
                                      <span className="mt-0.5 block text-[11px] font-normal tabular-nums text-muted-foreground">
                                        {item.fabricMeters} m
                                      </span>
                                    ) : null}
                                  </td>
                                  <td className="hidden md:table-cell px-3 py-2 align-middle text-[12px] text-muted-foreground">
                                    <span className="block max-w-[8rem] truncate font-mono" title={item.designNumber}>
                                      {item.designNumber || "—"}
                                    </span>
                                  </td>
                                  <td className="hidden lg:table-cell px-3 py-2 align-middle text-[12px] tabular-nums text-muted-foreground">
                                    {fmtDay(item.itemStatusUpdatedAt)}
                                  </td>
                                  <td className="hidden px-3 py-2 align-middle sm:table-cell">
                                    <span
                                      className={`inline-flex whitespace-nowrap rounded-md border px-2 py-0.5 text-[11px] font-semibold capitalize shadow-sm ${statusBadgeClass[st] || statusBadgeClass.pending}`}>
                                      {String(st).replace(/_/g, " ")}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 align-middle">
                                    <Select
                                      value={st}
                                      disabled={loading}
                                      onValueChange={(v) =>
                                        onItemStatusChange(order._id, item.itemCode, v, st)
                                      }>
                                      <SelectTrigger className="h-9 rounded-lg border-orange-100/98 bg-white/95 font-medium shadow-sm hover:border-orange-200/95">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending" className="text-sm">
                                          Pending
                                        </SelectItem>
                                        <SelectItem value="in_progress" className="text-sm">
                                          In progress
                                        </SelectItem>
                                        <SelectItem value="partial_ready" className="text-sm">
                                          Partial ready
                                        </SelectItem>
                                        <SelectItem value="ready" className="text-sm">
                                          Ready
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-orange-100/90 bg-orange-50/25 px-3 py-2.5 text-sm text-muted-foreground">
              <span>
                Page <span className="font-semibold tabular-nums text-[#58230d]">{safePage}</span> /{" "}
                <span className="tabular-nums">{totalPages}</span>
              </span>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 border-orange-200/95 bg-white/90 px-3 text-orange-950 shadow-sm hover:bg-orange-50/80"
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 border-orange-200/95 bg-white/90 px-3 text-orange-950 shadow-sm hover:bg-orange-50/80"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default EmployeeStockBoard;
