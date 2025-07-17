// components/staffs/StaffsTable.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { fetchFilteredStaffs } from "@/lib/actions/staffActions";
import { Staff } from "@/lib/definitions/staffDefinitions";
import ViewStaffModal from "./ViewStaffModal";
import AddStaffModal from "./AddStaffModal";
import DeleteStaffModal from "./DeleteStaffModal";
import { getStatusVariant } from "@/lib/utils/staffUtils";
import TableSkeleton from "./TableSkeleton";

const PAGE_SIZE = 10;

interface Props {
  query: string;
  currentPage: number;
}

export default function StaffsTable({ query, currentPage }: Props) {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetchFilteredStaffs(query, currentPage)
      .then((data) => setStaffs(data))
      .catch((err) => {
        console.error("Failed to fetch staffs:", err);
        setStaffs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query, currentPage]);

  // While loading, show skeleton
  if (loading) {
    return <TableSkeleton />;
  }

  // When not loading, render the table (or “no data” message)
  if (!staffs.length) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        No staff found.
      </div>
    );
  }

  const offset = (currentPage - 1) * PAGE_SIZE;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>MAN NO.</TableHead>
          <TableHead>IPPD No.</TableHead>
          <TableHead>Rank</TableHead>
          <TableHead>GENDER</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {staffs.map((s, i) => (
          <TableRow key={s.id}>
            <TableCell>{offset + i + 1}</TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={s.avatar} />
                  <AvatarFallback>
                    {(s.first_name + " " + s.last_name)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {s.first_name} {s.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground">{s.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>{s.staff_number}</TableCell>
            <TableCell>{s.ippd_number ?? "-"}</TableCell>
            <TableCell>{s.rank}</TableCell>
            <TableCell>{s.gender}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(s.status)}>{s.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <ViewStaffModal showView={s} />
                <AddStaffModal staff={s} />
                <DeleteStaffModal showDelete={s} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
