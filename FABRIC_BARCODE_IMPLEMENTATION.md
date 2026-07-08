# Fabric Management System with Barcode Generation

## Overview
Implemented a comprehensive fabric management system with auto-generated SRN, barcode printing, stock threshold alerts, and email notifications.

## Features Implemented

### 1. **Auto-Generated SRN (Serial Reference Number)**
- Format: `FAB-XXXXXX` (e.g., FAB-000001)
- Automatically generated when creating a new fabric
- Unique identifier for each fabric

### 2. **New Fabric Fields**
- **SRN**: Auto-generated serial number
- **Fabric Name**: Name of the fabric
- **HSN Code**: Harmonized System Nomenclature code for taxation
- **Stock (meters)**: Current stock quantity
- **Length**: Fabric roll length in meters
- **Width**: Fabric width in meters
- **Type**: Fabric type (cotton, silk, linen, polyester, wool, rayon, other)
- **Fabric Barcode Count**: Number of barcode stickers to print (5-10)
- **Threshold Value**: Stock level that triggers restock alerts
- **Restock Email**: Email address for low stock notifications

### 3. **Barcode Generation & Printing**
- **3x3 inch (76.2mm × 76.2mm) sticker format**
- **Grid layout**: 2x2 grid with multiple barcode stickers per page
- **Barcode format**: Code128 with fabric SRN encoded
- **Number of stickers**: Configurable per fabric (5-10 stickers)
- **Print button**: Available in both fabric list table and detail view
- **Sticker contents**:
  - JMD Fabrics header
  - Fabric SRN
  - Fabric name (truncated)
  - Fabric type
  - Color
  - Barcode image
  - Barcode value
  - HSN code (if available)

### 4. **Stock Threshold Alerts**
- **Visual indicators**: Red text for low stock in tables and views
- **Low stock badge**: "Low Stock" badge in mobile view
- **Email notifications**: Automatic email sent when stock falls below threshold
- **Email triggers**:
  - When creating fabric with stock ≤ threshold
  - When updating fabric stock that crosses threshold

### 5. **Email Notification System**
- **Service**: Nodemailer with Gmail/SMTP support
- **Configuration**: Set via environment variables
  - `EMAIL_SERVICE`: Email service provider (default: gmail)
  - `EMAIL_USER`: Sender email address
  - `EMAIL_PASSWORD`: Email password/app password
- **Email content**: 
  - Fabric details (SRN, name, type, color)
  - Current stock vs threshold
  - Alert message

### 6. **Print Tracking**
- **Print count**: Tracks how many times barcode has been printed
- **Displayed in**: Detail view drawer

## Files Modified

### Backend
1. **models/fabric.js**
   - Added new fields: `srn`, `hsnCode`, `length`, `width`, `fabricBarcodeCount`, `barcodeValue`, `thresholdValue`, `restockEmail`, `printCount`
   - Added FabricCounter schema for auto-incrementing SRN
   - Added pre-save hook to generate SRN

2. **controllers/fabric.js**
   - Added barcode generation using `bwip-js`
   - Added email notification function using `nodemailer`
   - Updated `createFabric` to handle new fields and send restock emails
   - Updated `updateFabric` to handle new fields and check threshold crossing
   - Added `printFabricBarcode` endpoint

3. **routes/fabric.js**
   - Added `/print-barcode` route

### Frontend
4. **client/src/features/api/fabricApi.js**
   - Added `printFabricBarcode` mutation
   - Exported `usePrintFabricBarcodeMutation` hook

5. **client/src/components/admin/content/Fabric/CreateFabric.jsx**
   - Added form fields for all new properties
   - Updated form submission to include new fields

6. **client/src/components/admin/content/Fabric/UpdateFabrics.jsx**
   - Added form fields for all new properties
   - Updated form submission to include new fields

7. **client/src/components/admin/content/Fabric/Fabrics.jsx**
   - Added SRN column to table
   - Changed "Color" and "Price/m" columns to "Stock" column with threshold highlighting
   - Added print barcode button (printer icon) in action column
   - Added `handlePrintBarcode` function with 3x3 inch print layout
   - Updated drawer view to show all new fields
   - Added "Print Barcode Stickers" button in drawer
   - Added low stock badge and visual indicators
   - Updated mobile card view with SRN and print button

## Barcode Print Layout

### Format: 3x3 inches (76.2mm × 76.2mm)
- **Grid**: 2 columns × 2-5 rows (depending on barcode count)
- **Each sticker contains**:
  - Brand header (JMD Fabrics)
  - Fabric SRN
  - Fabric info (name, type, color)
  - Barcode image (Code128)
  - Barcode value
  - HSN code (footer)

### Print Settings
- Paper size: 3" × 3" (76.2mm × 76.2mm)
- Margin: 0
- Scale: 100%
- Orientation: Portrait

## Environment Variables Required

Add these to your `.env` file:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Usage

### Creating a Fabric
1. Navigate to "Fabric Master" → "Add Fabric"
2. Fill in required fields (Name, Type, Color, Price)
3. Optionally fill:
   - HSN Code
   - Stock, Length, Width
   - Barcode Count (5-10)
   - Threshold Value
   - Restock Email
4. Click "Add Fabric"
5. SRN is auto-generated
6. If stock ≤ threshold and email provided, alert email is sent

### Printing Barcode Stickers
1. From fabric list table:
   - Click printer icon button for the fabric
2. From fabric detail view:
   - Click "View" (eye icon)
   - Click "Print Barcode Stickers" button at bottom
3. Print dialog opens with 3×3 inch format
4. Configure printer to use actual size (100% scale)
5. Print on sticker paper

### Stock Management
- Red text indicates stock at or below threshold
- "Low Stock" badge appears in mobile view
- Email notification sent automatically when threshold crossed
- Update stock via "Edit" button

## Technical Details

### Dependencies
- **bwip-js**: Barcode generation (already installed)
- **nodemailer**: Email notifications (already installed)

### Barcode Format
- Type: Code128
- Scale: 3
- Height: 10mm
- Includes text below barcode
- Text alignment: center

### Database
- Auto-incrementing counter collection: `fabriccounters`
- Counter ID: `fabricSRN`
- Format: 6-digit zero-padded number

## Testing Checklist

- [ ] Create fabric with all fields
- [ ] Verify SRN is auto-generated
- [ ] Create fabric with stock below threshold → check email sent
- [ ] Print barcode from table view
- [ ] Print barcode from detail view
- [ ] Verify print layout is 3×3 inches
- [ ] Update fabric stock to cross threshold → check email sent
- [ ] View fabric details in drawer
- [ ] Check mobile responsive view
- [ ] Verify low stock indicators
- [ ] Test with different barcode counts (5-10)

## Future Enhancements
- QR code option in addition to Code128 barcode
- Bulk barcode printing for multiple fabrics
- Print history log
- Custom email templates
- SMS notifications for critical stock levels
- Barcode scanning for stock updates
