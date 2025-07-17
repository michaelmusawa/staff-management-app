// components/reports/SummaryCards.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SummaryCards({
  dateRange,
  unit,
}: {
  dateRange: { start: string; end: string };
  unit: string;
}) {
  const [data, setData] = useState({
    totalStaff: 0,
    onDutyPct: 0,
    pendingLeaves: 0,
    openAssignments: 0,
  });

  useEffect(() => {
    // TODO: fetch real summary
    setData({
      totalStaff: 120,
      onDutyPct: 85,
      pendingLeaves: 5,
      openAssignments: 12,
    });
  }, [dateRange, unit]);

  const cards = [
    { title: "Total Staff", value: data.totalStaff },
    { title: "On‑Duty %", value: `${data.onDutyPct}%` },
    { title: "Pending Leaves", value: data.pendingLeaves },
    { title: "Open Assignments", value: data.openAssignments },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card key={c.title}>
          <CardHeader>
            <CardTitle>{c.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl">{c.value}</CardContent>
        </Card>
      ))}
    </div>
  );
}
