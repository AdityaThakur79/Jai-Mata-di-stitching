import mongoose from "mongoose";
import { getLogoBase64 } from "./imageUtils.js";

const toObjectIdRef = (value) => {
  if (!value) return undefined;
  const id = value._id || value;
  return mongoose.isValidObjectId(id) ? id : undefined;
};

export const getInvoiceTypeFromItems = (items = []) => {
  const hasFabric = items.some((item) => (item.fabricAmount || 0) > 0);
  const hasStitching = items.some((item) => (item.stitchingAmount || 0) > 0);
  if (hasFabric && hasStitching) return "mixed";
  if (hasFabric) return "fabric";
  if (hasStitching) return "stitching";
  return "mixed";
};

export const mapInvoiceToPreviewData = (invoice) => {
  if (!invoice) return null;

  const branch = invoice.branchId || {};
  const isClient =
    invoice.orderSource === "client" || (!invoice.orderSource && invoice.clientOrder);
  const party = isClient
    ? invoice.client || {}
    : invoice.customer || {};

  const clientDetails = isClient
    ? {
        name: party.name || invoice.clientOrder?.clientDetails?.name || "",
        mobile: party.mobile || invoice.clientOrder?.clientDetails?.mobile || "",
        email: party.email || invoice.clientOrder?.clientDetails?.email || "",
        address: party.address || invoice.clientOrder?.clientDetails?.address || "",
        city: party.city || invoice.clientOrder?.clientDetails?.city || "",
        state: party.state || invoice.clientOrder?.clientDetails?.state || "",
        pincode: party.pincode || invoice.clientOrder?.clientDetails?.pincode || "",
        gstin: party.gstin || invoice.clientOrder?.clientDetails?.gstin || "",
      }
    : {
        name: party.name || "",
        mobile: party.mobile || "",
        email: party.email || "",
        address: party.address || "",
        city: party.city || "",
        state: party.state || "",
        pincode: party.pincode || "",
        gstin: party.gstin || "",
      };

  return {
    companyName: "JMD STITCHING PRIVATE LIMITED",
    companyAddress: branch.address || branch.branchName || "",
    companyPhone: branch.phone || "",
    companyEmail: branch.email || "",
    companyGST: branch.gst || "",
    companyPAN: branch.pan || "",
    companyCIN: branch.cin || "",
    logo: getLogoBase64(),
    bankName: branch.bankDetails?.bankName || "Union Bank of India",
    accountName: "JMD STITCHING PRIVATE LIMITED",
    accountNumber: branch.bankDetails?.accountNumber || "",
    ifscCode: branch.bankDetails?.ifsc || "",
    upiId: branch.phone ? `${branch.phone}@okbizaxis` : "",
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: new Date(invoice.billDate || invoice.createdAt).toLocaleDateString("en-IN"),
    dueDate: new Date(invoice.dueDate || Date.now()).toLocaleDateString("en-IN"),
    orderType: invoice.orderType || invoice.pendingOrder?.orderType || "",
    clientName: clientDetails.name,
    clientAddress: clientDetails.address,
    clientCity: clientDetails.city,
    clientState: clientDetails.state,
    clientPincode: clientDetails.pincode,
    clientMobile: clientDetails.mobile,
    clientEmail: clientDetails.email,
    gstin: clientDetails.gstin,
    subtotal: invoice.subtotal || 0,
    discountType: invoice.discountPercentage > 0 ? "percentage" : "fixed",
    discountValue: invoice.discountPercentage || 0,
    discountAmount: invoice.discountAmount || 0,
    taxableAmount: (invoice.subtotal || 0) - (invoice.discountAmount || 0),
    taxRate: invoice.gstPercentage || 0,
    taxAmount: invoice.gstAmount || 0,
    totalAmount: invoice.totalAmount || 0,
    paidAmount: invoice.paidAmount || 0,
    pendingAmount: invoice.balanceAmount || 0,
    balanceAmount: invoice.balanceAmount || 0,
    paymentStatus: invoice.paymentStatus || "pending",
    pdfUrl: invoice.pdfUrl || "",
    pdfOriginalUrl: invoice.pdfOriginalUrl || "",
    pdfDeliveryFormat: invoice.pdfDeliveryFormat || "",
    pdfPublicId: invoice.pdfPublicId || "",
    branchQrCodeImage: branch.qrCodeImage || "",
    qrCodeImage: branch.qrCodeImage || "",
    shippingDetails: invoice.pendingOrder?.shippingDetails || invoice.clientOrder?.shippingDetails || {},
    items: (invoice.items || []).map((item) => ({
      name: item.itemType?.name || item.name || "Item",
      description: item.description || item.style?.name || "",
      quantity: item.quantity || 1,
      unitPrice: (item.fabricAmount || 0) + (item.stitchingAmount || 0) + (item.alteration || 0) + (item.handwork || 0) + (item.otherCharges || 0),
      totalPrice: item.totalAmount || 0,
      fabric: item.fabric?.name || "",
      fabricMeters: item.fabricMeters || 0,
      designNumber: item.designNumber || "",
      alteration: item.alteration || 0,
      handwork: item.handwork || 0,
      otherCharges: item.otherCharges || 0,
      clientOrderNumber: item.clientOrderNumber || "",
    })),
  };
};

export const buildClientInvoiceItems = (order) =>
  (order.items || []).map((item) => {
    const fabricAmount = (item.fabricMeters || 0) * (item.fabric?.pricePerMeter || item.unitPrice || 0);
    const stitchingAmount = (item.quantity || 1) * (item.itemType?.stitchingCharge || 0);
    const additionalAmount = (item.alteration || 0) + (item.handwork || 0) + (item.otherCharges || 0);
    const totalAmount = item.totalPrice || fabricAmount + stitchingAmount + additionalAmount;
    const styleName = item.style?.styleName || item.style?.description || "";

    return {
      itemCode: item.designNumber || `ITEM-${item.itemType?.name || "NA"}`,
      itemType: toObjectIdRef(item.itemType),
      fabric: toObjectIdRef(item.fabric),
      fabricMeters: item.fabricMeters || 0,
      fabricRate: item.fabric?.pricePerMeter || 0,
      fabricAmount,
      quantity: item.quantity || 1,
      stitchingRate: item.itemType?.stitchingCharge || 0,
      stitchingAmount,
      measurement: item.measurement || {},
      designNumber: item.designNumber || "",
      description: item.description || styleName,
      alteration: item.alteration || 0,
      handwork: item.handwork || 0,
      otherCharges: item.otherCharges || 0,
      totalAmount,
    };
  });
