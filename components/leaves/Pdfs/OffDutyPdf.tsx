// components/pdf/LeavePDFTemplate.tsx
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Staff } from "@/lib/definitions/staffDefinitions";

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZg.ttf",
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZg.ttf",
      fontWeight: 500,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZg.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Inter",
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#3B82F6",
  },
  headerText: {
    fontSize: 24,
    fontWeight: 700,
    color: "#1E293B",
  },
  badge: {
    backgroundColor: "#3B82F6",
    color: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 700,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 12,
    color: "#1E293B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: -8,
  },
  gridItem: {
    width: "50%",
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: 500,
    color: "#64748B",
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    fontWeight: 600,
    color: "#1E293B",
  },
  detailsCard: {
    backgroundColor: "#F1F5F9",
    padding: 16,
    borderRadius: 6,
  },
  signatureArea: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBox: {
    width: "45%",
  },
  watermark: {
    position: "absolute",
    bottom: 40,
    right: 40,
    fontSize: 10,
    color: "#94A3B8",
    opacity: 0.5,
  },
});

interface LeavePDFProps {
  staff: Staff;
  startDate: string;
  endDate: string;
  reason?: string;
  type: string;
}

export const LeavePDFTemplate = ({
  staff,
  startDate,
  endDate,
  reason,
  type,
}: LeavePDFProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateDuration = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getTitle = () => {
    switch (type) {
      case "sick":
        return "Medical Leave Application";
      case "annual":
        return "Annual Leave Application";
      case "offDuty":
        return "Off-Duty Request";
      case "maternity":
        return staff.gender === "FEMALE"
          ? "Maternity Leave Application"
          : "Paternity Leave Application";
      default:
        return "Leave Application";
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{getTitle()}</Text>
          <Text style={styles.badge}>DRAFT</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Staff Information</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>
                {staff.first_name} {staff.middle_name} {staff.last_name}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Staff Number</Text>
              <Text style={styles.value}>{staff.staff_number}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Rank/Position</Text>
              <Text style={styles.value}>{staff.rank}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Department</Text>
              <Text style={styles.value}>{staff.department || "N/A"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Leave Details</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Leave Type</Text>
              <Text style={styles.value}>
                {type === "offDuty"
                  ? "Off-Duty"
                  : type === "sick"
                  ? "Medical Leave"
                  : type === "annual"
                  ? "Annual Leave"
                  : staff.gender === "FEMALE"
                  ? "Maternity Leave"
                  : "Paternity Leave"}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Start Date</Text>
              <Text style={styles.value}>{formatDate(startDate)}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>End Date</Text>
              <Text style={styles.value}>{formatDate(endDate)}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Duration</Text>
              <Text style={styles.value}>{calculateDuration()} days</Text>
            </View>
          </View>

          {reason && (
            <View style={[styles.detailsCard, { marginTop: 12 }]}>
              <Text style={[styles.label, { marginBottom: 6 }]}>Reason</Text>
              <Text style={styles.value}>{reason}</Text>
            </View>
          )}
        </View>

        <View style={styles.signatureArea}>
          <View style={styles.signatureBox}>
            <Text style={[styles.label, { marginBottom: 16 }]}>
              Applicant Signature
            </Text>
            <Text style={styles.value}>_________________________</Text>
            <Text style={[styles.label, { marginTop: 4 }]}>
              Date: {new Date().toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.signatureBox}>
            <Text style={[styles.label, { marginBottom: 16 }]}>
              Approving Officer
            </Text>
            <Text style={styles.value}>_________________________</Text>
            <Text style={[styles.label, { marginTop: 4 }]}>
              Date: _______________
            </Text>
          </View>
        </View>

        <Text style={styles.watermark}>Generated by HR System</Text>
      </Page>
    </Document>
  );
};
