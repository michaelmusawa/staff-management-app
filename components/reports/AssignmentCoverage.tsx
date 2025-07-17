// components/reports/AssignmentCoverage.tsx
"use client";
import React from "react";

export default function AssignmentCoverage({
  dateRange,
  unit,
}: {
  dateRange: { start: string; end: string };
  unit: string;
}) {
  return (
    <div className="h-64 flex items-center justify-center text-gray-500">
      {/* TODO: Replace with a sunburst or tree‑map */}
      [Assignment Coverage Chart Placeholder]
    </div>
  );
}
