// components/reports/IncidentReports.tsx
"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function IncidentReports({
  dateRange,
  unit,
}: {
  dateRange: { start: string; end: string };
  unit: string;
}) {
  // TODO: fetch real incident data
  const dummy = [
    { date: "2025-07-10", type: "Theft", count: 5 },
    { date: "2025-07-11", type: "Assault", count: 2 },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dummy.map((d, i) => (
          <TableRow key={i}>
            <TableCell>{d.date}</TableCell>
            <TableCell>{d.type}</TableCell>
            <TableCell>{d.count}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
