// components/reports/DateRangePicker.tsx
"use client";
import React from "react";
import { Input } from "@/components/ui/input";

export default function DateRangePicker({
  value,
  onChange,
}: {
  value: { start: string; end: string };
  onChange(v: { start: string; end: string }): void;
}) {
  return (
    <div className="flex gap-2">
      <Input
        type="date"
        value={value.start}
        onChange={(e) => onChange({ ...value, start: e.target.value })}
      />
      <Input
        type="date"
        value={value.end}
        onChange={(e) => onChange({ ...value, end: e.target.value })}
      />
    </div>
  );
}
