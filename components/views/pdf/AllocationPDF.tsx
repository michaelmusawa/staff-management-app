// components/pdf/AllocationPDF.tsx
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { OrgUnit } from "@/lib/definitions/orgDefinitions";
import { Assignment } from "@/lib/definitions/allocationDefinitions";

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
  unitHeader: { fontSize: 14, marginTop: 12, marginBottom: 6 },
  table: { display: "table", width: "auto" },
  row: { flexDirection: "row" },
  cellHeader: {
    flex: 1,
    fontSize: 10,
    fontWeight: "bold",
    padding: 4,
    borderBottom: 1,
  },
  cell: { flex: 1, fontSize: 9, padding: 4, borderBottom: 1 },
});

interface Props {
  units: OrgUnit[];
  assignments: Assignment[];
}

export function AllocationPDF({ units, assignments }: Props) {
  // group assignments by unit id
  const byUnit: Record<string, Assignment[]> = {};
  assignments.forEach((a) => {
    (byUnit[a.org_unit_id] ||= []).push(a);
  });

  const renderUnit = (unit: OrgUnit, depth = 0): React.ReactNode => {
    const rows = byUnit[unit.id] || [];
    return (
      <View key={unit.id}>
        <Text style={[styles.unitHeader, { marginLeft: depth * 12 }]}>
          {unit.name}
        </Text>
        {rows.length > 0 && (
          <View style={styles.table}>
            <View style={styles.row}>
              {["Staff No.", "Name", "Role"].map((h) => (
                <Text key={h} style={styles.cellHeader}>
                  {h}
                </Text>
              ))}
            </View>
            {rows.map((r) => (
              <View key={r.id} style={styles.row}>
                <Text style={styles.cell}>{r.staff_number}</Text>
                <Text
                  style={styles.cell}
                >{`${r.first_name} ${r.last_name}`}</Text>
                <Text style={styles.cell}>{r.role_title}</Text>
              </View>
            ))}
          </View>
        )}
        {unit.children.map((c) => renderUnit(c, depth + 1))}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: 18, textAlign: "center" }}>
          Allocation of Duties
        </Text>
        {units.map((u) => renderUnit(u))}
      </Page>
    </Document>
  );
}
