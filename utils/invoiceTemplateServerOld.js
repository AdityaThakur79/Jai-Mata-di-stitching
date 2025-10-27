import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';
import { safeString, safeNumber, safeDate, safeArray, getLogoBase64 } from './imageUtils.js';

// NOTE: This is a server-safe replica of client/src/utils/invoiceTemplate.jsx
// It intentionally avoids hooks and browser-only APIs. Pass logoUrl or logo (base64) in data.

const styles = StyleSheet.create({
  page: { flexDirection: 'column', backgroundColor: '#FFFFFF', padding: 16, paddingTop: 0, fontFamily: 'Helvetica', fontSize: 9 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15, borderBottom: '1 solid #f77f2f', paddingBottom: 10, backgroundColor: '#FAFAFA', padding: 8, borderRadius: 4 },
  logoSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  logo: { width: 60, height: 60, marginRight: 10, backgroundColor: '#f77f2f', borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  logoImage: { width: 60, height: 60, marginRight: 10, borderRadius: 30 },
  logoText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  companyInfo: { flexDirection: 'column', marginLeft: 6, maxWidth: '68%' },
  companyName: { fontSize: 14, fontWeight: 'bold', color: '#000000', marginBottom: 4, textTransform: 'uppercase' },
  companyTagline: { fontSize: 7, color: '#f77f2f', fontWeight: 'bold', marginBottom: 6, fontStyle: 'italic' },
  companyDetails: { fontSize: 8, color: '#000000', lineHeight: 1.3, fontWeight: 'bold' },
  invoiceSection: { alignItems: 'center', backgroundColor: '#FFFFFF', padding: 6, borderRadius: 4, border: '1 solid #f77f2f', minWidth: 130 },
  invoiceTitle: { fontSize: 14, fontWeight: 'bold', color: '#f77f2f', marginBottom: 4, textAlign: 'center' },
  invoiceNumber: { fontSize: 10, fontWeight: 'bold', color: '#000000', marginBottom: 4, textAlign: 'center' },
  amountDueBar: { backgroundColor: '#f77f2f', padding: 6, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amountDueText: { color: '#FFFFFF', fontSize: 9, fontWeight: 'bold' },
  amountDueValue: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  content: { flexDirection: 'row', marginBottom: 15 },
  col: { flex: 1 },
  colGap: { width: 10 },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', color: '#000000', marginBottom: 4 },
  sectionSubtitle: { fontSize: 8, fontWeight: 'bold', color: '#000000', marginBottom: 3 },
  sectionContent: { fontSize: 8, color: '#000000', lineHeight: 1.3, marginBottom: 2 },
  clientInfo: { backgroundColor: '#FFFFFF', padding: 6, borderRadius: 3, marginBottom: 10, border: '1 solid #f77f2f' },
  itemsTable: { marginBottom: 15 },
  tableHeader: { backgroundColor: '#f77f2f', flexDirection: 'row', padding: 5 },
  tableHeaderText: { color: '#FFFFFF', fontSize: 8, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  tableRow: { flexDirection: 'row', padding: 4, borderBottom: '1 solid #E5E7EB' },
  tableRowAlt: { flexDirection: 'row', padding: 4, backgroundColor: '#F9FAFB', borderBottom: '1 solid #E5E7EB' },
  tableCell: { fontSize: 8, color: '#000000', flex: 1, textAlign: 'center' },
  tableCellLeft: { fontSize: 8, color: '#000000', flex: 1, textAlign: 'left' },
  tableTotalRow: { flexDirection: 'row', padding: 4, backgroundColor: '#FEF3E7', borderTop: '1 solid #f77f2f' },
  tableTotalText: { fontSize: 8, fontWeight: 'bold', color: '#000000', flex: 1, textAlign: 'center' },
  pricingSection: { flexDirection: 'row', marginBottom: 15 },
  pricingLeft: { flex: 1, marginRight: 10 },
  pricingRight: { flex: 1 },
  pricingBox: { backgroundColor: '#F9FAFB', padding: 6, borderRadius: 3, border: '1 solid #f77f2f' },
  pricingRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3, paddingVertical: 1 },
  pricingLabel: { fontSize: 8, color: '#000000', fontWeight: 'bold' },
  pricingValue: { fontSize: 8, fontWeight: 'bold', color: '#000000' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, paddingTop: 5, borderTop: '1 solid #f77f2f', backgroundColor: '#FEF3E7', padding: 5, borderRadius: 3 },
  totalLabel: { fontSize: 9, fontWeight: 'bold', color: '#000000' },
  totalValue: { fontSize: 9, fontWeight: 'bold', color: '#000000' },
  footer: { marginTop: 20, paddingTop: 15, borderTop: '1 solid #f77f2f' },
  cinRow: { marginTop: 4, marginBottom: 6, textAlign: 'center' },
  cinText: { fontSize: 8, color: '#000000', fontWeight: 'bold' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  machineNote: { fontSize: 7, color: '#6B7280', marginTop: 6, textAlign: 'center', fontStyle: 'italic' },
  footerLink: { fontSize: 8, color: '#f77f2f', marginTop: 4, textAlign: 'center', textDecoration: 'none', fontWeight: 'bold' },
  termsSection: { flex: 1, marginRight: 15 },
  termsTitle: { fontSize: 9, fontWeight: 'bold', color: '#000000', marginBottom: 3 },
  termsContent: { fontSize: 7, color: '#000000', lineHeight: 1.3 },
  signatureSection: { alignItems: 'center', marginTop: 8 },
  shippingSection: { backgroundColor: '#FFFFFF', padding: 6, borderRadius: 3, marginBottom: 10, border: '1 solid #f77f2f', alignSelf: 'center', width: '90%' },
  cardFixed: { height: 120 },
  shippingTitle: { fontSize: 10, fontWeight: 'bold', color: '#000000', marginBottom: 4 },
  shippingSubtitle: { fontSize: 8, fontWeight: 'bold', color: '#000000', marginBottom: 3 },
  shippingContent: { fontSize: 8, color: '#000000', lineHeight: 1.3, marginBottom: 2 },
});

const InvoiceDocumentServer = (data) => {
  // Server-safe version - no hooks, no browser APIs
  // Use base64 logo from data.logo or get from file system
  const logoBase64 = data.logo || getLogoBase64();
  
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
    clientName: safeString(data.clientName, 'Client Name'),
    clientAddress: safeString(data.clientAddress, 'Client Address'),
    clientCity: safeString(data.clientCity, 'City'),
    clientState: safeString(data.clientState, 'State'),
    clientPincode: safeString(data.clientPincode, '000000'),
    clientMobile: safeString(data.clientMobile, '0000000000'),
    clientEmail: safeString(data.clientEmail, ''),
    gstin: safeString(data.gstin, ''),
    items: safeArray(data.items, []),
    subtotal: safeNumber(data.subtotal, 0),
    discountType: safeString(data.discountType, 'percentage'),
    discountValue: safeNumber(data.discountValue, 0),
    discountAmount: safeNumber(data.discountAmount, 0),
    taxableAmount: safeNumber(data.taxableAmount, 0),
    taxRate: safeNumber(data.taxRate, 18),
    taxAmount: safeNumber(data.taxAmount, 0),
    totalAmount: safeNumber(data.totalAmount, 0),
    advancePayment: safeNumber(data.advancePayment, 0),
    balanceAmount: safeNumber(data.balanceAmount, 0),
    paymentStatus: safeString(data.paymentStatus, 'pending'),
    paymentMethod: safeString(data.paymentMethod, ''),
    paymentNotes: safeString(data.paymentNotes, ''),
    notes: safeString(data.notes, ''),
    shippingDetails: data.shippingDetails || null
  };

  return React.createElement(Document, null,
    React.createElement(Page, { size: "A4", style: styles.page },
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

      React.createElement(View, { style: styles.amountDueBar },
        React.createElement(Text, { style: styles.amountDueText }, "Amount Due:"),
        React.createElement(Text, { style: styles.amountDueValue }, `₹${safeData.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`)
      ),

      React.createElement(View, { style: styles.content },
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
        React.createElement(View, { style: styles.col },
          data.shippingDetails && 
            React.createElement(View, { style: [styles.shippingSection, styles.cardFixed] },
              React.createElement(Text, { style: styles.shippingTitle }, "Shipping Information"),
              React.createElement(Text, { style: styles.shippingSubtitle }, "Ship To"),
              React.createElement(Text, { style: styles.shippingContent },
                data.shippingDetails.shippingAddress && `${data.shippingDetails.shippingAddress}\n`,
                data.shippingDetails.shippingCity && data.shippingDetails.shippingState && `${data.shippingDetails.shippingCity}, ${data.shippingDetails.shippingState}`,
                data.shippingDetails.shippingPincode && ` - ${data.shippingDetails.shippingPincode}`,
                data.shippingDetails.shippingPhone && `\nPhone: ${data.shippingDetails.shippingPhone}`,
                data.shippingDetails.shippingMethod && `\nMethod: ${String(data.shippingDetails.shippingMethod).replace('_', ' ').toUpperCase()}`,
                data.shippingDetails.deliveryStatus && `\nStatus: ${String(data.shippingDetails.deliveryStatus).replace('_', ' ').toUpperCase()}`
              )
            )
        ),
        React.createElement(View, { style: styles.colGap }),
        React.createElement(View, { style: styles.col },
          React.createElement(View, { style: [styles.pricingBox, styles.cardFixed] },
            React.createElement(Text, { style: styles.sectionTitle }, "Invoice Information"),
            React.createElement(Text, { style: styles.sectionContent },
              'Invoice Number: ', (data.invoiceNumber || '').replace('-BILL-', '-'),
              '\nInvoice Date: ', data.invoiceDate,
              '\nDue Date: ', data.dueDate,
              data.orderType && (`\nOrder Type: ${String(data.orderType).replace('_', ' ')}`),
              '\nPayment Status: ', (data.paymentStatus || 'PENDING').toUpperCase(),
              data.paymentMethod && `\nPayment Method: ${data.paymentMethod}`,
              '\nPayment Terms: 30 Days'
            )
          )
        )
      ),

      React.createElement(View, { style: styles.itemsTable },
        React.createElement(View, { style: styles.tableHeader },
          React.createElement(Text, { style: styles.tableHeaderText }, "S.No"),
          React.createElement(Text, { style: styles.tableHeaderText }, "Item Description"),
          React.createElement(Text, { style: styles.tableHeaderText }, "Qty"),
          React.createElement(Text, { style: styles.tableHeaderText }, "Unit Price"),
          React.createElement(Text, { style: styles.tableHeaderText }, "Total")
        ),
        data.items.map((item, index) =>
          React.createElement(View, { key: index, style: index % 2 === 0 ? styles.tableRow : styles.tableRowAlt },
            React.createElement(Text, { style: styles.tableCell }, index + 1),
            React.createElement(Text, { style: styles.tableCellLeft },
              item.name,
              item.description && `\nStyle: ${item.description}`,
              item.fabric && `\nFabric: ${item.fabric}`,
              item.fabricMeters > 0 && ` (${item.fabricMeters}m)`
            ),
            React.createElement(Text, { style: styles.tableCell }, item.quantity),
            React.createElement(Text, { style: styles.tableCell }, Number(item.unitPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })),
            React.createElement(Text, { style: styles.tableCell }, Number(item.totalPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }))
          )
        ),
        React.createElement(View, { style: styles.tableTotalRow },
          React.createElement(Text, { style: styles.tableTotalText }),
          React.createElement(Text, { style: styles.tableTotalText }, "Total"),
          React.createElement(Text, { style: styles.tableTotalText }),
          React.createElement(Text, { style: styles.tableTotalText }),
          React.createElement(Text, { style: styles.tableTotalText }, Number(data.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }))
        )
      ),

      React.createElement(View, { style: styles.pricingSection },
        React.createElement(View, { style: styles.pricingLeft },
          React.createElement(View, { style: styles.pricingBox },
            React.createElement(Text, { style: styles.sectionTitle }, "Payment Information"),
            React.createElement(Text, { style: styles.sectionContent },
              'Bank: ', data.bankName || '',
              '\nAccount: ', data.accountName || 'JMD STITCHING PRIVATE LIMITED',
              '\nAccount No: ', data.accountNumber || '',
              '\nIFSC: ', data.ifscCode || ''
            )
          )
        ),
        React.createElement(View, { style: styles.pricingRight },
          React.createElement(View, { style: styles.pricingBox },
            React.createElement(Text, { style: styles.sectionTitle }, "Pricing Summary"),
            React.createElement(View, { style: styles.pricingRow },
              React.createElement(Text, { style: styles.pricingLabel }, "Subtotal:"),
              React.createElement(Text, { style: styles.pricingValue }, Number(data.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }))
            ),
            React.createElement(View, { style: styles.pricingRow },
              React.createElement(Text, { style: styles.pricingLabel }, `Discount ${data.discountType === 'percentage' && data.discountValue > 0 ? `(${data.discountValue}%)` : ''}:`),
              React.createElement(Text, { style: styles.pricingValue }, Number(data.discountAmount || 0) > 0 ? `-${Number(data.discountAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '0.00')
            ),
            React.createElement(View, { style: styles.pricingRow },
              React.createElement(Text, { style: styles.pricingLabel }, "Taxable Amount:"),
              React.createElement(Text, { style: styles.pricingValue }, Number(data.taxableAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }))
            ),
            React.createElement(View, { style: styles.pricingRow },
              React.createElement(Text, { style: styles.pricingLabel }, `GST (${data.taxRate ?? 5}%):`),
              React.createElement(Text, { style: styles.pricingValue }, Number(data.taxAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }))
            ),
            data.shippingDetails?.shippingCost > 0 && 
              React.createElement(View, { style: styles.pricingRow },
                React.createElement(Text, { style: styles.pricingLabel }, "Shipping Cost:"),
                React.createElement(Text, { style: styles.pricingValue }, Number(data.shippingDetails.shippingCost).toLocaleString('en-IN', { minimumFractionDigits: 2 }))
              ),
            React.createElement(View, { style: styles.pricingRow },
              React.createElement(Text, { style: styles.pricingLabel }, "Total Amount:"),
              React.createElement(Text, { style: styles.pricingValue }, Number(data.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }))
            ),
            Number(data.advancePayment || 0) > 0 && 
              React.createElement(View, { style: styles.pricingRow },
                React.createElement(Text, { style: styles.pricingLabel }, "Advance Payment:"),
                React.createElement(Text, { style: styles.pricingValue }, `-${Number(data.advancePayment).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`)
              ),
            React.createElement(View, { style: styles.totalRow },
              React.createElement(Text, { style: styles.totalLabel }, Number(data.advancePayment || 0) > 0 ? 'Balance Amount:' : 'Total Amount:'),
              React.createElement(Text, { style: styles.totalValue }, (Number(data.advancePayment || 0) > 0 ? Number(data.balanceAmount || 0) : Number(data.totalAmount || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 }))
            )
          )
        )
      ),

      React.createElement(View, { style: styles.footer },
        React.createElement(View, { style: styles.footerRow },
          React.createElement(View, { style: styles.termsSection },
            React.createElement(Text, { style: styles.sectionTitle }, "Terms & Conditions"),
            React.createElement(Text, { style: styles.termsContent },
              '1. Payment within 30 days of invoice date.',
              '\n2. Late payments may incur interest charges.',
              '\n3. Goods once delivered are non-returnable.',
              '\n4. Disputes subject to local court jurisdiction.',
              data.paymentNotes && `\n\nPayment Notes: ${data.paymentNotes}`,
              data.notes && `\n\nAdditional Notes: ${data.notes}`
            )
          ),
          React.createElement(View, { style: styles.signatureSection },
            React.createElement(Text, { style: { fontSize: 9, fontWeight: 'bold' } }, `For, ${data.companyName}`),
            React.createElement(Text, { style: { height: 36 } }),
            React.createElement(Text, { style: { fontSize: 9, fontWeight: 'bold' } }, "Authorized Signatory")
          )
        ),
        React.createElement(Text, { style: styles.machineNote }, "This is a computer generated invoice. No stamp or signature required."),
        React.createElement(Link, { src: "https://jmdstitching.com/track-order", style: styles.footerLink },
          "Track your order: https://jmdstitching.com/track-order"
        )
      )
    )
  );
};

export default InvoiceDocumentServer;
