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
import {
  fetchFilteredLeaves,
  fetchLeavesPages,
  LeaveRequest,
} from "@/lib/actions/leaveActions";
import { Spinner } from "../ui/spinner";

interface Props {
  query: string;
  currentPage: number;
  startDate: string;
  endDate: string;
  view: "annual" | "sick" | "offDuty" | "maternity";
}

export default function LeavesTable({
  query,
  currentPage,
  startDate,
  endDate,
  view,
}: Props) {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    // fetch total pages
    fetchLeavesPages(query, view.toUpperCase(), startDate, endDate).then(
      setTotalPages
    );
  }, [query, view, startDate, endDate]);

  useEffect(() => {
    setLoading(true);
    fetchFilteredLeaves(
      query,
      view.toUpperCase(),
      currentPage,
      startDate,
      endDate
    )
      .then(setLeaves)
      .catch((e) => {
        console.error("Failed to load leaves", e);
        setLeaves([]);
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

  if (!leaves.length) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        No {view} leave requests found.
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
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaves.map((lr) => (
            <TableRow key={lr.id}>
              <TableCell>{lr.staff_number}</TableCell>
              <TableCell>
                {lr.first_name} {lr.middle_name ? `${lr.middle_name} ` : ""}
                {lr.last_name}
              </TableCell>
              <TableCell>{lr.type.replace("_", " ")}</TableCell>
              <TableCell>{lr.start_date}</TableCell>
              <TableCell>{lr.end_date ?? "—"}</TableCell>
              <TableCell>{lr.status.replace("_", " ")}</TableCell>
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
