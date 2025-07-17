// components/pdf/NominalPDF.tsx
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

// Register fonts
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
  page: { padding: 24, fontFamily: "Inter" },
  header: { fontSize: 18, marginBottom: 12, textAlign: "center" },
  table: { display: "table", width: "auto", marginTop: 8 },
  row: { flexDirection: "row" },
  cellHeader: {
    flex: 1,
    fontSize: 12,
    fontWeight: "bold",
    padding: 4,
    borderBottom: 1,
  },
  cell: { flex: 1, fontSize: 10, padding: 4, borderBottom: 1 },
});

interface Props {
  staffs: Staff[];
}

export function NominalPDF({ staffs }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Nominal Roll</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            {["#", "Name", "Man No.", "IPPD No.", "Rank", "Status"].map((h) => (
              <Text key={h} style={styles.cellHeader}>
                {h}
              </Text>
            ))}
          </View>
          {staffs.map((s, i) => (
            <View key={s.id} style={styles.row}>
              <Text style={styles.cell}>{i + 1}</Text>
              <Text
                style={styles.cell}
              >{`${s.first_name} ${s.last_name}`}</Text>
              <Text style={styles.cell}>{s.staff_number}</Text>
              <Text style={styles.cell}>{s.ippd_number || "-"}</Text>
              <Text style={styles.cell}>{s.rank}</Text>
              <Text style={styles.cell}>{s.status}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
