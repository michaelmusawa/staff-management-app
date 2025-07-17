// components/views/NominalTable.tsx
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import TableSkeleton from "@/components/staffs/TableSkeleton";
import { fetchFilteredStaffs } from "@/lib/actions/staffActions";
import { Staff } from "@/lib/definitions/staffDefinitions";
import { getStatusVariant } from "@/lib/utils/staffUtils";

import { NominalPDF } from "@/components/views/pdf/NominalPDF";
import { Button } from "@/components/ui/button";
import { useTauriPdfSave } from "@/lib/utils/useTauriPdfSave";

const PAGE_SIZE = 10;

interface Props {
  query: string;
  currentPage: number;
}

export default function NominalTable({ query, currentPage }: Props) {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);

  // PDF exporter
  const savePDF = useTauriPdfSave(
    (docs: { staffs: Staff[] }) => <NominalPDF staffs={docs.staffs} />,
    "nominal-roll.pdf"
  );

  useEffect(() => {
    setLoading(true);
    fetchFilteredStaffs(query, currentPage)
      .then(setStaffs)
      .catch(() => setStaffs([]))
      .finally(() => setLoading(false));
  }, [query, currentPage]);

  if (loading) return <TableSkeleton />;
  if (!staffs.length)
    return (
      <div className="py-10 text-center text-muted-foreground">
        No staff found.
      </div>
    );

  const offset = (currentPage - 1) * PAGE_SIZE;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => savePDF({ staffs })} size="sm">
          📄 Export PDF
        </Button>
      </div>
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
                    <div className="text-sm text-muted-foreground">
                      {s.email}
                    </div>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
