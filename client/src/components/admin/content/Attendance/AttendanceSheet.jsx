import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#FF6B35",
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B35",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
  employeeInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    width: 100,
  },
  value: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 8,
    color: "#666",
    marginTop: 3,
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    minHeight: 25,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#FF6B35",
    color: "white",
    fontWeight: "bold",
  },
  tableCol: {
    padding: 5,
  },
  col1: { width: "15%" },
  col2: { width: "15%" },
  col3: { width: "15%" },
  col4: { width: "15%" },
  col5: { width: "15%" },
  col6: { width: "25%" },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#666",
  },
});

const AttendanceSheet = ({ employee, attendance, stats, month, year }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>JMD STITCHING PVT LTD</Text>
          <Text style={styles.subtitle}>ATTENDANCE SHEET</Text>
          <Text style={styles.subtitle}>
            {month} {year}
          </Text>
        </View>

        {/* Employee Info */}
        <View style={styles.employeeInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Employee Name:</Text>
            <Text style={styles.value}>{employee?.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Employee ID:</Text>
            <Text style={styles.value}>{employee?.employeeId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Role:</Text>
            <Text style={styles.value}>{employee?.role}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Mobile:</Text>
            <Text style={styles.value}>{employee?.mobile}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats?.totalDays || 0}</Text>
            <Text style={styles.statLabel}>Total Days</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: "#10B981" }]}>
              {stats?.present || 0}
            </Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: "#EF4444" }]}>
              {stats?.absent || 0}
            </Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: "#F59E0B" }]}>
              {stats?.leave || 0}
            </Text>
            <Text style={styles.statLabel}>Leave</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: "#3B82F6" }]}>
              {stats?.halfDay || 0}
            </Text>
            <Text style={styles.statLabel}>Half Day</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCol, styles.col1]}>Date</Text>
            <Text style={[styles.tableCol, styles.col2]}>Day</Text>
            <Text style={[styles.tableCol, styles.col3]}>Status</Text>
            <Text style={[styles.tableCol, styles.col4]}>Check In</Text>
            <Text style={[styles.tableCol, styles.col5]}>Check Out</Text>
            <Text style={[styles.tableCol, styles.col6]}>Notes</Text>
          </View>

          {/* Rows */}
          {attendance && attendance.length > 0 ? (
            attendance.map((record, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCol, styles.col1]}>
                  {new Date(record.date).toLocaleDateString("en-IN")}
                </Text>
                <Text style={[styles.tableCol, styles.col2]}>
                  {new Date(record.date).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </Text>
                <Text style={[styles.tableCol, styles.col3]}>
                  {record.status.toUpperCase()}
                </Text>
                <Text style={[styles.tableCol, styles.col4]}>
                  {record.checkInTime || "-"}
                </Text>
                <Text style={[styles.tableCol, styles.col5]}>
                  {record.checkOutTime || "-"}
                </Text>
                <Text style={[styles.tableCol, styles.col6]}>
                  {record.notes || "-"}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text
                style={[styles.tableCol, { textAlign: "center", width: "100%" }]}
              >
                No attendance records found
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Generated on {new Date().toLocaleDateString("en-IN")} at{" "}
            {new Date().toLocaleTimeString("en-IN")}
          </Text>
          <Text>JMD STITCHING PVT LTD - Attendance Management System</Text>
        </View>
      </Page>
    </Document>
  );
};

export default AttendanceSheet;
