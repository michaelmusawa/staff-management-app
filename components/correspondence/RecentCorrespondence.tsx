// app/components/correspondence/RecentCorrespondence.tsx
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

type Box = "inbox" | "sent" | "drafts";

interface Item {
  id: number;
  date: string;
  subject: string;
  from: string;
  to: string;
  status: "Draft" | "Sent" | "Received";
}

export default function RecentCorrespondence({
  box,
  onView,
  onReply,
  onEdit,
}: {
  box: Box;
  onView: (id: number) => void;
  onReply?: (id: number) => void;
  onEdit?: (id: number) => void;
}) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    // TODO: fetch real data
    setItems([
      {
        id: 1,
        date: "2025-07-10",
        subject: "Quarterly Report",
        from: "HQ",
        to: "Field Unit",
        status:
          box === "drafts" ? "Draft" : box === "sent" ? "Sent" : "Received",
      },
      {
        id: 2,
        date: "2025-07-12",
        subject: "Equipment Request",
        from: box === "inbox" ? "Supervisor" : "Me",
        to: box === "inbox" ? "Me" : "Logistics",
        status:
          box === "drafts" ? "Draft" : box === "sent" ? "Sent" : "Received",
      },
    ]);
  }, [box]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>{box === "sent" ? "To" : "From"}</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((it) => (
            <TableRow key={it.id}>
              <TableCell>{it.date}</TableCell>
              <TableCell>{it.subject}</TableCell>
              <TableCell>{box === "sent" ? it.to : it.from}</TableCell>
              <TableCell>{it.status}</TableCell>
              <TableCell className="flex gap-2">
                <Button size="sm" onClick={() => onView(it.id)}>
                  View
                </Button>
                {box === "inbox" && onReply && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onReply(it.id)}
                  >
                    Reply
                  </Button>
                )}
                {box === "drafts" && onEdit && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(it.id)}
                  >
                    Edit
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
