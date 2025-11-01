import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';
import { safeString, safeNumber, safeDate, safeArray, getLogoBase64 } from './imageUtils.js';

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
    marginLeft: 10,
  },
});

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

const InvoiceDocumentServer = (data) => {
  // Server-safe version - no hooks, no browser APIs
  // Use base64 logo from data.logo or get from file system
  let logoBase64 = data.logo || getLogoBase64();
  
  // Fallback: if logo is still null, try direct conversion
  if (!logoBase64) {
    console.log('Logo is null, attempting direct conversion...');
    logoBase64 = getLogoBase64();
  }
  
  console.log('Final logo status:', logoBase64 ? 'Present' : 'Missing');
  
  // Resolve QR code image similarly to client template logic
  const resolvedQrCodeImage = (() => {
    const candidate = data.branchQrCodeImage || data.qrCodeImage || (data.branch && data.branch.qrCodeImage) || '';
    console.log('[InvoiceTemplateServer] QR Code resolution:', {
      branchQrCodeImage: data.branchQrCodeImage || 'not provided',
      qrCodeImage: data.qrCodeImage || 'not provided',
      branch: data.branch ? 'provided' : 'not provided',
      finalCandidate: candidate || 'EMPTY'
    });
    if (!candidate) {
      console.log('[InvoiceTemplateServer] ⚠️ No QR code image found');
      return '';
    }
    // Accept base64 or URL directly; @react-pdf Image can fetch URLs server-side
    console.log('[InvoiceTemplateServer] ✅ QR code image resolved:', candidate.substring(0, 50) + '...');
    return candidate;
  })();
  
  // Safe field extraction with defaults
  const safeData = {
    companyName: safeString(data.companyName, 'JMD STITCHING PRIVATE LIMITED'),
    companyAddress: safeString(data.companyAddress, 'Company Address'),
    companyPhone: safeString(data.companyPhone, '9082150556'),
    companyEmail: safeString(data.companyEmail, 'info@jmdstitching.com'),
    companyGST: safeString(data.companyGST, 'GST123456789'),
    companyPAN: safeString(data.companyPAN, 'PAN123456789'),
    companyCIN: safeString(data.companyCIN, ''),
    bankName: safeString(data.bankName, 'Union Bank of India'),
    accountName: safeString(data.accountName, 'JMD STITCHING PRIVATE LIMITED'),
    accountNumber: safeString(data.accountNumber, '11111111111'),
    ifscCode: safeString(data.ifscCode, 'BCCB3578435'),
    upiId: safeString(data.upiId, '9082150556@okbizaxis'),
    invoiceNumber: safeString(data.invoiceNumber, 'INV-0001'),
    invoiceDate: safeDate(data.invoiceDate, new Date().toLocaleDateString('en-IN')),
    dueDate: safeDate(data.dueDate, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')),
    orderType: safeString(data.orderType, ''),
    clientOrderNumber: safeString(data.clientOrderNumber, ''),
    clientName: safeString(data.clientName, 'Client Name'),
    clientAddress: safeString(data.clientAddress, 'Client Address'),
    clientCity: safeString(data.clientCity, 'City'),
    clientState: safeString(data.clientState, 'State'),
    clientPincode: safeString(data.clientPincode, '000000'),
    clientMobile: safeString(data.clientMobile, '0000000000'),
    clientEmail: safeString(data.clientEmail, ''),
    gstin: safeString(data.gstin, ''),
    items: safeArray(data.items, []).map((item, idx) => {
      // Debug: Log items before mapping - check if clientOrderNumber exists
      if (item && typeof item === 'object') {
        console.log(`[InvoiceTemplateServer] safeData.items[${idx}] - Full item:`, JSON.stringify(item, null, 2));
        console.log(`[InvoiceTemplateServer] safeData.items[${idx}] clientOrderNumber:`, item.clientOrderNumber, 'Type:', typeof item.clientOrderNumber, 'Has property:', 'clientOrderNumber' in item);
      }
      return item;
    }),
    subtotal: safeNumber(data.subtotal, 0),
    discountType: safeString(data.discountType, 'percentage'),
    discountValue: safeNumber(data.discountValue, 0),
    discountAmount: safeNumber(data.discountAmount, 0),
    taxableAmount: safeNumber(data.taxableAmount, 0),
    taxRate: safeNumber(data.taxRate, 18),
    taxAmount: safeNumber(data.taxAmount, 0),
    totalAmount: safeNumber(data.totalAmount, 0),
    advancePayment: safeNumber(data.advancePayment, 0),
    paidAmount: safeNumber(data.paidAmount, 0),
    pendingAmount: safeNumber(data.pendingAmount, 0),
    balanceAmount: safeNumber(data.balanceAmount, 0),
    paymentStatus: safeString(data.paymentStatus, 'pending'),
    paymentMethod: safeString(data.paymentMethod, ''),
    paymentNotes: safeString(data.paymentNotes, ''),
    notes: safeString(data.notes, ''),
    shippingDetails: data.shippingDetails || null
  };

  return React.createElement(Document, null,
    React.createElement(Page, { size: "A4", style: styles.page },
      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(View, { style: styles.logoSection },
          logoBase64 ? 
            React.createElement(Image, { style: styles.logoImage, src: logoBase64 }) :
            React.createElement(View, { style: styles.logo },
              React.createElement(Text, { style: styles.logoText }, "JMD")
            ),
          React.createElement(View, { style: styles.companyInfo },
            React.createElement(Text, { style: styles.companyName }, safeData.companyName),
            React.createElement(Text, { style: styles.companyTagline }, "YOUR SATISFACTION IS OUR FIRST PRIORITY"),
            React.createElement(Text, { style: styles.companyDetails },
              safeData.companyAddress,
              '\nContact: ', safeData.companyPhone, '   |   Email: ', safeData.companyEmail,
              '\nGST: ', safeData.companyGST, '   |   PAN: ', safeData.companyPAN
            )
          )
        ),
        React.createElement(View, { style: styles.invoiceSection },
          React.createElement(Text, { style: styles.invoiceTitle }, "TAX INVOICE"),
          React.createElement(Text, { style: styles.invoiceNumber }, safeData.invoiceNumber.replace('-BILL-', '-'))
        )
      ),

      // Amount Due Bar
      React.createElement(View, { style: styles.amountDueBar },
        React.createElement(Text, { style: styles.amountDueText }, "Amount Due:"),
        React.createElement(Text, { style: styles.amountDueValue }, `₹${safeData.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`)
      ),

      // Content - 3 Column Grid
      React.createElement(View, { style: styles.content },
        // Client Information
        React.createElement(View, { style: styles.col },
          React.createElement(View, { style: [styles.clientInfo, styles.cardFixed] },
            React.createElement(Text, { style: styles.sectionTitle }, "Client Information"),
            React.createElement(Text, { style: styles.sectionSubtitle }, "Bill To"),
            React.createElement(Text, { style: styles.sectionContent },
              safeData.clientName,
              '\n', safeData.clientAddress,
              '\n', safeData.clientCity, ', ', safeData.clientState, ' - ', safeData.clientPincode,
              '\nMobile: ', safeData.clientMobile,
              safeData.clientEmail && `\nEmail: ${safeData.clientEmail}`,
              safeData.gstin && `\nGSTIN: ${safeData.gstin}`
            )
          )
        ),
        React.createElement(View, { style: styles.colGap }),

        // Shipping Information
        React.createElement(View, { style: styles.col },
          safeData.shippingDetails && safeData.shippingDetails.shippingAddress ? 
            React.createElement(View, { style: [styles.shippingSection, styles.cardFixed] },
              React.createElement(Text, { style: styles.shippingTitle }, "Shipping Information"),
              React.createElement(Text, { style: styles.shippingSubtitle }, "Ship To"),
              React.createElement(Text, { style: styles.shippingContent },
                safeString(safeData.shippingDetails.shippingAddress) && `${safeString(safeData.shippingDetails.shippingAddress)}\n`,
                safeString(safeData.shippingDetails.shippingCity) && safeString(safeData.shippingDetails.shippingState) && 
                  `${safeString(safeData.shippingDetails.shippingCity)}, ${safeString(safeData.shippingDetails.shippingState)}`,
                safeString(safeData.shippingDetails.shippingPincode) && ` - ${safeString(safeData.shippingDetails.shippingPincode)}`,
                safeString(safeData.shippingDetails.shippingPhone) && `\nPhone: ${safeString(safeData.shippingDetails.shippingPhone)}`,
                safeString(safeData.shippingDetails.shippingMethod) && `\nMethod: ${safeString(safeData.shippingDetails.shippingMethod).replace('_', ' ').toUpperCase()}`,
                safeString(safeData.shippingDetails.deliveryStatus) && `\nStatus: ${safeString(safeData.shippingDetails.deliveryStatus).replace('_', ' ').toUpperCase()}`
              )
            ) : null
        ),

        React.createElement(View, { style: styles.colGap }),

        // Invoice Details
        React.createElement(View, { style: styles.col },
          React.createElement(View, { style: [styles.pricingBox, styles.cardFixed] },
            React.createElement(Text, { style: styles.sectionTitle }, "Invoice Information"),
            React.createElement(Text, { style: styles.sectionContent },
              `Invoice Number: ${safeData.invoiceNumber.replace('-BILL-', '-')}`,
              '\nInvoice Date: ', safeData.invoiceDate,
              '\nDue Date: ', safeData.dueDate,
              safeData.orderType && `\nOrder Type: ${String(safeData.orderType).replace('_', ' ')}`,
              '\nPayment Status: ', safeData.paymentStatus.toUpperCase(),
              safeData.paymentMethod && `\nPayment Method: ${safeData.paymentMethod}`,
              '\nPayment Terms: 30 Days'
            )
          )
        )
      ),

      // Items Table
      React.createElement(View, { style: styles.itemsTable },
        React.createElement(View, { style: styles.tableHeader },
          React.createElement(Text, { style: styles.tableHeaderText }, "S.No"),
          React.createElement(Text, { style: styles.tableHeaderText }, "Order No"),
          React.createElement(Text, { style: styles.tableHeaderText }, "Item Description"),
          React.createElement(Text, { style: styles.tableHeaderText }, "Qty"),
          React.createElement(Text, { style: styles.tableHeaderText }, "Unit Price"),
          React.createElement(Text, { style: styles.tableHeaderText }, "Total")
        ),
        
        // Items rows
        ...safeData.items.map((item, index) => {
          // Match frontend template logic exactly: item.clientOrderNumber || data.clientOrderNumber || ""
          const clientOrderNumToDisplay = item?.clientOrderNumber || safeData?.clientOrderNumber || "";
          
          console.log(`[InvoiceTemplateServer] Item ${index + 1}:`);
          console.log('  - item.clientOrderNumber:', item?.clientOrderNumber);
          console.log('  - safeData.clientOrderNumber:', safeData?.clientOrderNumber);
          console.log('  - Final display value:', clientOrderNumToDisplay);
          
          return React.createElement(View, { 
            key: index, 
            style: index % 2 === 0 ? styles.tableRow : styles.tableRowAlt 
          },
            React.createElement(Text, { style: styles.tableCell }, String(index + 1)),
            React.createElement(Text, { style: styles.tableCell }, String(clientOrderNumToDisplay || '')),
            React.createElement(Text, { style: styles.tableCellLeft },
              safeString(item.name, 'Item'),
              safeString(item.description) && `\nStyle: ${safeString(item.description)}`,
              safeString(item.fabric) && `\nFabric: ${safeString(item.fabric)}`,
              safeNumber(item.fabricMeters, 0) > 0 && ` (${safeNumber(item.fabricMeters, 0)}m)`,
              safeNumber(item.alteration, 0) > 0 && `\nAlteration: ₹${safeNumber(item.alteration, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
              safeNumber(item.handwork, 0) > 0 && `\nHandwork: ₹${safeNumber(item.handwork, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
              safeNumber(item.otherCharges, 0) > 0 && `\nOther Charges: ₹${safeNumber(item.otherCharges, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
            ),
            React.createElement(Text, { style: styles.tableCell }, safeNumber(item.quantity, 1)),
            React.createElement(Text, { style: styles.tableCell }, safeNumber(item.unitPrice, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })),
            React.createElement(Text, { style: styles.tableCell }, safeNumber(item.totalPrice, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }))
          );
        }),
        
        // Total row
        React.createElement(View, { style: styles.tableTotalRow },
          React.createElement(Text, { style: styles.tableTotalText }, ""),
          React.createElement(Text, { style: styles.tableTotalText }, ""),
          React.createElement(Text, { style: styles.tableTotalText }, "Total"),
          React.createElement(Text, { style: styles.tableTotalText }, ""),
          React.createElement(Text, { style: styles.tableTotalText }, ""),
          React.createElement(Text, { style: styles.tableTotalText }, safeData.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }))
        )
      ),

      // Pricing Summary
      React.createElement(View, { style: styles.pricingSection },
        React.createElement(View, { style: styles.pricingLeft },
          React.createElement(View, { style: styles.pricingBox },
            React.createElement(Text, { style: styles.sectionTitle }, "Payment Information"),
            React.createElement(Text, { style: styles.sectionContent },
              `Bank: ${safeData.bankName}`,
              '\nAccount: ', safeData.accountName,
              '\nAccount No: ', safeData.accountNumber,
              '\nIFSC: ', safeData.ifscCode
            ),
            // --- QR code rendering ---
            resolvedQrCodeImage ? 
              React.createElement(Image, { style: styles.qrImage, src: resolvedQrCodeImage }) : 
              React.createElement(Text, { style: { fontSize: 7, color: '#999', marginTop: 8, textAlign: 'center' } }, 'QR Code not available')
          )
        ),
        
        React.createElement(View, { style: styles.pricingRight },
          React.createElement(View, { style: styles.pricingBox },
            React.createElement(Text, { style: styles.sectionTitle }, "Pricing Summary"),
            
            React.createElement(View, { style: styles.pricingRow },
              React.createElement(Text, { style: styles.pricingLabel }, "Subtotal:"),
              React.createElement(Text, { style: styles.pricingValue }, safeData.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }))
            ),
            
            // Additional Charges Breakdown
            (() => {
              const totalAlteration = safeData.items.reduce((sum, item) => sum + safeNumber(item.alteration, 0), 0);
              const totalHandwork = safeData.items.reduce((sum, item) => sum + safeNumber(item.handwork, 0), 0);
              const totalOtherCharges = safeData.items.reduce((sum, item) => sum + safeNumber(item.otherCharges, 0), 0);
              
              return [
                totalAlteration > 0 && React.createElement(View, { key: 'alteration', style: styles.pricingRow },
                  React.createElement(Text, { style: styles.pricingLabel }, "Total Alteration:"),
                  React.createElement(Text, { style: styles.pricingValue }, totalAlteration.toLocaleString('en-IN', { minimumFractionDigits: 2 }))
                ),
                totalHandwork > 0 && React.createElement(View, { key: 'handwork', style: styles.pricingRow },
                  React.createElement(Text, { style: styles.pricingLabel }, "Total Handwork:"),
                  React.createElement(Text, { style: styles.pricingValue }, totalHandwork.toLocaleString('en-IN', { minimumFractionDigits: 2 }))
                ),
                totalOtherCharges > 0 && React.createElement(View, { key: 'otherCharges', style: styles.pricingRow },
                  React.createElement(Text, { style: styles.pricingLabel }, "Total Other Charges:"),
                  React.createElement(Text, { style: styles.pricingValue }, totalOtherCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 }))
                )
              ].filter(Boolean);
            })(),
            
            React.createElement(View, { style: styles.pricingRow },
              React.createElement(Text, { style: styles.pricingLabel }, 
                `Discount ${safeData.discountType === 'percentage' && safeData.discountValue > 0 ? `(${safeData.discountValue}%)` : ''}:`
              ),
              React.createElement(Text, { style: styles.pricingValue },
                safeData.discountAmount > 0 ? `-${safeData.discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '0.00'
              )
            ),
            
            React.createElement(View, { style: styles.pricingRow },
              React.createElement(Text, { style: styles.pricingLabel }, "Taxable Amount:"),
              React.createElement(Text, { style: styles.pricingValue }, safeData.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }))
            ),
            
            React.createElement(View, { style: styles.pricingRow },
              React.createElement(Text, { style: styles.pricingLabel }, `GST (${safeData.taxRate}%):`),
              React.createElement(Text, { style: styles.pricingValue }, safeData.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }))
            ),
            
            React.createElement(View, { style: styles.pricingRow },
              React.createElement(Text, { style: styles.pricingLabel }, "Total Amount:"),
              React.createElement(Text, { style: styles.pricingValue }, safeData.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }))
            ),
            
            (safeData.paidAmount > 0 || safeData.advancePayment > 0) && 
              React.createElement(View, { style: styles.pricingRow },
                React.createElement(Text, { style: styles.pricingLabel }, "Paid Payment:"),
                React.createElement(Text, { style: styles.pricingValue }, (safeData.paidAmount || safeData.advancePayment || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }))
              ),
            
            (safeData.pendingAmount > 0 || (safeData.balanceAmount > 0 && (safeData.paidAmount || safeData.advancePayment) > 0)) &&
              React.createElement(View, { style: styles.pricingRow },
                React.createElement(Text, { style: styles.pricingLabel }, "Pending Payment:"),
                React.createElement(Text, { style: styles.pricingValue }, (safeData.pendingAmount || safeData.balanceAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }))
              ),
            
            React.createElement(View, { style: styles.totalRow },
              React.createElement(Text, { style: styles.totalLabel },
                ((safeData.paidAmount || safeData.advancePayment) > 0 && (safeData.pendingAmount > 0 || safeData.balanceAmount > 0)) ? 'Balance Amount:' : 'Total Amount:'
              ),
              React.createElement(Text, { style: styles.totalValue },
                (safeData.paidAmount || safeData.advancePayment) > 0 
                  ? (safeData.pendingAmount || safeData.balanceAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })
                  : safeData.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })
              )
            ),
            
            // Amount in words
            React.createElement(Text, { style: styles.amountWords },
              `Amount in words: ${amountToWordsINR((safeData.paidAmount || safeData.advancePayment) > 0 ? (safeData.pendingAmount || safeData.balanceAmount || 0) : safeData.totalAmount)}`
            )
          )
        )
      ),

      // Footer
      React.createElement(View, { style: styles.footer },
        safeData.companyCIN && 
          React.createElement(View, { style: styles.cinRow },
            React.createElement(Text, { style: styles.cinText }, `CIN: ${safeData.companyCIN}`)
          ),
        
        React.createElement(View, { style: styles.footerRow },
          React.createElement(View, { style: styles.termsSection },
            React.createElement(Text, { style: styles.termsTitle }, "Terms & Conditions"),
            React.createElement(Text, { style: styles.termsContent },
              "1. Payment within 30 days of invoice date.",
              '\n2. Late payments may incur interest charges.',
              '\n3. Goods once delivered are non-returnable.',
              '\n4. Disputes subject to local court jurisdiction.',
              safeData.paymentNotes && `\n\nPayment Notes: ${safeData.paymentNotes}`,
              safeData.notes && `\n\nAdditional Notes: ${safeData.notes}`
            )
          ),
          React.createElement(View, { style: styles.signatureSection },
            React.createElement(Text, { style: { fontSize: 9, fontWeight: 'bold' } }, `For, ${safeData.companyName}`),
            React.createElement(Text, { style: { height: 36 } }, ""),
            React.createElement(Text, { style: { fontSize: 9, fontWeight: 'bold' } }, "Authorized Signatory")
          )
        ),
        
        React.createElement(Text, { style: styles.machineNote }, "This is a computer generated invoice. No stamp or signature required."),
        
        React.createElement(Link, { src: "https://jmdstitching.com/track-order", style: styles.footerLink },
          "Track your order: https://jmdstitching.com/track-order"
        ),
        React.createElement(View, { style: { marginTop: 8, flexDirection: 'row', justifyContent: 'center' } },
          React.createElement(Link, { src: "https://facebook.com/jmdstitching", style: styles.footerLink }, "Facebook"),
          React.createElement(Text, null, "  |  "),
          React.createElement(Link, { src: "https://instagram.com/jmdstitching", style: styles.footerLink }, "Instagram"),
          React.createElement(Text, null, "  |  "),
          React.createElement(Link, { src: "https://x.com/jmdstitching", style: styles.footerLink }, "X (Twitter)")
        )
      )
    )
  );
};

export default InvoiceDocumentServer;
