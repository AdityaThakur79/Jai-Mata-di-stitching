import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

Font.register({
  family: 'Roboto-Bold',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Roboto',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    borderBottom: '2 solid #E5E7EB',
    paddingBottom: 20,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  companyInfo: {
    flexDirection: 'column',
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  companyTagline: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
  },
  companyDetails: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4,
  },
  invoiceSection: {
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  invoiceNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  invoiceDetails: {
    fontSize: 10,
    color: '#374151',
    textAlign: 'right',
  },
  amountDueBar: {
    backgroundColor: '#3B82F6',
    padding: 15,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountDueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  amountDueValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  leftColumn: {
    flex: 1,
    marginRight: 20,
  },
  rightColumn: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4,
    marginBottom: 5,
  },
  clientInfo: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  itemsTable: {
    marginBottom: 30,
  },
  tableHeader: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    padding: 10,
  },
  tableHeaderText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottom: '1 solid #E5E7EB',
  },
  tableRowAlt: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderBottom: '1 solid #E5E7EB',
  },
  tableCell: {
    fontSize: 9,
    color: '#374151',
    flex: 1,
    textAlign: 'center',
  },
  tableCellLeft: {
    fontSize: 9,
    color: '#374151',
    flex: 1,
    textAlign: 'left',
  },
  tableTotalRow: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#EFF6FF',
    borderTop: '2 solid #3B82F6',
  },
  tableTotalText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  pricingSection: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  pricingLeft: {
    flex: 1,
    marginRight: 20,
  },
  pricingRight: {
    flex: 1,
  },
  pricingBox: {
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 8,
    border: '1 solid #E5E7EB',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  pricingLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  pricingValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTop: '2 solid #3B82F6',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTop: '1 solid #E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  termsSection: {
    flex: 1,
    marginRight: 20,
  },
  termsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  termsContent: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.4,
  },
  signatureSection: {
    alignItems: 'center',
  },
  signatureLine: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#6B7280',
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 9,
    color: '#374151',
  },
});

const InvoiceDocument = (data) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoSection}>
          <Image style={styles.logo} src={data.logo} />
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{data.companyName}</Text>
            <Text style={styles.companyTagline}>STITCHING MADE PERFECT</Text>
            <Text style={styles.companyDetails}>
              {data.companyAddress}
              {'\n'}Phone: {data.companyPhone}
              {'\n'}Email: {data.companyEmail}
              {'\n'}GST: {data.companyGST} | PAN: {data.companyPAN}
            </Text>
          </View>
        </View>
        <View style={styles.invoiceSection}>
          <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
          <Text style={styles.invoiceNumber}>{data.invoiceNumber}</Text>
          <Text style={styles.invoiceDetails}>
            Issue Date: {data.invoiceDate}
            {'\n'}Due Date: {data.dueDate}
            {'\n'}Original for Recipient
          </Text>
        </View>
      </View>

      {/* Amount Due Bar */}
      <View style={styles.amountDueBar}>
        <Text style={styles.amountDueText}>Amount Due:</Text>
        <Text style={styles.amountDueValue}>₹{data.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Client Information */}
        <View style={styles.leftColumn}>
          <View style={styles.clientInfo}>
            <Text style={styles.sectionTitle}>Client Information</Text>
            <Text style={styles.sectionSubtitle}>Bill To</Text>
            <Text style={styles.sectionContent}>
              {data.clientName}
              {'\n'}{data.clientAddress}
              {'\n'}{data.clientCity}, {data.clientState} - {data.clientPincode}
              {'\n'}Mobile: {data.clientMobile}
              {data.clientEmail && `\nEmail: ${data.clientEmail}`}
            </Text>
          </View>
        </View>

        {/* Invoice Details */}
        <View style={styles.rightColumn}>
          <View style={styles.pricingBox}>
            <Text style={styles.sectionTitle}>Invoice Details</Text>
            <Text style={styles.sectionContent}>
              Invoice Number: {data.invoiceNumber}
              {'\n'}Invoice Date: {data.invoiceDate}
              {'\n'}Due Date: {data.dueDate}
              {'\n'}Payment Terms: 30 Days
            </Text>
          </View>
        </View>
      </View>

      {/* Items Table */}
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
            <Text style={styles.tableCell}>₹{item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            <Text style={styles.tableCell}>₹{item.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
          </View>
        ))}
        
        <View style={styles.tableTotalRow}>
          <Text style={styles.tableTotalText}></Text>
          <Text style={styles.tableTotalText}>Total</Text>
          <Text style={styles.tableTotalText}></Text>
          <Text style={styles.tableTotalText}></Text>
          <Text style={styles.tableTotalText}>₹{data.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
        </View>
      </View>

      {/* Pricing Summary */}
      <View style={styles.pricingSection}>
        <View style={styles.pricingLeft}>
          <View style={styles.pricingBox}>
            <Text style={styles.sectionTitle}>Payment Information</Text>
            <Text style={styles.sectionContent}>
              Bank: ICICI Bank
              {'\n'}Account: JMD STITCHING PRIVATE LIMITED
              {'\n'}Account No: 1234567890
              {'\n'}IFSC: ICIC0001234
              {'\n'}UPI: {data.companyPhone}@okbizaxis
            </Text>
          </View>
        </View>
        
        <View style={styles.pricingRight}>
          <View style={styles.pricingBox}>
            <Text style={styles.sectionTitle}>Pricing Summary</Text>
            
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Subtotal:</Text>
              <Text style={styles.pricingValue}>₹{data.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
            
            {data.discountAmount > 0 && (
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Discount:</Text>
                <Text style={styles.pricingValue}>-₹{data.discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
              </View>
            )}
            
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Taxable Amount:</Text>
              <Text style={styles.pricingValue}>₹{data.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
            
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>GST ({data.taxRate}%):</Text>
              <Text style={styles.pricingValue}>₹{data.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>₹{data.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Terms & Conditions</Text>
          <Text style={styles.termsContent}>
            1. Payment should be made within 30 days of invoice date.
            {'\n'}2. Late payments may incur interest charges.
            {'\n'}3. Goods once delivered will not be taken back.
            {'\n'}4. All disputes subject to jurisdiction of local courts.
          </Text>
        </View>
        
        <View style={styles.signatureSection}>
          <Text style={styles.signatureLine}>Signature</Text>
          <Text style={styles.signatureText}>For, {data.companyName}</Text>
          <Text style={styles.signatureText}>Authorized Signatory</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default InvoiceDocument;
