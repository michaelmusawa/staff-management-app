// components/reports/LeaveAnalytics.tsx
"use client";
import React from "react";

export default function LeaveAnalytics({
  dateRange,
  unit,
}: {
  dateRange: { start: string; end: string };
  unit: string;
}) {
  return (
    <div className="h-64 flex items-center justify-center text-gray-500">
      {/* TODO: Replace with real bar/pie charts */}
      [Leave Analytics Charts Placeholder]
    </div>
  );
}
