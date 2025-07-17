// app/components/attendance/AttendanceSummary.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAttendanceSummary } from "@/lib/actions/attendanceActions";

interface Props {
  date: string;
  unitId?: string;
}

export default function AttendanceSummary({ date, unitId }: Props) {
  const [summary, setSummary] = useState<{
    present: number;
    absent: number;
    offDuty: number;
  }>({ present: 0, absent: 0, offDuty: 0 });

  useEffect(() => {
    getAttendanceSummary(date, unitId).then(setSummary);
  }, [date, unitId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Present</CardTitle>
        </CardHeader>
        <CardContent>{summary.present}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Absent</CardTitle>
        </CardHeader>
        <CardContent>{summary.absent}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Off duty</CardTitle>
        </CardHeader>
        <CardContent>{summary.offDuty}</CardContent>
      </Card>
    </div>
  );
}
