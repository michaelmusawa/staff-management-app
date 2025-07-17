// app/components/attendance/AttendanceHeader.tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  date: Date;
  onDateChange: (d: Date) => void;
  onImportClick: () => void;
  onMarkHolidayClick: () => void;
  unitName?: string;
}

export default function AttendanceHeader({
  date,
  onDateChange,
  onImportClick,
  onMarkHolidayClick,
  unitName,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Label>Date:</Label>
        <Input
          type="date"
          value={date.toISOString().substring(0, 10)}
          onChange={(e) => onDateChange(new Date(e.target.value))}
        />
        {unitName && (
          <span className="text-lg font-semibold ml-4">{unitName}</span>
        )}
      </div>
      <div className="flex gap-2">
        <Button onClick={onImportClick}>Import PDF</Button>
        <Button variant="outline" onClick={onMarkHolidayClick}>
          Mark Holiday
        </Button>
      </div>
    </div>
  );
}
