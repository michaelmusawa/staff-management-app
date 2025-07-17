// app/components/leaves/RecentLeaves.tsx
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

interface Leave {
  id: number;
  staffName: string;
  staffNumber: string;
  type: "SICK" | "MATERNITY" | "PATERNITY" | "ANNUAL" | "OFF_DUTY";
  startDate: string;
  endDate?: string;
  status: "PENDING" | "APPROVED" | "ON_LEAVE";
}

export default function RecentLeaves({
  status,
  onApprove,
}: {
  status: "PENDING" | "APPROVED" | "ON_LEAVE";
  onApprove?: () => void;
}) {
  const [leaves, setLeaves] = useState<Leave[]>([]);

  useEffect(() => {
    // TODO: fetch real data
    setLeaves([
      {
        id: 1,
        staffName: "Alice Mwangi",
        staffNumber: "200101",
        type: "SICK",
        startDate: "2025-07-01",
        endDate: "2025-07-05",
        status,
      },
      {
        id: 2,
        staffName: "Bob Otieno",
        staffNumber: "200102",
        type: "ANNUAL",
        startDate: "2025-08-10",
        endDate: "2025-08-20",
        status,
      },
    ]);
  }, [status]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date(s)</TableHead>
            <TableHead>Staff</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaves.map((l) => (
            <TableRow key={l.id}>
              <TableCell>
                {l.endDate ? `${l.startDate} → ${l.endDate}` : l.startDate}
              </TableCell>
              <TableCell>{l.staffName}</TableCell>
              <TableCell>{l.type}</TableCell>
              <TableCell>{l.status}</TableCell>
              <TableCell>
                {status === "PENDING" && onApprove && (
                  <Button size="sm" onClick={() => onApprove()}>
                    Approve
                  </Button>
                )}
                <Button size="sm" variant="link">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 text-right">
        <Button variant="link">View All</Button>
      </div>
    </>
  );
}
