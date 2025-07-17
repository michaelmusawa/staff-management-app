// app/components/attendance/OffDayAccrual.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getOffDayAccrual } from "@/lib/actions/attendanceActions";

interface Props {
  unitId?: string;
}

export default function OffDayAccrual({ unitId }: Props) {
  const [data, setData] = useState<{ staffName: string; offDays: number }[]>(
    []
  );

  useEffect(() => {
    if (unitId) {
      getOffDayAccrual(unitId).then(setData);
    }
  }, [unitId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Off‑Day Accrual</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {data.map((d) => (
            <li key={d.staffName} className="flex justify-between">
              <span>{d.staffName}</span>
              <span>{d.offDays} days</span>
            </li>
          ))}
          {data.length === 0 && (
            <p className="text-muted-foreground">No data.</p>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
