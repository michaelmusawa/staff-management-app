// components/transfers/TransfersTable.tsx
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
import Pagination from "@/components/ui/pagination";
import { Spinner } from "../ui/spinner";
import {
  fetchFilteredTransfers,
  fetchTransferPages,
  Transfer,
} from "@/lib/actions/transferActions";

interface Props {
  query: string;
  currentPage: number;
  startDate: string;
  endDate: string;
  view: "incoming" | "outgoing";
}

export default function TransfersTable({
  query,
  currentPage,
  startDate,
  endDate,
  view,
}: Props) {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  // 1) total pages
  useEffect(() => {
    fetchTransferPages(
      query,
      view.toUpperCase() as "INCOMING" | "OUTGOING",
      startDate,
      endDate
    ).then(setTotalPages);
  }, [query, view, startDate, endDate]);

  // 2) fetch page of data
  useEffect(() => {
    setLoading(true);
    fetchFilteredTransfers(
      query,
      view.toUpperCase() as "INCOMING" | "OUTGOING",
      currentPage,
      startDate,
      endDate
    )
      .then(setTransfers)
      .catch((e) => {
        console.error("Failed to load transfers", e);
        setTransfers([]);
      })
      .finally(() => setLoading(false));
  }, [query, view, currentPage, startDate, endDate]);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (!transfers.length) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        No {view} transfers found.
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff #</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transfers.map((t) => (
            <TableRow key={t.id}>
              <TableCell>{t.staff_number}</TableCell>
              <TableCell>
                {t.first_name} {t.middle_name ? `${t.middle_name} ` : ""}
                {t.last_name}
              </TableCell>
              <TableCell>{t.type}</TableCell>
              <TableCell>{t.from_unit || "—"}</TableCell>
              <TableCell>{t.to_unit || "—"}</TableCell>
              <TableCell>
                {new Date(t.requested_at).toLocaleDateString()}
              </TableCell>
              <TableCell>{t.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 flex justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
