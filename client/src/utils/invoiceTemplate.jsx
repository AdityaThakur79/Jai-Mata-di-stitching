import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';

// Helper function to convert image to data URL
const toDataUrl = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg'));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
};

// Convert numbers to words in Indian numbering system (Rupees/Paise)
const numberToWordsIndian = (num) => {
  if (num === 0) return 'zero';
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  const twoDigit = (n) => {
    if (n < 20) return ones[n];
    const t = Math.floor(n / 10);
    const o = n % 10;
    return `${tens[t]}${o ? ' ' + ones[o] : ''}`.trim();
  };

  const threeDigit = (n) => {
    const h = Math.floor(n / 100);
    const r = n % 100;
    let res = '';
    if (h) res += `${ones[h]} hundred`;
    if (r) res += `${res ? ' ' : ''}${twoDigit(r)}`;
    return res.trim();
  };

  let words = '';
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundredToOne = num;

  if (crore) words += `${twoDigit(crore)} crore`;
  if (lakh) words += `${words ? ' ' : ''}${twoDigit(lakh)} lakh`;
  if (thousand) words += `${words ? ' ' : ''}${twoDigit(thousand)} thousand`;
  if (hundredToOne) words += `${words ? ' ' : ''}${threeDigit(hundredToOne)}`;

  return words.trim();
};

const amountToWordsINR = (amount) => {
  const safe = isNaN(amount) ? 0 : Number(amount);
  const rupees = Math.floor(safe);
  const paise = Math.round((safe - rupees) * 100);
  const rupeesPart = `${numberToWordsIndian(rupees)} rupees`;
  const paisePart = paise ? ` and ${numberToWordsIndian(paise)} paise` : '';
  const result = (rupeesPart + paisePart + ' only').trim();
  return result.charAt(0).toUpperCase() + result.slice(1);
};

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingTop: 0,
    fontFamily: 'Helvetica',
    fontSize: 9,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    borderBottom: '1 solid #f77f2f',
    paddingBottom: 10,
    backgroundColor: '#FAFAFA',
    padding: 8,
    borderRadius: 4,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
    backgroundColor: '#f77f2f',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 30,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  companyInfo: {
    flexDirection: 'column',
    marginLeft: 6,
    maxWidth: '68%',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  companyTagline: {
    fontSize: 7,
    color: '#f77f2f',
    fontWeight: 'bold',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  companyDetails: {
    fontSize: 8,
    color: '#000000',
    lineHeight: 1.3,
    fontWeight: 'bold',
  },
  invoiceSection: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 6,
    borderRadius: 4,
    border: '1 solid #f77f2f',
    minWidth: 130,
  },
  invoiceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f77f2f',
    marginBottom: 4,
    textAlign: 'center',
  },
  invoiceNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
    textAlign: 'center',
  },
  invoiceDetails: {
    fontSize: 8,
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  amountDueBar: {
    backgroundColor: '#f77f2f',
    padding: 6,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountDueText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  amountDueValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  col: {
    flex: 1,
  },
  colGap: {
    width: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 3,
  },
  sectionContent: {
    fontSize: 8,
    color: '#000000',
    lineHeight: 1.3,
    marginBottom: 2,
  },
  clientInfo: {
    backgroundColor: '#FFFFFF',
    padding: 6,
    borderRadius: 3,
    marginBottom: 10,
    border: '1 solid #f77f2f',
  },
  itemsTable: {
    marginBottom: 15,
  },
  tableHeader: {
    backgroundColor: '#f77f2f',
    flexDirection: 'row',
    padding: 5,
  },
  tableHeaderText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 4,
    borderBottom: '1 solid #E5E7EB',
  },
  tableRowAlt: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: '#F9FAFB',
    borderBottom: '1 solid #E5E7EB',
  },
  tableCell: {
    fontSize: 8,
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  tableCellLeft: {
    fontSize: 8,
    color: '#000000',
    flex: 1,
    textAlign: 'left',
  },
  tableTotalRow: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: '#FEF3E7',
    borderTop: '1 solid #f77f2f',
  },
  tableTotalText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  pricingSection: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  pricingLeft: {
    flex: 1,
    marginRight: 10,
  },
  pricingRight: {
    flex: 1,
  },
  pricingBox: {
    backgroundColor: '#F9FAFB',
    padding: 6,
    borderRadius: 3,
    border: '1 solid #f77f2f',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    paddingVertical: 1,
  },
  pricingLabel: {
    fontSize: 8,
    color: '#000000',
    fontWeight: 'bold',
  },
  pricingValue: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000000',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingTop: 5,
    borderTop: '1 solid #f77f2f',
    backgroundColor: '#FEF3E7',
    padding: 5,
    borderRadius: 3,
  },
  totalLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000000',
  },
  totalValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000000',
  },
  amountWords: {
    fontSize: 8,
    color: '#000000',
    fontWeight: 'bold',
    marginTop: 6,
  },
  footer: {
    marginTop: 20,
    paddingTop: 15,
    borderTop: '1 solid #f77f2f',
  },
  cinRow: {
    marginTop: 4,
    marginBottom: 6,
    textAlign: 'center',
  },
  cinText: {
    fontSize: 8,
    color: '#000000',
    fontWeight: 'bold',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  machineNote: {
    fontSize: 7,
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footerLink: {
    fontSize: 8,
    color: '#f77f2f',
    marginTop: 4,
    textAlign: 'center',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  termsSection: {
    flex: 1,
    marginRight: 15,
  },
  termsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 3,
  },
  termsContent: {
    fontSize: 7,
    color: '#000000',
    lineHeight: 1.3,
  },
  signatureSection: {
    alignItems: 'center',
    marginTop: 8,
  },
  shippingSection: {
    backgroundColor: '#FFFFFF',
    padding: 6,
    borderRadius: 3,
    marginBottom: 10,
    border: '1 solid #f77f2f',
    alignSelf: 'center',
    width: '90%',
  },
  cardFixed: {
    height: 120,
  },
  shippingTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  shippingSubtitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 3,
  },
  shippingContent: {
    fontSize: 8,
    color: '#000000',
    lineHeight: 1.3,
    marginBottom: 2,
  },
  qrImage: {
    width: 90,
    height: 90,
    marginTop: 8,
    border: '1 solid #EEE',
    alignSelf: 'center',
  },
});

const InvoiceDocument = (data) => {
  const [logoDataUrl, setLogoDataUrl] = useState(null);
  const [isMounted, setIsMounted] = useState(true);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);

  useEffect(() => {
    // Use base64 logo from data if provided, otherwise convert from URL
    if (data.logo) {
      setLogoDataUrl(data.logo);
    } else {
      const logoUrl = data.logoUrl || "/images/jmd_logo.jpeg";
      toDataUrl(logoUrl).then((dataUrl) => {
        if (isMounted) setLogoDataUrl(dataUrl || null);
      });
    }

    return () => {
      setIsMounted(false);
    };
  }, [isMounted, data.logo, data.logoUrl]);

  useEffect(() => {
    const qrUrl = data.branchQrCodeImage || data.qrCodeImage || (data.branch && data.branch.qrCodeImage);
    console.log('[Invoice PDF] QR Code Source Chosen:', qrUrl);
    if (!qrUrl) {
      setQrCodeDataUrl(null);
      console.log('[Invoice PDF] No QR code image found in props.');
      return;
    }
    if (/^data:image/.test(qrUrl)) {
      setQrCodeDataUrl(qrUrl);
      console.log('[Invoice PDF] QR code already in base64 format.');
    } else {
      toDataUrl(qrUrl)
        .then(dUrl => {
          setQrCodeDataUrl(dUrl);
          if (dUrl) {
            console.log('[Invoice PDF] Successfully converted QR code URL to base64.');
          } else {
            console.log('[Invoice PDF] Failed to convert QR code URL to base64:', qrUrl);
          }
        })
        .catch(err => {
          console.error('[Invoice PDF] Error converting QR code image to base64:', err, qrUrl);
        });
    }
  }, [data.branchQrCodeImage, data.qrCodeImage, data.branch]);

  // Derived payment fields and status
  const totalAmountSafe = Number(data.totalAmount) || 0;
  const normalizedPaymentStatus = String(data.paymentStatus || '').toLowerCase();
  let paidAmountSafe = Number(data.paidAmount) || Number(data.advancePayment) || 0;
  let pendingDerived = Number(data.pendingAmount) || Number(data.balanceAmount) || 0;

  if (pendingDerived <= 0) {
    pendingDerived = Math.max(totalAmountSafe - paidAmountSafe, 0);
  }

  if (normalizedPaymentStatus === 'paid') {
    paidAmountSafe = paidAmountSafe > 0 ? paidAmountSafe : totalAmountSafe;
    pendingDerived = 0;
  } else if (normalizedPaymentStatus === 'refunded') {
    pendingDerived = 0;
    paidAmountSafe = paidAmountSafe > 0 ? paidAmountSafe : totalAmountSafe;
  }

  let computedPaymentStatus = 'PENDING';
  switch (normalizedPaymentStatus) {
    case 'paid':
      computedPaymentStatus = 'PAID';
      break;
    case 'partial':
      computedPaymentStatus = 'PARTIAL';
      break;
    case 'overdue':
      computedPaymentStatus = 'OVERDUE';
      break;
    case 'refunded':
      computedPaymentStatus = 'REFUNDED';
      break;
    default:
      computedPaymentStatus = pendingDerived <= 0
        ? 'PAID'
        : (paidAmountSafe > 0 ? 'PARTIAL' : 'PENDING');
      break;
  }

  const showQrForPayment = pendingDerived > 0 && computedPaymentStatus !== 'REFUNDED';
  const wordsBaseAmount = computedPaymentStatus === 'PAID'
    ? totalAmountSafe
    : (computedPaymentStatus === 'REFUNDED'
        ? paidAmountSafe
        : (paidAmountSafe > 0 ? pendingDerived : totalAmountSafe));

  const amountStatusText = (() => {
    if (computedPaymentStatus === 'PAID') return 'Paid in full';
    if (computedPaymentStatus === 'REFUNDED') return `Refunded: ₹${paidAmountSafe.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    if (pendingDerived > 0) {
      if (computedPaymentStatus === 'OVERDUE') {
        return `Overdue Amount: ₹${pendingDerived.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
      }
      return `Amount Due: ₹${pendingDerived.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    }
    return 'No Due';
  })();

  const totalRowLabel = computedPaymentStatus === 'PAID'
    ? 'Total Paid:'
    : computedPaymentStatus === 'REFUNDED'
      ? 'Refunded Amount:'
      : (paidAmountSafe > 0 ? 'Balance Amount:' : 'Total Amount:');

  const totalRowValue = computedPaymentStatus === 'PAID'
    ? totalAmountSafe
    : computedPaymentStatus === 'REFUNDED'
      ? paidAmountSafe
      : (paidAmountSafe > 0 ? pendingDerived : totalAmountSafe);

  try {
    console.log("Invoice data received:", data);
    console.log("Bank details in template:", {
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      ifscCode: data.ifscCode,
      upiId: data.upiId
    });
    return (
      <Document>
        <Page size="A4" style={styles.page}>
      {/* Header (Only TAX INVOICE and Bill Number) */}
      <View style={styles.header}>
        <View style={styles.logoSection}>
          {logoDataUrl ? (
            <Image style={styles.logoImage} src={logoDataUrl} />
          ) : (
            <View style={styles.logo}>
              <Text style={styles.logoText}>JMD</Text>
            </View>
          )}
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{data.companyName}</Text>
            <Text style={styles.companyTagline}>YOUR SATISFACTION IS OUR FIRST PRIORITY</Text>
            <Text style={styles.companyDetails}>
              {data.companyAddress}
              {'\n'}Contact: {data.companyPhone}   |   Email: {data.companyEmail}
              {'\n'}GST: {data.companyGST}   |   PAN: {data.companyPAN}
            </Text>
          </View>
        </View>
        <View style={styles.invoiceSection}>
          <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
          <Text style={styles.invoiceNumber}>{(data.invoiceNumber || '').replace('-BILL-', '-')}</Text>
        </View>
      </View>

      {/* Payment status bar */}
      <View style={styles.amountDueBar}>
        <Text style={styles.amountDueText}>Payment Status: {computedPaymentStatus}</Text>
        <Text style={styles.amountDueValue}>{amountStatusText}</Text>
      </View>

     

      {/* Content - 3 Column Grid with equal gap */}
      <View style={styles.content}>
        {/* Client Information */}
        <View style={styles.col}>
          <View style={[styles.clientInfo, styles.cardFixed]}>
            <Text style={styles.sectionTitle}>Client Information</Text>
            <Text style={styles.sectionSubtitle}>Bill To</Text>
            <Text style={styles.sectionContent}>
              {data.clientName}
              {'\n'}{data.clientAddress}
              {'\n'}{data.clientCity}, {data.clientState} - {data.clientPincode}
              {'\n'}Mobile: {data.clientMobile}
              {data.clientEmail && `\nEmail: ${data.clientEmail}`}
              {data.gstin && `\nGSTIN: ${data.gstin}`}
            </Text>
          </View>
        </View>
        <View style={styles.colGap} />

          {/* Shipping Information */}
          <View style={styles.col}>
          {data.shippingDetails && (
            <View style={[styles.shippingSection, styles.cardFixed]}>
              <Text style={styles.shippingTitle}>Shipping Information</Text>
              <Text style={styles.shippingSubtitle}>Ship To</Text>
              <Text style={styles.shippingContent}>
                {data.shippingDetails.shippingAddress && `${data.shippingDetails.shippingAddress}\n`}
                {data.shippingDetails.shippingCity && data.shippingDetails.shippingState && 
                  `${data.shippingDetails.shippingCity}, ${data.shippingDetails.shippingState}`}
                {data.shippingDetails.shippingPincode && ` - ${data.shippingDetails.shippingPincode}`}
                {data.shippingDetails.shippingPhone && `\nPhone: ${data.shippingDetails.shippingPhone}`}
                {data.shippingDetails.shippingMethod && `\nMethod: ${data.shippingDetails.shippingMethod.replace('_', ' ').toUpperCase()}`}
                {data.shippingDetails.deliveryStatus && `\nStatus: ${data.shippingDetails.deliveryStatus.replace('_', ' ').toUpperCase()}`}
                {data.shippingDetails.estimatedDeliveryDate && `\nEst. Delivery: ${new Date(data.shippingDetails.estimatedDeliveryDate).toLocaleDateString()}`}
                {data.shippingDetails.actualDeliveryDate && `\nDelivered: ${new Date(data.shippingDetails.actualDeliveryDate).toLocaleDateString()}`}
                {data.shippingDetails.deliveryPerson && `\nDelivery Person: ${data.shippingDetails.deliveryPerson}`}
                {data.shippingDetails.deliveryNotes && `\nNotes: ${data.shippingDetails.deliveryNotes}`}
              </Text>
            </View>
          )}
        </View>

       
        <View style={styles.colGap} />
         {/* Invoice Details */}
         <View style={styles.col}>
          <View style={[styles.pricingBox, styles.cardFixed]}>
            <Text style={styles.sectionTitle}>Invoice Information</Text>
            <Text style={styles.sectionContent}>
              Invoice Number: {(data.invoiceNumber || '').replace('-BILL-', '-')}
              {'\n'}Invoice Date: {data.invoiceDate}
              {'\n'}Due Date: {data.dueDate}
              {data.orderType && (`\nOrder Type: ${String(data.orderType).replace('_', ' ')}`)}
              {'\n'}Payment Status: {computedPaymentStatus}
              {data.paymentMethod && `\nPayment Method: ${data.paymentMethod}`}
              {'\n'}Payment Terms: 30 Days
            </Text>
          </View>
        </View>
      </View>

      {/* Items Table */}
      <View style={styles.itemsTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>S.No</Text>
          <Text style={styles.tableHeaderText}>Order No</Text>
          <Text style={styles.tableHeaderText}>Item Description</Text>
          <Text style={styles.tableHeaderText}>Qty</Text>
          <Text style={styles.tableHeaderText}>Unit Price</Text>
          <Text style={styles.tableHeaderText}>Total</Text>
        </View>
        
        {data.items.map((item, index) => (
          <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
            <Text style={styles.tableCell}>{index + 1}</Text>
            <Text style={styles.tableCell}>{item.clientOrderNumber || data.clientOrderNumber || ""}</Text>
            <Text style={styles.tableCellLeft}>
              {item.name}
              {item.description && `\nStyle: ${item.description}`}
              {item.fabric && `\nFabric: ${item.fabric}`}
              {item.fabricMeters > 0 && ` (${item.fabricMeters}m)`}
              {item.alteration > 0 && `\nAlteration: ₹${item.alteration.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
              {item.handwork > 0 && `\nHandwork: ₹${item.handwork.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
              {item.otherCharges > 0 && `\nOther Charges: ₹${item.otherCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            </Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCell}>{item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            <Text style={styles.tableCell}>{item.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
          </View>
        ))}
        
        <View style={styles.tableTotalRow}>
          <Text style={styles.tableTotalText}></Text>
          <Text style={styles.tableTotalText}>Total</Text>
          <Text style={styles.tableTotalText}></Text>
          <Text style={styles.tableTotalText}></Text>
          <Text style={styles.tableTotalText}>{data.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
        </View>
      </View>

      {/* Pricing Summary */}
      <View style={styles.pricingSection}>
        <View style={styles.pricingLeft}>
          <View style={styles.pricingBox}>
            <Text style={styles.sectionTitle}>Payment Information</Text>
            <Text style={styles.sectionContent}>
              Bank: {data.bankName || ""}
              {'\n'}Account: {data.accountName || "JMD STITCHING PRIVATE LIMITED"}
              {'\n'}Account No: {data.accountNumber || ""}
              {'\n'}IFSC: {data.ifscCode || ""}
            </Text>
            {qrCodeDataUrl && showQrForPayment && (
              <Image style={styles.qrImage} src={qrCodeDataUrl} />
            )}
          </View>
        </View>
        
        <View style={styles.pricingRight}>
          <View style={styles.pricingBox}>
            <Text style={styles.sectionTitle}>Pricing Summary</Text>
            
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Subtotal:</Text>
              <Text style={styles.pricingValue}>{data.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>

            {/* Additional Charges Breakdown */}
            {(() => {
              const totalAlteration = (data.items || []).reduce((sum, item) => sum + (parseFloat(item.alteration) || 0), 0);
              const totalHandwork = (data.items || []).reduce((sum, item) => sum + (parseFloat(item.handwork) || 0), 0);
              const totalOtherCharges = (data.items || []).reduce((sum, item) => sum + (parseFloat(item.otherCharges) || 0), 0);
              
              return (
                <>
                  {totalAlteration > 0 && (
                    <View style={styles.pricingRow}>
                      <Text style={styles.pricingLabel}>Total Alteration:</Text>
                      <Text style={styles.pricingValue}>{totalAlteration.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
                    </View>
                  )}
                  {totalHandwork > 0 && (
                    <View style={styles.pricingRow}>
                      <Text style={styles.pricingLabel}>Total Handwork:</Text>
                      <Text style={styles.pricingValue}>{totalHandwork.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
                    </View>
                  )}
                  {totalOtherCharges > 0 && (
                    <View style={styles.pricingRow}>
                      <Text style={styles.pricingLabel}>Total Other Charges:</Text>
                      <Text style={styles.pricingValue}>{totalOtherCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
                    </View>
                  )}
                </>
              );
            })()}
            
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>
                Discount {data.discountType === 'percentage' && data.discountValue > 0 ? `(${data.discountValue}%)` : ''}:
              </Text>
              <Text style={styles.pricingValue}>
                {data.discountAmount > 0 ? `-${data.discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '0.00'}
              </Text>
            </View>
            
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Taxable Amount:</Text>
              <Text style={styles.pricingValue}>{data.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
            
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>GST ({(data.taxRate ?? 5)}%):</Text>
              <Text style={styles.pricingValue}>{data.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
            
            {data.shippingDetails?.shippingCost > 0 && (
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Shipping Cost:</Text>
                <Text style={styles.pricingValue}>{data.shippingDetails.shippingCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
              </View>
            )}
            
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Total Amount:</Text>
              <Text style={styles.pricingValue}>{data.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
            
            {paidAmountSafe > 0 && (
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Paid Payment:</Text>
                <Text style={styles.pricingValue}>{paidAmountSafe.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
              </View>
            )}
            
            {pendingDerived > 0 && (
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Pending Payment:</Text>
                <Text style={styles.pricingValue}>{pendingDerived.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
              </View>
            )}
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{totalRowLabel}</Text>
              <Text style={styles.totalValue}>{totalRowValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
            {/* Amount in words */}
            <Text style={styles.amountWords}>
              Amount in words: {amountToWordsINR(wordsBaseAmount)}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {!!data.companyCIN && (
          <View style={styles.cinRow}>
            <Text style={styles.cinText}>CIN: {data.companyCIN}</Text>
          </View>
        )}
        <View style={styles.footerRow}>
          <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Terms & Conditions</Text>
          <Text style={styles.termsContent}>
            1. Payment within 30 days of invoice date.
            {'\n'}2. Late payments may incur interest charges.
            {'\n'}3. Goods once delivered are non-returnable.
            {'\n'}4. Disputes subject to local court jurisdiction.
            {data.paymentNotes && `\n\nPayment Notes: ${data.paymentNotes}`}
            {data.notes && `\n\nAdditional Notes: ${data.notes}`}
          </Text>
          </View>
          <View style={styles.signatureSection}>
            <Text style={{ fontSize: 9, fontWeight: 'bold' }}>For, {data.companyName}</Text>
            <Text style={{ height: 36 }}></Text>
            <Text style={{ fontSize: 9, fontWeight: 'bold' }}>Authorized Signatory</Text>
          </View>
        </View>
        <Text style={styles.machineNote}>This is a computer generated invoice. No stamp or signature required.</Text>
        <Link src="https://jmdstitching.com/track-order" style={styles.footerLink}>
          Track your order: https://jmdstitching.com/track-order
        </Link>
        <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'center', gap: 14 }}>
          <Link src="https://facebook.com/jmdstitching" style={styles.footerLink}>Facebook</Link>
          <Text> | </Text>
          <Link src="https://instagram.com/jmdstitching" style={styles.footerLink}>Instagram</Link>
          <Text> | </Text>
          <Link src="https://x.com/jmdstitching" style={styles.footerLink}>X (Twitter)</Link>
        </View>
      </View>
    </Page>
  </Document>
    );
  } catch (error) {
    console.error("Error rendering invoice document:", error);
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={{ padding: 50, textAlign: 'center' }}>
            <Text style={{ fontSize: 16, color: 'red' }}>
              Error generating invoice. Please try again.
            </Text>
          </View>
        </Page>
      </Document>
    );
  }
};

export default InvoiceDocument;
