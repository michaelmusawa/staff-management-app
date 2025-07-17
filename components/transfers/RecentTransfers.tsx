// app/components/transfers/RecentTransfers.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Transfer {
  id: number;
  staffName: string;
  staffNumber: string;
  date: string;
  fromUnit?: string;
  toUnit?: string;
  status: "Pending" | "Completed";
}

export default function RecentTransfers({
  type,
}: {
  type: "incoming" | "outgoing";
}) {
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  useEffect(() => {
    // TODO: replace with real fetch
    const dummy: Transfer[] = Array.from({ length: 5 }).map((_, i) => ({
      id: i + 1,
      staffName: `Staff ${i + 1}`,
      staffNumber: `2000${i + 1}`,
      date: new Date().toISOString().slice(0, 10),
      fromUnit: type === "incoming" ? `Unit ${i}` : undefined,
      toUnit: type === "outgoing" ? `Unit ${i}` : undefined,
      status: i % 2 === 0 ? "Completed" : "Pending",
    }));
    setTransfers(dummy);
  }, [type]);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Staff</TableHead>
            <TableHead>Staff #</TableHead>
            {type === "incoming" ? (
              <TableHead>From Unit</TableHead>
            ) : (
              <TableHead>To Unit</TableHead>
            )}
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transfers.map((t) => (
            <TableRow key={t.id}>
              <TableCell>{t.date}</TableCell>
              <TableCell>{t.staffName}</TableCell>
              <TableCell>{t.staffNumber}</TableCell>
              <TableCell>
                {type === "incoming" ? t.fromUnit : t.toUnit}
              </TableCell>
              <TableCell>{t.status}</TableCell>
              <TableCell>
                <Button size="sm">View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 text-right">
        <Button variant="link">
          View All {type === "incoming" ? "Incoming" : "Outgoing"}
        </Button>
      </div>
    </div>
  );
}
