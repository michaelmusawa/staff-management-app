// components/reports/UnitSelect.tsx
"use client";
import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function UnitSelect({
  value,
  onChange,
}: {
  value: string;
  onChange(v: string): void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select Unit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Units</SelectItem>
        <SelectItem value="subcounty">Sub‑County</SelectItem>
        <SelectItem value="sector">Sector</SelectItem>
        <SelectItem value="zone">Zone</SelectItem>
      </SelectContent>
    </Select>
  );
}
