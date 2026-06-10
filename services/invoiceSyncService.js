import Invoice from "../models/Invoice.js";
import Order from "../models/order.js";
import PendingOrder from "../models/pendingOrder.js";
import { User } from "../models/user.js";
import {
  buildClientInvoiceItems,
  getInvoiceTypeFromItems,
} from "../utils/invoiceMapper.js";

export const createInvoiceFromClientOrder = async (order, bill, billerId) => {
  let resolvedBiller = billerId || order.createdBy?._id || order.createdBy;
  if (!resolvedBiller) {
    const fallbackUser = await User.findOne().select("_id");
    resolvedBiller = fallbackUser?._id;
  }
  if (!resolvedBiller) {
    throw new Error("No biller available for invoice creation");
  }

  const invoiceItems = buildClientInvoiceItems(order);
  const subtotal = order.subtotal || invoiceItems.reduce((sum, item) => sum + item.totalAmount, 0);
  const gstPercentage = order.taxRate || 5;
  const gstAmount = order.taxAmount || (subtotal * gstPercentage) / 100;
  const discountAmount = order.discountAmount || 0;
  const discountPercentage =
    order.discountType === "percentage"
      ? order.discountValue || 0
      : subtotal > 0
        ? (discountAmount / subtotal) * 100
        : 0;
  const totalAmount = order.totalAmount || bill.totalAmount || subtotal + gstAmount - discountAmount;
  const paidAmount = bill.paidAmount || order.advancePayment || 0;

  const invoice = await Invoice.create({
    invoiceNumber: bill.billNumber,
    clientOrder: order._id,
    client: order.client?._id || order.client,
    orderSource: "client",
    orderType: order.orderType || "mixed",
    billDate: bill.billDate || new Date(),
    dueDate: bill.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    subtotal,
    gstPercentage,
    gstAmount,
    discountPercentage,
    discountAmount,
    totalAmount,
    paidAmount,
    balanceAmount: Math.max(0, totalAmount - paidAmount),
    paymentStatus: bill.paymentStatus || order.paymentStatus || "pending",
    remarks: bill.notes || "",
    biller: resolvedBiller,
    branchId: order.branchId?._id || order.branchId,
    items: invoiceItems,
    status: "generated",
    documentType: "invoice",
    invoiceType: getInvoiceTypeFromItems(invoiceItems),
    pdfUrl: bill.pdfUrl || order.pdfUrl || "",
    pdfOriginalUrl: bill.pdfOriginalUrl || order.pdfOriginalUrl || "",
    pdfDeliveryFormat: bill.pdfDeliveryFormat || order.pdfDeliveryFormat || "",
    pdfPublicId: bill.pdfPublicId || order.pdfPublicId || "",
    pdfGeneratedAt: bill.pdfUrl ? new Date() : undefined,
  });

  // Ensure pendingOrder is not stored as null (breaks unique index)
  if (invoice.pendingOrder == null) {
    await Invoice.updateOne({ _id: invoice._id }, { $unset: { pendingOrder: "" } });
  }

  return invoice;
};

export const syncMissingCustomerInvoices = async (limit = 100) => {
  await Invoice.updateMany(
    { orderSource: { $exists: false }, pendingOrder: { $exists: true, $ne: null } },
    { $set: { orderSource: "customer" } }
  );

  const pendingOrdersWithInvoice = await PendingOrder.find({
    invoice: { $exists: true, $ne: null },
  })
    .populate("invoice")
    .limit(limit);

  let updated = 0;
  for (const pendingOrder of pendingOrdersWithInvoice) {
    const invoiceId = pendingOrder.invoice?._id || pendingOrder.invoice;
    if (!invoiceId) continue;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) continue;

    let changed = false;
    if (invoice.orderSource !== "customer") {
      invoice.orderSource = "customer";
      changed = true;
    }
    if (!invoice.orderType && pendingOrder.orderType) {
      invoice.orderType = pendingOrder.orderType;
      changed = true;
    }
    if (!invoice.pendingOrder) {
      invoice.pendingOrder = pendingOrder._id;
      changed = true;
    }
    if (!invoice.branchId && pendingOrder.branchId) {
      invoice.branchId = pendingOrder.branchId;
      changed = true;
    }
    if (!invoice.documentType) {
      invoice.documentType = "invoice";
      changed = true;
    }

    if (changed) {
      await invoice.save();
      updated += 1;
    }
  }
  return updated;
};

export const syncMissingClientInvoices = async (limit = 50) => {
  await syncMissingCustomerInvoices(limit);

  await Invoice.updateMany(
    { orderSource: { $exists: false }, clientOrder: { $exists: true, $ne: null } },
    { $set: { orderSource: "client" } }
  );

  const customerInvoicesMissingType = await Invoice.find({
    orderType: { $exists: false },
    pendingOrder: { $exists: true, $ne: null },
  }).populate("pendingOrder", "orderType");

  for (const inv of customerInvoicesMissingType) {
    if (inv.pendingOrder?.orderType) {
      inv.orderType = inv.pendingOrder.orderType;
      await inv.save();
    }
  }

  const ordersWithBill = await Order.find({ bill: { $exists: true, $ne: null } })
    .populate("bill")
    .populate("client")
    .populate("items.itemType")
    .populate("items.fabric")
    .populate("createdBy")
    .limit(limit * 2);

  let synced = 0;
  for (const order of ordersWithBill) {
    if (synced >= limit) break;
    const existing = await Invoice.findOne({ clientOrder: order._id });
    if (!existing && order.bill) {
      try {
        await createInvoiceFromClientOrder(order, order.bill);
        synced += 1;
      } catch (err) {
        console.error(`Failed to sync invoice for order ${order._id}:`, err.message);
      }
    }
  }
  return synced;
};
