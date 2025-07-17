// components/reports/AttendanceTrend.tsx
"use client";
import React from "react";

export default function AttendanceTrend({
  dateRange,
  unit,
}: {
  dateRange: { start: string; end: string };
  unit: string;
}) {
  return (
    <div className="h-64 flex items-center justify-center text-gray-500">
      {/* TODO: Replace with real line chart */}
      [Attendance Trend Chart Placeholder]
    </div>
  );
}
