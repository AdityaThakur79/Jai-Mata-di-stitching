import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfB.ttf', fontWeight: 'bold' },
  ]
});

// Create styles with improved tabular structure
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 15,
    fontFamily: 'Helvetica',
    fontSize: 9,
  },
  
  // Header Section
  header: {
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#333333',
    paddingBottom: 6,
  },
  companyInfo: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    gap: 4,
  },
  logo: {
    width: 45,
    height: 45,
    borderRadius: 6,
  },
  companyText: {
    alignItems: 'center',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 3,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 6,
  },
  payPeriod: {
    fontSize: 10,
    color: '#333333',
    backgroundColor: '#f5f5f5',
    padding: 4,
    borderRadius: 3,
  },
  
  // Employee Information Table
  employeeTable: {
    marginBottom: 6,
  },
  advancesSection: {
    marginBottom: 6,
  },
  tableTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
    backgroundColor: '#e9ecef',
    padding: 4,
    textAlign: 'center',
  },
  
  // Table structure
  table: {
    borderWidth: 1,
    borderColor: '#333333',
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#dee2e6',
    minHeight: 18,
  },
  tableRowAlt: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 0.5,
    borderBottomColor: '#dee2e6',
    minHeight: 18,
  },
  tableCell: {
    flex: 1,
    padding: 3,
    justifyContent: 'center',
    borderRightWidth: 0.5,
    borderRightColor: '#dee2e6',
  },
  tableCellHeader: {
    flex: 1,
    padding: 3,
    justifyContent: 'center',
    borderRightWidth: 0.5,
    borderRightColor: '#333333',
    backgroundColor: '#e9ecef',
  },
  tableCellBold: {
    flex: 1,
    padding: 3,
    justifyContent: 'center',
    borderRightWidth: 0.5,
    borderRightColor: '#dee2e6',
    backgroundColor: '#e9ecef',
  },
  cellText: {
    fontSize: 8,
    color: '#333333',
  },
  cellTextBold: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333333',
  },
  cellTextCenter: {
    fontSize: 8,
    color: '#333333',
    textAlign: 'center',
  },
  cellTextRight: {
    fontSize: 8,
    color: '#333333',
    textAlign: 'right',
  },
  
  // Employee details in 2x3 grid
  employeeGrid: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  gridColumn: {
    flex: 1,
    marginRight: 6,
  },
  gridRow: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#dee2e6',
    marginBottom: 1,
    minHeight: 16,
  },
  gridLabel: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 2,
    borderRightWidth: 0.5,
    borderRightColor: '#dee2e6',
    justifyContent: 'center',
  },
  gridValue: {
    flex: 1.5,
    padding: 2,
    justifyContent: 'center',
  },
  
  // Financial tables
  financialSection: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  
  // Net salary section
  netSalarySection: {
    marginTop: 6,
    padding: 8,
    backgroundColor: '#e8f5e8',
    borderWidth: 1.5,
    borderColor: '#28a745',
    borderRadius: 4,
  },
  netSalaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netSalaryLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333333',
  },
  netSalaryAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#28a745',
  },
  netSalaryWords: {
    fontSize: 8,
    color: '#666666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 3,
  },
  
  // Footer
  footer: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  footerText: {
    fontSize: 7,
    color: '#666666',
    fontStyle: 'italic',
    marginBottom: 2,
  },
});

// Helper functions (same as before)
const numberToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  
  if (num === 0) return 'Zero';
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + numberToWords(num % 100) : '');
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
  return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWords(num % 10000000) : '');
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

const getMonthName = (month) => {
  // If month is already a month name, return it
  if (typeof month === 'string' && month !== '') {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Check if it's already a valid month name
    if (months.includes(month)) {
      return month;
    }
    
    // Check if it's a month number as string (like '7' for July)
    if (!isNaN(month) && month >= 1 && month <= 12) {
      return months[parseInt(month) - 1];
    }
  }
  
  // If month is a numeric index (0-11), convert to month name
  if (typeof month === 'number' && month >= 0 && month <= 11) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  }
  
  // If month is a numeric index (1-12), convert to month name
  if (typeof month === 'number' && month >= 1 && month <= 12) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  }
  
  console.log('Unknown month format:', month, 'Type:', typeof month);
  return 'Unknown';
};

const SalarySlip = ({ employee, salarySlip, logoDataUrl }) => {
  if (!employee || !salarySlip) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>No data available</Text>
        </Page>
      </Document>
    );
  }

  console.log('SalarySlip received month:', salarySlip?.month, 'Type:', typeof salarySlip?.month);
  console.log('SalarySlip received year:', salarySlip?.year, 'Type:', typeof salarySlip?.year);
  
  const monthName = getMonthName(salarySlip?.month);
  const year = salarySlip.year;
  const grossEarnings = employee.baseSalary || 0;
  const totalDeductions = salarySlip.advancesDeducted || 0;
  const netSalary = grossEarnings - totalDeductions;
  const netSalaryWords = numberToWords(Math.floor(netSalary)) + ' Only';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            {logoDataUrl && (
              <Image src={logoDataUrl} style={styles.logo} />
            )}
            <View style={styles.companyText}>
              <Text style={styles.companyName}>JMD STITCHING PRIVATE LIMITED</Text>
              <Text style={styles.headerTitle}>SALARY SLIP</Text>
            </View>
          </View>
          <Text style={styles.payPeriod}>
            Pay Period:  {salarySlip.generatedAt ? new Date(salarySlip.generatedAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}
          </Text>
        </View>

        {/* Employee Information in Grid */}
        <View style={styles.employeeTable}>
          <Text style={styles.tableTitle}>EMPLOYEE INFORMATION</Text>
          <View style={styles.employeeGrid}>
            {/* Left Column */}
            <View style={styles.gridColumn}>
              <View style={styles.gridRow}>
                <View style={styles.gridLabel}>
                  <Text style={styles.cellTextBold}>Emp ID</Text>
                </View>
                <View style={styles.gridValue}>
                  <Text style={styles.cellText}>{employee.employeeId || 'N/A'}</Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.gridLabel}>
                  <Text style={styles.cellTextBold}>Name</Text>
                </View>
                <View style={styles.gridValue}>
                  <Text style={styles.cellText}>{employee.name || 'N/A'}</Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.gridLabel}>
                  <Text style={styles.cellTextBold}>Designation</Text>
                </View>
                <View style={styles.gridValue}>
                  <Text style={styles.cellText}>
                    {employee.role || 'N/A'}
                    {Array.isArray(employee.secondaryRoles) && employee.secondaryRoles.length > 0
                      ? ` (Secondary: ${employee.secondaryRoles.join(', ')})`
                      : ''}
                  </Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.gridLabel}>
                  <Text style={styles.cellTextBold}>Department</Text>
                </View>
                <View style={styles.gridValue}>
                  <Text style={styles.cellText}>Tailoring</Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.gridLabel}>
                  <Text style={styles.cellTextBold}>Joining Date</Text>
                </View>
                <View style={styles.gridValue}>
                  <Text style={styles.cellText}>
                    {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString('en-IN') : 'N/A'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Right Column */}
            <View style={styles.gridColumn}>
              <View style={styles.gridRow}>
                <View style={styles.gridLabel}>
                  <Text style={styles.cellTextBold}>Mobile</Text>
                </View>
                <View style={styles.gridValue}>
                  <Text style={styles.cellText}>{employee.mobile || 'N/A'}</Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.gridLabel}>
                  <Text style={styles.cellTextBold}>Email</Text>
                </View>
                <View style={styles.gridValue}>
                  <Text style={styles.cellText}>{employee.email || 'N/A'}</Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.gridLabel}>
                  <Text style={styles.cellTextBold}>Bank Name</Text>
                </View>
                <View style={styles.gridValue}>
                  <Text style={styles.cellText}>{employee.bankDetails?.bankName || 'N/A'}</Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.gridLabel}>
                  <Text style={styles.cellTextBold}>Account No.</Text>
                </View>
                <View style={styles.gridValue}>
                  <Text style={styles.cellText}>{employee.bankDetails?.accountNumber || 'N/A'}</Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.gridLabel}>
                  <Text style={styles.cellTextBold}>IFSC Code</Text>
                </View>
                <View style={styles.gridValue}>
                  <Text style={styles.cellText}>{employee.bankDetails?.ifsc || 'N/A'}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Advances Details Section */}
        {salarySlip.advances && salarySlip.advances.length > 0 && (
          <View style={styles.advancesSection}>
            <Text style={styles.tableTitle}>ADVANCES TAKEN</Text>
            
            {/* Header */}
            <View style={styles.tableRowHeader}>
              <View style={styles.tableCellHeader}>
                <Text style={styles.cellTextBold}>Date</Text>
              </View>
              <View style={styles.tableCellHeader}>
                <Text style={styles.cellTextBold}>Reason</Text>
              </View>
              <View style={styles.tableCellHeader}>
                <Text style={styles.cellTextBold}>Amount (₹)</Text>
              </View>
            </View>
            
            {/* Individual Advances */}
            {salarySlip.advances.map((advance, index) => (
              <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <View style={styles.tableCell}>
                  <Text style={styles.cellText}>
                    {advance.date ? new Date(advance.date).toLocaleDateString('en-IN') : 'N/A'}
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.cellText}>{advance.reason || 'N/A'}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.cellTextRight}>{advance.amount ? advance.amount.toFixed(2) : '0.00'}</Text>
                </View>
              </View>
            ))}
            
            {/* Total Advances */}
            <View style={styles.tableRowHeader}>
              <View style={styles.tableCellBold}>
                <Text style={styles.cellTextBold}>TOTAL ADVANCES</Text>
              </View>
              <View style={styles.tableCellBold}>
                <Text style={styles.cellTextBold}> </Text>
              </View>
              <View style={styles.tableCellBold}>
                <Text style={[styles.cellTextBold, styles.cellTextRight]}>{totalDeductions.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Earnings and Deductions Tables */}
        <View style={styles.financialSection}>
          {/* Earnings Table */}
          <View style={[styles.table, { flex: 1, marginRight: 4 }]}>
            <Text style={styles.tableTitle}>EARNINGS</Text>
            
            {/* Header */}
            <View style={styles.tableRowHeader}>
              <View style={styles.tableCellHeader}>
                <Text style={styles.cellTextBold}>Description</Text>
              </View>
              <View style={styles.tableCellHeader}>
                <Text style={styles.cellTextBold}>Amount (₹)</Text>
              </View>
            </View>
            
            {/* Basic Salary */}
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.cellText}>Basic Salary</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.cellTextRight}>{(employee.baseSalary || 0).toFixed(2)}</Text>
              </View>
            </View>
            
            {/* HRA */}
            <View style={styles.tableRowAlt}>
              <View style={styles.tableCell}>
                <Text style={styles.cellText}>House Rent Allowance</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.cellTextRight}>0.00</Text>
              </View>
            </View>
            
            {/* Medical Allowance */}
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.cellText}>Medical Allowance</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.cellTextRight}>0.00</Text>
              </View>
            </View>
            
            {/* Conveyance */}
            <View style={styles.tableRowAlt}>
              <View style={styles.tableCell}>
                <Text style={styles.cellText}>Conveyance Allowance</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.cellTextRight}>0.00</Text>
              </View>
            </View>
            
            {/* Total Earnings */}
            <View style={styles.tableRowHeader}>
              <View style={styles.tableCellBold}>
                <Text style={styles.cellTextBold}>GROSS EARNINGS</Text>
              </View>
              <View style={styles.tableCellBold}>
                <Text style={[styles.cellTextBold, styles.cellTextRight]}>{grossEarnings.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Deductions Table */}
          <View style={[styles.table, { flex: 1, marginLeft: 4 }]}>
            <Text style={styles.tableTitle}>DEDUCTIONS</Text>
            
            {/* Header */}
            <View style={styles.tableRowHeader}>
              <View style={styles.tableCellHeader}>
                <Text style={styles.cellTextBold}>Description</Text>
              </View>
              <View style={styles.tableCellHeader}>
                <Text style={styles.cellTextBold}>Amount (₹)</Text>
              </View>
            </View>
            
            {/* Provident Fund */}
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.cellText}>Provident Fund</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.cellTextRight}>0.00</Text>
              </View>
            </View>
            
            {/* ESI */}
            <View style={styles.tableRowAlt}>
              <View style={styles.tableCell}>
                <Text style={styles.cellText}>ESI</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.cellTextRight}>0.00</Text>
              </View>
            </View>
            
            {/* Professional Tax */}
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.cellText}>Professional Tax</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.cellTextRight}>0.00</Text>
              </View>
            </View>
            
            {/* Advances */}
            <View style={styles.tableRowAlt}>
              <View style={styles.tableCell}>
                <Text style={styles.cellText}>Advances</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.cellTextRight}>{(salarySlip.advancesDeducted || 0).toFixed(2)}</Text>
              </View>
            </View>
            
            {/* Total Deductions */}
            <View style={styles.tableRowHeader}>
              <View style={styles.tableCellBold}>
                <Text style={styles.cellTextBold}>GROSS DEDUCTIONS</Text>
              </View>
              <View style={styles.tableCellBold}>
                <Text style={[styles.cellTextBold, styles.cellTextRight]}>{totalDeductions.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Net Salary Summary Table */}
        <View style={styles.table}>
          <Text style={styles.tableTitle}>SALARY SUMMARY</Text>
          
          <View style={styles.tableRowHeader}>
            <View style={styles.tableCellHeader}>
              <Text style={styles.cellTextBold}>Description</Text>
            </View>
            <View style={styles.tableCellHeader}>
              <Text style={styles.cellTextBold}>Amount (₹)</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={styles.cellText}>Gross Earnings</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.cellTextRight}>{grossEarnings.toFixed(2)}</Text>
            </View>
          </View>
          
          <View style={styles.tableRowAlt}>
            <View style={styles.tableCell}>
              <Text style={styles.cellText}>Gross Deductions</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.cellTextRight}>{totalDeductions.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Net Salary */}
        <View style={styles.netSalarySection}>
          <View style={styles.netSalaryRow}>
            <Text style={styles.netSalaryLabel}>NET SALARY PAYABLE</Text>
            <Text style={styles.netSalaryAmount}>Rs.{netSalary.toFixed(2)}</Text>
          </View>
          <Text style={styles.netSalaryWords}>Rupees {netSalaryWords}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            * This is a computer-generated salary slip and does not require a signature.
          </Text>
          <Text style={styles.footerText}>
            * Net salary payable is subject to deductions as per Income Tax Law.
          </Text>
          <Text style={styles.footerText}>
            Generated on: {salarySlip.generatedAt ? new Date(salarySlip.generatedAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}
          </Text>
          {salarySlip.notes && (
            <Text style={styles.footerText}>
              Notes: {salarySlip.notes}
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default SalarySlip;