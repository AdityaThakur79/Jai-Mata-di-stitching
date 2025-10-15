import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';

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

const InvoiceDocumentServer = (data) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.logoSection}>
          {data.logo || data.logoUrl ? (
            <Image style={styles.logoImage} src={data.logo || data.logoUrl} />
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

      <View style={styles.amountDueBar}>
        <Text style={styles.amountDueText}>Amount Due:</Text>
        <Text style={styles.amountDueValue}>{`₹${Number(data.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}</Text>
      </View>

      <View style={styles.content}>
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
        <View style={styles.col}>
          {data.shippingDetails && (
            <View style={[styles.shippingSection, styles.cardFixed]}>
              <Text style={styles.shippingTitle}>Shipping Information</Text>
              <Text style={styles.shippingSubtitle}>Ship To</Text>
              <Text style={styles.shippingContent}>
                {data.shippingDetails.shippingAddress && `${data.shippingDetails.shippingAddress}\n`}
                {data.shippingDetails.shippingCity && data.shippingDetails.shippingState && `${data.shippingDetails.shippingCity}, ${data.shippingDetails.shippingState}`}
                {data.shippingDetails.shippingPincode && ` - ${data.shippingDetails.shippingPincode}`}
                {data.shippingDetails.shippingPhone && `\nPhone: ${data.shippingDetails.shippingPhone}`}
                {data.shippingDetails.shippingMethod && `\nMethod: ${String(data.shippingDetails.shippingMethod).replace('_', ' ').toUpperCase()}`}
                {data.shippingDetails.deliveryStatus && `\nStatus: ${String(data.shippingDetails.deliveryStatus).replace('_', ' ').toUpperCase()}`}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.colGap} />
        <View style={styles.col}>
          <View style={[styles.pricingBox, styles.cardFixed]}>
            <Text style={styles.sectionTitle}>Invoice Information</Text>
            <Text style={styles.sectionContent}>
              Invoice Number: {(data.invoiceNumber || '').replace('-BILL-', '-')}
              {'\n'}Invoice Date: {data.invoiceDate}
              {'\n'}Due Date: {data.dueDate}
              {data.orderType && (`\nOrder Type: ${String(data.orderType).replace('_', ' ')}`)}
              {'\n'}Payment Status: {(data.paymentStatus || 'PENDING').toUpperCase()}
              {data.paymentMethod && `\nPayment Method: ${data.paymentMethod}`}
              {'\n'}Payment Terms: 30 Days
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.itemsTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>S.No</Text>
          <Text style={styles.tableHeaderText}>Item Description</Text>
          <Text style={styles.tableHeaderText}>Qty</Text>
          <Text style={styles.tableHeaderText}>Unit Price</Text>
          <Text style={styles.tableHeaderText}>Total</Text>
        </View>
        {data.items.map((item, index) => (
          <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
            <Text style={styles.tableCell}>{index + 1}</Text>
            <Text style={styles.tableCellLeft}>
              {item.name}
              {item.description && `\nStyle: ${item.description}`}
              {item.fabric && `\nFabric: ${item.fabric}`}
              {item.fabricMeters > 0 && ` (${item.fabricMeters}m)`}
            </Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCell}>{Number(item.unitPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            <Text style={styles.tableCell}>{Number(item.totalPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
          </View>
        ))}
        <View style={styles.tableTotalRow}>
          <Text style={styles.tableTotalText}></Text>
          <Text style={styles.tableTotalText}>Total</Text>
          <Text style={styles.tableTotalText}></Text>
          <Text style={styles.tableTotalText}></Text>
          <Text style={styles.tableTotalText}>{Number(data.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
        </View>
      </View>

      <View style={styles.pricingSection}>
        <View style={styles.pricingLeft}>
          <View style={styles.pricingBox}>
            <Text style={styles.sectionTitle}>Payment Information</Text>
            <Text style={styles.sectionContent}>
              Bank: {data.bankName || ''}
              {'\n'}Account: {data.accountName || 'JMD STITCHING PRIVATE LIMITED'}
              {'\n'}Account No: {data.accountNumber || ''}
              {'\n'}IFSC: {data.ifscCode || ''}
            </Text>
          </View>
        </View>
        <View style={styles.pricingRight}>
          <View style={styles.pricingBox}>
            <Text style={styles.sectionTitle}>Pricing Summary</Text>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Subtotal:</Text>
              <Text style={styles.pricingValue}>{Number(data.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Discount {data.discountType === 'percentage' && data.discountValue > 0 ? `(${data.discountValue}%)` : ''}:</Text>
              <Text style={styles.pricingValue}>{Number(data.discountAmount || 0) > 0 ? `-${Number(data.discountAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '0.00'}</Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Taxable Amount:</Text>
              <Text style={styles.pricingValue}>{Number(data.taxableAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>GST ({(data.taxRate ?? 5)}%):</Text>
              <Text style={styles.pricingValue}>{Number(data.taxAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
            {data.shippingDetails?.shippingCost > 0 && (
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Shipping Cost:</Text>
                <Text style={styles.pricingValue}>{Number(data.shippingDetails.shippingCost).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
              </View>
            )}
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Total Amount:</Text>
              <Text style={styles.pricingValue}>{Number(data.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
            {Number(data.advancePayment || 0) > 0 && (
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Advance Payment:</Text>
                <Text style={styles.pricingValue}>-{Number(data.advancePayment).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{Number(data.advancePayment || 0) > 0 ? 'Balance Amount:' : 'Total Amount:'}</Text>
              <Text style={styles.totalValue}>{(Number(data.advancePayment || 0) > 0 ? Number(data.balanceAmount || 0) : Number(data.totalAmount || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <View style={styles.termsSection}>
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>
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
      </View>
    </Page>
  </Document>
);

export default InvoiceDocumentServer;


