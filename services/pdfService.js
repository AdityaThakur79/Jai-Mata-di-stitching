import { v2 as cloudinary } from "cloudinary";
import { pdf } from '@react-pdf/renderer';
import React from 'react';
import InvoiceDocumentServer from '../utils/invoiceTemplateServer.js';
import { getLogoBase64 } from '../utils/imageUtils.js';
import cacheService from './cacheService.js';
import errorService from './errorService.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class PDFService {
  constructor() {
    this.cache = new Map(); // Simple in-memory cache
    this.maxCacheSize = 100;
  }

  /**
   * Generate PDF buffer with caching
   */
  async generatePDFBuffer(invoiceData, useCache = true) {
    const cacheKey = this.generateCacheKey(invoiceData);
    
    // Check cache first
    if (useCache && this.cache.has(cacheKey)) {
      console.log('PDF cache hit for:', cacheKey);
      const cached = this.cache.get(cacheKey);
      // Ensure we return a Buffer, not a PDFDocument
      if (Buffer.isBuffer(cached)) {
        return cached;
      } else {
        // If cached item is not a Buffer, clear it and regenerate
        this.cache.delete(cacheKey);
      }
    }

    try {
      console.log('=== PDF GENERATION DEBUG START ===');
      console.log('Generating PDF for:', invoiceData.invoiceNumber);
      console.log('Invoice data keys:', Object.keys(invoiceData));
      console.log('Logo status:', invoiceData.logo ? 'Present' : 'Missing');
      console.log('Logo length:', invoiceData.logo ? invoiceData.logo.length : 0);
      
      // Debug: Check if InvoiceDocumentServer is a function
      console.log('InvoiceDocumentServer type:', typeof InvoiceDocumentServer);
      console.log('InvoiceDocumentServer is function:', typeof InvoiceDocumentServer === 'function');
      
      // Create the React component
      console.log('Creating InvoiceComponent...');
      let InvoiceComponent;
      try {
        InvoiceComponent = InvoiceDocumentServer(invoiceData);
        console.log('Final logo status:', invoiceData.logo ? 'Present' : 'Missing');
        console.log('InvoiceComponent created successfully');
        console.log('InvoiceComponent type:', typeof InvoiceComponent);
        console.log('InvoiceComponent keys:', InvoiceComponent ? Object.keys(InvoiceComponent) : 'null/undefined');
      } catch (componentError) {
        console.error('Invoice template failed:', componentError.message);
        console.log('Creating fallback simple component...');
        
        // Create a simple fallback component using proper PDF components
        const { Document, Page, Text } = await import('@react-pdf/renderer');
        InvoiceComponent = React.createElement(Document, null,
          React.createElement(Page, { size: 'A4', style: { padding: 30 } },
            React.createElement(Text, { style: { fontSize: 24, marginBottom: 20 } }, 
              `Invoice: ${invoiceData.invoiceNumber || 'N/A'}`
            ),
            React.createElement(Text, { style: { fontSize: 16, marginBottom: 10 } }, 
              `Client: ${invoiceData.clientName || 'N/A'}`
            ),
            React.createElement(Text, { style: { fontSize: 16, marginBottom: 10 } }, 
              `Amount: ₹${invoiceData.totalAmount || 0}`
            ),
            React.createElement(Text, { style: { fontSize: 14, marginTop: 20 } }, 
              `Date: ${invoiceData.invoiceDate || new Date().toLocaleDateString()}`
            )
          )
        );
        console.log('Fallback component created successfully');
      }
      
      // Debug: Check pdf function
      console.log('pdf function type:', typeof pdf);
      console.log('pdf function is function:', typeof pdf === 'function');
      
      // Generate PDF using base64 format for faster generation
      console.log('Creating PDF document...');
      let pdfDoc;
      try {
        pdfDoc = pdf(InvoiceComponent);
        console.log('PDF document created successfully');
        console.log('pdfDoc type:', typeof pdfDoc);
        console.log('pdfDoc constructor:', pdfDoc?.constructor?.name);
        console.log('pdfDoc has toBuffer method:', typeof pdfDoc?.toBuffer === 'function');
      } catch (pdfError) {
        console.error('Error creating PDF document:', pdfError);
        throw pdfError;
      }
      
      // Convert to Buffer using a more reliable approach
      console.log('Converting PDF to buffer...');
      let pdfBuffer;
      try {
        // FIXED: Use toBlob() or toBuffer() instead of toString() - toString() gives base64 string, not raw PDF
        console.log('Using toBlob() approach for raw PDF bytes...');
        const pdfBlob = await pdfDoc.toBlob();
        console.log('PDF blob created, type:', pdfBlob instanceof Blob);
        
        // Convert blob to array buffer then to buffer
        const arrayBuffer = await pdfBlob.arrayBuffer();
        pdfBuffer = Buffer.from(arrayBuffer);
        
        console.log('PDF buffer created successfully');
        console.log('pdfBuffer type:', typeof pdfBuffer);
        console.log('pdfBuffer constructor:', pdfBuffer?.constructor?.name);
        console.log('pdfBuffer is Buffer:', Buffer.isBuffer(pdfBuffer));
        console.log('pdfBuffer length:', pdfBuffer?.length);
        
        // Validate buffer size - should be much larger than 1000 bytes for a real PDF
        if (pdfBuffer.length < 1000) {
          console.warn('PDF buffer is very small, might be corrupted');
          console.log('First 100 bytes:', pdfBuffer.toString('hex').substring(0, 200));
          
          // Try alternative approach
          console.log('Attempting alternative PDF generation...');
          const altBuffer = await this.generateAlternativePDF(invoiceData);
          if (altBuffer && altBuffer.length > 1000) {
            console.log('Alternative PDF generation successful, size:', altBuffer.length);
            pdfBuffer = altBuffer;
          }
        }
        
      } catch (bufferError) {
        console.error('Error converting PDF to buffer:', bufferError);
        
        // Fallback to alternative PDF generation
        console.log('Attempting fallback to alternative PDF generation...');
        const altBuffer = await this.generateAlternativePDF(invoiceData);
        if (altBuffer && altBuffer.length > 1000) {
          console.log('Fallback PDF generation successful, size:', altBuffer.length);
          pdfBuffer = altBuffer;
        } else {
          throw bufferError;
        }
      }
      
      // Additional validation
      if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
        console.error('=== PDF VALIDATION FAILED ===');
        console.error('PDF generation failed - invalid buffer:', {
          pdfBuffer: pdfBuffer,
          type: typeof pdfBuffer,
          isBuffer: Buffer.isBuffer(pdfBuffer),
          length: pdfBuffer?.length,
          constructor: pdfBuffer?.constructor?.name
        });
        throw new Error('PDF generation did not return a valid Buffer');
      }
      
      console.log('=== PDF GENERATION SUCCESS ===');
      console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');
      
      // Cache the result
      if (useCache) {
        this.cacheResult(cacheKey, pdfBuffer);
      }
      
      return pdfBuffer;
    } catch (error) {
      console.error('=== PDF GENERATION ERROR ===');
      console.error('PDF generation failed:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        invoiceData: {
          invoiceNumber: invoiceData?.invoiceNumber,
          clientName: invoiceData?.clientName,
          totalAmount: invoiceData?.totalAmount
        }
      });
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  }

  /**
   * Upload PDF to Cloudinary with retry mechanism
   */
  async uploadPDFToCloudinary(pdfBuffer, billNumber, retries = 3) {
    // Debug: Check what we're receiving
    console.log('PDF Buffer type:', typeof pdfBuffer);
    console.log('PDF Buffer constructor:', pdfBuffer?.constructor?.name);
    console.log('Is Buffer:', Buffer.isBuffer(pdfBuffer));
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Uploading PDF to Cloudinary (attempt ${attempt}/${retries}):`, billNumber);
        
        // For free plan, we need to upload as raw PDF but handle delivery restrictions
        // The key is to upload as raw PDF (which works) but provide alternative access
        const uploaded = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'raw',
              type: 'upload',
              folder: 'invoices',
              public_id: billNumber,
              format: 'pdf',
              use_filename: true,
              unique_filename: false,
              overwrite: true,
            },
            (err, result) => (err ? reject(err) : resolve(result))
          );
          stream.end(pdfBuffer);
        });
        
        console.log('PDF uploaded successfully:', uploaded.secure_url);
        
        // For free plan, we'll provide the raw URL but note it may be restricted
        // Users can still access via Media Library download
        return {
          ...uploaded,
          secure_url: uploaded.secure_url,
          original_url: uploaded.secure_url,
          delivery_format: 'raw',
          freePlanNote: 'PDF may be restricted for public access on free plan. Use Media Library for download.'
        };
      } catch (error) {
        console.error(`Upload attempt ${attempt} failed:`, error.message);
        
        if (attempt === retries) {
          throw new Error(`Failed to upload PDF after ${retries} attempts: ${error.message}`);
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  /**
   * Generate alternative PDF using a simpler approach
   */
  async generateAlternativePDF(invoiceData) {
    try {
      console.log('=== ALTERNATIVE PDF GENERATION ===');
      const { Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer');
      const React = await import('react');
      
      // Create styles
      const styles = StyleSheet.create({
        page: {
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          padding: 30,
        },
        header: {
          fontSize: 24,
          marginBottom: 20,
          textAlign: 'center',
          fontWeight: 'bold',
        },
        section: {
          marginBottom: 15,
        },
        label: {
          fontSize: 12,
          fontWeight: 'bold',
          marginBottom: 5,
        },
        value: {
          fontSize: 14,
          marginBottom: 10,
        },
        table: {
          display: 'table',
          width: 'auto',
          borderStyle: 'solid',
          borderWidth: 1,
          borderRightWidth: 0,
          borderBottomWidth: 0,
        },
        tableRow: {
          margin: 'auto',
          flexDirection: 'row',
        },
        tableCol: {
          width: '25%',
          borderStyle: 'solid',
          borderWidth: 1,
          borderLeftWidth: 0,
          borderTopWidth: 0,
        },
        tableCell: {
          margin: 'auto',
          marginTop: 5,
          fontSize: 10,
        },
      });
      
      // Create a comprehensive PDF document
      const AlternativePDF = React.createElement(Document, null,
        React.createElement(Page, { size: 'A4', style: styles.page },
          // Header
          React.createElement(Text, { style: styles.header }, 'INVOICE'),
          
          // Company Info
          React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.label }, 'Company:'),
            React.createElement(Text, { style: styles.value }, invoiceData.companyName || 'JMD STITCHING PRIVATE LIMITED'),
            React.createElement(Text, { style: styles.label }, 'Address:'),
            React.createElement(Text, { style: styles.value }, invoiceData.companyAddress || ''),
            React.createElement(Text, { style: styles.label }, 'Phone:'),
            React.createElement(Text, { style: styles.value }, invoiceData.companyPhone || ''),
            React.createElement(Text, { style: styles.label }, 'Email:'),
            React.createElement(Text, { style: styles.value }, invoiceData.companyEmail || ''),
            React.createElement(Text, { style: styles.label }, 'GST:'),
            React.createElement(Text, { style: styles.value }, invoiceData.companyGST || ''),
          ),
          
          // Invoice Details
          React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.label }, 'Invoice Number:'),
            React.createElement(Text, { style: styles.value }, invoiceData.invoiceNumber || ''),
            React.createElement(Text, { style: styles.label }, 'Date:'),
            React.createElement(Text, { style: styles.value }, invoiceData.invoiceDate || ''),
            React.createElement(Text, { style: styles.label }, 'Due Date:'),
            React.createElement(Text, { style: styles.value }, invoiceData.dueDate || ''),
          ),
          
          // Client Info
          React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.label }, 'Bill To:'),
            React.createElement(Text, { style: styles.value }, invoiceData.clientName || ''),
            React.createElement(Text, { style: styles.value }, invoiceData.clientAddress || ''),
            React.createElement(Text, { style: styles.value }, `${invoiceData.clientCity || ''}, ${invoiceData.clientState || ''} - ${invoiceData.clientPincode || ''}`),
            React.createElement(Text, { style: styles.value }, `Phone: ${invoiceData.clientMobile || ''}`),
            React.createElement(Text, { style: styles.value }, `Email: ${invoiceData.clientEmail || ''}`),
          ),
          
          // Items Table
          React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.label }, 'Items:'),
            React.createElement(View, { style: styles.table },
              // Table Header
              React.createElement(View, { style: styles.tableRow },
                React.createElement(View, { style: styles.tableCol },
                  React.createElement(Text, { style: styles.tableCell }, 'Item'),
                ),
                React.createElement(View, { style: styles.tableCol },
                  React.createElement(Text, { style: styles.tableCell }, 'Qty'),
                ),
                React.createElement(View, { style: styles.tableCol },
                  React.createElement(Text, { style: styles.tableCell }, 'Price'),
                ),
                React.createElement(View, { style: styles.tableCol },
                  React.createElement(Text, { style: styles.tableCell }, 'Total'),
                ),
              ),
              // Table Rows
              ...(invoiceData.items || []).map((item, index) =>
                React.createElement(View, { key: index, style: styles.tableRow },
                  React.createElement(View, { style: styles.tableCol },
                    React.createElement(Text, { style: styles.tableCell }, item.name || 'Item'),
                  ),
                  React.createElement(View, { style: styles.tableCol },
                    React.createElement(Text, { style: styles.tableCell }, item.quantity || 1),
                  ),
                  React.createElement(View, { style: styles.tableCol },
                    React.createElement(Text, { style: styles.tableCell }, `₹${item.unitPrice || 0}`),
                  ),
                  React.createElement(View, { style: styles.tableCol },
                    React.createElement(Text, { style: styles.tableCell }, `₹${item.totalPrice || 0}`),
                  ),
                )
              ),
            ),
          ),
          
          // Totals
          React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.label }, 'Subtotal:'),
            React.createElement(Text, { style: styles.value }, `₹${invoiceData.subtotal || 0}`),
            React.createElement(Text, { style: styles.label }, 'Tax:'),
            React.createElement(Text, { style: styles.value }, `₹${invoiceData.taxAmount || 0}`),
            React.createElement(Text, { style: styles.label }, 'Total Amount:'),
            React.createElement(Text, { style: styles.value }, `₹${invoiceData.totalAmount || 0}`),
            React.createElement(Text, { style: styles.label }, 'Advance Payment:'),
            React.createElement(Text, { style: styles.value }, `₹${invoiceData.advancePayment || 0}`),
            React.createElement(Text, { style: styles.label }, 'Balance Amount:'),
            React.createElement(Text, { style: styles.value }, `₹${invoiceData.balanceAmount || 0}`),
          ),
        )
      );
      
      // Generate PDF
      const { pdf } = await import('@react-pdf/renderer');
      const pdfDoc = pdf(AlternativePDF);
      
      // FIXED: Use toBlob() instead of toString('base64')
      const pdfBlob = await pdfDoc.toBlob();
      const arrayBuffer = await pdfBlob.arrayBuffer();
      const pdfBuffer = Buffer.from(arrayBuffer);
      
      console.log('Alternative PDF generated successfully, size:', pdfBuffer.length);
      return pdfBuffer;
      
    } catch (error) {
      console.error('Alternative PDF generation failed:', error.message);
      return null;
    }
  }

  /**
   * Generate PDF in base64 format for faster processing
   */
  async generatePDFBase64(invoiceData) {
    try {
      console.log('=== BASE64 PDF GENERATION DEBUG START ===');
      console.log('Generating PDF in base64 format for:', invoiceData.invoiceNumber);
      
      // Create the React component
      console.log('Creating InvoiceComponent for base64...');
      let InvoiceComponent;
      try {
        InvoiceComponent = InvoiceDocumentServer(invoiceData);
        console.log('Base64 InvoiceComponent created successfully');
        console.log('Base64 InvoiceComponent type:', typeof InvoiceComponent);
      } catch (componentError) {
        console.error('Error creating Base64 InvoiceComponent:', componentError);
        throw componentError;
      }
      
      // Generate PDF using base64 format
      console.log('Creating PDF document for base64...');
      let pdfDoc;
      try {
        pdfDoc = pdf(InvoiceComponent);
        console.log('Base64 PDF document created successfully');
        console.log('Base64 pdfDoc type:', typeof pdfDoc);
        console.log('Base64 pdfDoc has toString method:', typeof pdfDoc?.toString === 'function');
      } catch (pdfError) {
        console.error('Error creating Base64 PDF document:', pdfError);
        throw pdfError;
      }
      
      console.log('Converting PDF to base64 string...');
      let pdfBase64;
      try {
        // Try toString('base64') first
        pdfBase64 = await pdfDoc.toString('base64');
        
        // If that doesn't work, try toBuffer() then convert
        if (!pdfBase64 || typeof pdfBase64 !== 'string') {
          console.log('toString() failed, trying buffer approach...');
          const pdfBuffer = await pdfDoc.toBuffer();
          if (pdfBuffer && Buffer.isBuffer(pdfBuffer)) {
            pdfBase64 = pdfBuffer.toString('base64');
          }
        }
        
        console.log('PDF converted to base64 successfully');
        console.log('pdfBase64 type:', typeof pdfBase64);
        console.log('pdfBase64 length:', pdfBase64?.length);
      } catch (base64Error) {
        console.error('Error converting PDF to base64:', base64Error);
        throw base64Error;
      }
      
      console.log('=== BASE64 PDF GENERATION SUCCESS ===');
      console.log('PDF generated in base64 format, length:', pdfBase64.length);
      
      return pdfBase64;
    } catch (error) {
      console.error('=== BASE64 PDF GENERATION ERROR ===');
      console.error('PDF base64 generation failed:', error);
      console.error('Base64 error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw new Error(`PDF base64 generation failed: ${error.message}`);
    }
  }

  /**
   * Clear PDF cache
   */
  clearCache() {
    this.cache.clear();
    console.log('PDF cache cleared');
  }

  /**
   * Generate and upload PDF in one operation
   */
  async generateAndUploadPDF(invoiceData, billNumber) {
    try {
      console.log('=== MAIN PDF GENERATION AND UPLOAD DEBUG START ===');
      console.log('Starting PDF generation and upload for:', billNumber);
      console.log('Invoice data received:', {
        invoiceNumber: invoiceData?.invoiceNumber,
        clientName: invoiceData?.clientName,
        totalAmount: invoiceData?.totalAmount,
        itemsCount: invoiceData?.items?.length
      });
      
      // Clear cache to ensure fresh generation
      this.clearCache();
      
      // Generate PDF buffer with enhanced error handling
      let pdfBuffer;
      try {
        console.log('Attempting primary buffer generation...');
        pdfBuffer = await this.generatePDFBuffer(invoiceData, false); // Disable cache for fresh generation
        console.log('Primary buffer generation successful');
      } catch (bufferError) {
        console.error('=== PRIMARY BUFFER GENERATION FAILED ===');
        console.error('Buffer generation failed, trying base64 approach:', bufferError.message);
        console.error('Buffer error details:', {
          message: bufferError.message,
          stack: bufferError.stack,
          name: bufferError.name
        });
        
        try {
          console.log('Attempting base64 fallback generation...');
          // Fallback to base64 approach
          const pdfBase64 = await this.generatePDFBase64(invoiceData);
          console.log('Base64 generation successful, converting to buffer...');
          pdfBuffer = Buffer.from(pdfBase64, 'base64');
          console.log('Base64 to buffer conversion successful');
        } catch (base64Error) {
          console.error('=== BASE64 FALLBACK ALSO FAILED ===');
          console.error('Base64 fallback failed:', base64Error.message);
          throw new Error(`Both buffer and base64 generation failed. Buffer error: ${bufferError.message}, Base64 error: ${base64Error.message}`);
        }
      }
      
      // Final validation
      console.log('Performing final buffer validation...');
      console.log('pdfBuffer type:', typeof pdfBuffer);
      console.log('pdfBuffer constructor:', pdfBuffer?.constructor?.name);
      console.log('pdfBuffer is Buffer:', Buffer.isBuffer(pdfBuffer));
      console.log('pdfBuffer length:', pdfBuffer?.length);
      
      if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
        console.error('=== FINAL VALIDATION FAILED ===');
        console.error('Failed to generate valid PDF buffer:', {
          pdfBuffer: pdfBuffer,
          type: typeof pdfBuffer,
          isBuffer: Buffer.isBuffer(pdfBuffer),
          length: pdfBuffer?.length,
          constructor: pdfBuffer?.constructor?.name
        });
        throw new Error('Failed to generate valid PDF buffer');
      }
      
      console.log('=== FINAL VALIDATION PASSED ===');
      console.log('PDF buffer ready, size:', pdfBuffer.length, 'bytes');
      
      // Debug: Check PDF buffer content
      if (pdfBuffer.length < 1000) {
        console.warn('PDF buffer is very small, might be corrupted');
        console.log('First 100 bytes:', pdfBuffer.slice(0, 100).toString('hex'));
        
        // Try to regenerate with a simpler approach
        console.log('Attempting to regenerate PDF with simpler approach...');
        try {
          const { Document, Page, Text } = await import('@react-pdf/renderer');
          const simplePdfDoc = pdf(React.createElement(Document, null,
            React.createElement(Page, { size: 'A4' },
              React.createElement(Text, null, `Invoice: ${invoiceData.invoiceNumber}`),
              React.createElement(Text, null, `Client: ${invoiceData.clientName}`),
              React.createElement(Text, null, `Amount: ₹${invoiceData.totalAmount}`)
            )
          ));
          
          const simpleBufferResult = await simplePdfDoc.toBuffer();
          let simplePdfBuffer;
          
          // Handle PDFDocument return type
          if (simpleBufferResult && typeof simpleBufferResult === 'object' && simpleBufferResult.constructor.name === 'PDFDocument') {
            console.log('Simple PDF toBuffer() returned PDFDocument, trying toString...');
            const simpleBase64 = await simplePdfDoc.toString('base64');
            simplePdfBuffer = Buffer.from(simpleBase64, 'base64');
          } else if (Buffer.isBuffer(simpleBufferResult)) {
            simplePdfBuffer = simpleBufferResult;
          } else {
            console.log('Simple PDF toBuffer() returned unexpected type, trying base64...');
            const simpleBase64 = await simplePdfDoc.toString('base64');
            simplePdfBuffer = Buffer.from(simpleBase64, 'base64');
          }
          
          if (simplePdfBuffer && Buffer.isBuffer(simplePdfBuffer) && simplePdfBuffer.length > 1000) {
            console.log('Simple PDF generated successfully, size:', simplePdfBuffer.length);
            pdfBuffer = simplePdfBuffer;
          }
        } catch (simpleError) {
          console.error('Simple PDF generation also failed:', simpleError.message);
          
          // Final fallback - create a basic PDF manually
          console.log('Creating basic PDF manually...');
          try {
            const basicPdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
100 700 Td
(Invoice: ${invoiceData.invoiceNumber}) Tj
0 -20 Td
(Client: ${invoiceData.clientName}) Tj
0 -20 Td
(Amount: ₹${invoiceData.totalAmount}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000524 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
612
%%EOF`;
            
            const basicPdfBuffer = Buffer.from(basicPdfContent, 'utf8');
            if (basicPdfBuffer && basicPdfBuffer.length > 1000) {
              console.log('Basic PDF created successfully, size:', basicPdfBuffer.length);
              pdfBuffer = basicPdfBuffer;
            }
          } catch (basicError) {
            console.error('Basic PDF creation also failed:', basicError.message);
          }
        }
      }
      
      // Upload to Cloudinary
      console.log('Starting Cloudinary upload...');
      const uploaded = await this.uploadPDFToCloudinary(pdfBuffer, billNumber);
      
      console.log('=== PDF UPLOAD SUCCESS ===');
      console.log('PDF uploaded successfully to Cloudinary:', uploaded.secure_url);
      
      return {
        pdfBuffer,
        pdfUrl: uploaded.secure_url,
        pdfPublicId: uploaded.public_id,
        size: pdfBuffer.length
      };
    } catch (error) {
      console.error('=== MAIN PDF GENERATION AND UPLOAD ERROR ===');
      console.error('PDF generation and upload failed:', error);
      console.error('Main error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        billNumber: billNumber
      });
      throw error;
    }
  }

  /**
   * Delete PDF from Cloudinary
   */
  async deletePDF(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'raw'
      });
      console.log('PDF deleted from Cloudinary:', result);
      return result;
    } catch (error) {
      console.error('Failed to delete PDF:', error);
      throw error;
    }
  }

  /**
   * Generate cache key for invoice data
   */
  generateCacheKey(invoiceData) {
    const keyData = {
      invoiceNumber: invoiceData.invoiceNumber,
      totalAmount: invoiceData.totalAmount,
      itemsCount: invoiceData.items?.length || 0,
      clientName: invoiceData.clientName
    };
    return JSON.stringify(keyData);
  }

  /**
   * Cache result with size management
   */
  cacheResult(key, pdfBuffer) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, pdfBuffer);
    console.log(`PDF cached. Cache size: ${this.cache.size}/${this.maxCacheSize}`);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    console.log('PDF cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      hitRate: this.cacheHits / (this.cacheHits + this.cacheMisses) || 0
    };
  }
}

// Export singleton instance
export default new PDFService();
