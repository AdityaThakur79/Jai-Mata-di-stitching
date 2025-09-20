import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

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

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
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
    padding: 10,
    borderRadius: 4,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
    backgroundColor: '#f77f2f',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  companyInfo: {
    flexDirection: 'column',
  },
  companyName: {
    fontSize: 12,
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
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 4,
    border: '1 solid #f77f2f',
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
  leftColumn: {
    flex: 1,
    marginRight: 10,
  },
  rightColumn: {
    flex: 1,
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
    backgroundColor: '#F3F4F6',
    padding: 6,
    borderRadius: 4,
    marginBottom: 10,
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
    borderRadius: 4,
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
  footer: {
    marginTop: 20,
    paddingTop: 15,
    borderTop: '1 solid #f77f2f',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  signatureLine: {
    fontSize: 9,
    fontStyle: 'italic',
    color: '#000000',
    marginBottom: 3,
    fontWeight: 'bold',
  },
  signatureText: {
    fontSize: 7,
    color: '#000000',
    fontWeight: 'bold',
  },
  shippingSection: {
    backgroundColor: '#F3F4F6',
    padding: 6,
    borderRadius: 4,
    marginBottom: 10,
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
});

const InvoiceDocument = (data) => {
  const [logoDataUrl, setLogoDataUrl] = useState(null);
  const [isMounted, setIsMounted] = useState(true);

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
      {/* Header */}
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
        <Text style={styles.amountDueValue}>{data.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
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
          
          {/* Shipping Information */}
          {data.shippingDetails && (
            <View style={styles.shippingSection}>
              <Text style={styles.shippingTitle}>Shipping Information</Text>
              <Text style={styles.shippingSubtitle}>Ship To</Text>
              <Text style={styles.shippingContent}>
                {data.shippingDetails.shippingAddress && `${data.shippingDetails.shippingAddress}\n`}
                {data.shippingDetails.shippingCity && data.shippingDetails.shippingState && 
                  `${data.shippingDetails.shippingCity}, ${data.shippingDetails.shippingState}`}
                {data.shippingDetails.shippingPincode && ` - ${data.shippingDetails.shippingPincode}`}
                {data.shippingDetails.shippingPhone && `\nPhone: ${data.shippingDetails.shippingPhone}`}
                {data.shippingDetails.shippingMethod && `\nMethod: ${data.shippingDetails.shippingMethod.replace('_', ' ').toUpperCase()}`}
                {data.shippingDetails.trackingNumber && `\nTracking: ${data.shippingDetails.trackingNumber}`}
                {data.shippingDetails.deliveryStatus && `\nStatus: ${data.shippingDetails.deliveryStatus.replace('_', ' ').toUpperCase()}`}
                {data.shippingDetails.estimatedDeliveryDate && `\nEst. Delivery: ${new Date(data.shippingDetails.estimatedDeliveryDate).toLocaleDateString()}`}
                {data.shippingDetails.actualDeliveryDate && `\nDelivered: ${new Date(data.shippingDetails.actualDeliveryDate).toLocaleDateString()}`}
                {data.shippingDetails.deliveryPerson && `\nDelivery Person: ${data.shippingDetails.deliveryPerson}`}
                {data.shippingDetails.deliveryNotes && `\nNotes: ${data.shippingDetails.deliveryNotes}`}
              </Text>
            </View>
          )}
        </View>

        {/* Invoice Details */}
        <View style={styles.rightColumn}>
          <View style={styles.pricingBox}>
            <Text style={styles.sectionTitle}>Invoice Details</Text>
            <Text style={styles.sectionContent}>
              Invoice Number: {data.invoiceNumber}
              {'\n'}Invoice Date: {data.invoiceDate}
              {'\n'}Due Date: {data.dueDate}
              {'\n'}Payment Status: {data.paymentStatus?.toUpperCase() || 'PENDING'}
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
          </View>
        </View>
        
        <View style={styles.pricingRight}>
          <View style={styles.pricingBox}>
            <Text style={styles.sectionTitle}>Pricing Summary</Text>
            
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Subtotal:</Text>
              <Text style={styles.pricingValue}>{data.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
            
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
              <Text style={styles.pricingLabel}>GST ({data.taxRate}%):</Text>
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
            
            {data.advancePayment > 0 && (
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Advance Payment:</Text>
                <Text style={styles.pricingValue}>-{data.advancePayment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
              </View>
            )}
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                {data.advancePayment > 0 ? 'Balance Amount:' : 'Total Amount:'}
              </Text>
              <Text style={styles.totalValue}>
                {data.advancePayment > 0 
                  ? data.balanceAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })
                  : data.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })
                }
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
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
          <Text style={styles.signatureLine}>Signature</Text>
          <Text style={styles.signatureText}>For, {data.companyName}</Text>
          <Text style={styles.signatureText}>Authorized Signatory</Text>
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
