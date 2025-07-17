"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Spinner } from "../ui/spinner";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  fetchFilteredStaffs,
  fetchStaffsPages,
} from "@/lib/actions/staffActions";
import { Staff } from "@/lib/definitions/staffDefinitions";

interface Props {
  isOpen: boolean;
  setIsOpen: (bol: boolean) => void;
  setSelectedStaff: (staff: Staff) => void;
}

export default function SelectStaffModal({
  isOpen,
  setIsOpen,
  setSelectedStaff,
}: Props) {
  const [staffQuery, setStaffQuery] = useState("");
  const [staffPage, setStaffPage] = useState(1);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  // debounce the query to avoid too‑many calls
  const debounceRef = useRef<NodeJS.Timeout>(0);

  // Whenever the raw query changes, reset page and debounce the real fetch
  useEffect(() => {
    setStaffPage(1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchStaffsPages(staffQuery).then(setTotalPages);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [staffQuery]);

  // Fetch the current page whenever debouncedQuery or page changes
  useEffect(() => {
    setLoading(true);
    fetchFilteredStaffs(staffQuery, staffPage)
      .then(setStaffs)
      .catch(() => setStaffs([]))
      .finally(() => setLoading(false));
  }, [staffQuery, staffPage]);

  const handleStaffClick = (s: Staff) => {
    setSelectedStaff(s);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-full max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Staff for Leave</DialogTitle>
          <DialogDescription>
            Search and choose a staff member to start your leave request.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 flex-1 overflow-auto">
          {/* Fixed: grab value from event.target */}
          <div className="mb-4">
            <Input
              placeholder="Search staff…"
              value={staffQuery}
              onChange={(e) => setStaffQuery(e.currentTarget.value)}
            />
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Spinner />
            </div>
          ) : staffs.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              No staff found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff #</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rank</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffs.map((s) => (
                  <TableRow
                    key={s.id}
                    className="cursor-pointer hover:bg-accent/10"
                    onClick={() => handleStaffClick(s)}
                  >
                    <TableCell>{s.staff_number}</TableCell>
                    <TableCell>
                      {s.first_name} {s.middle_name ? `${s.middle_name} ` : ""}
                      {s.last_name}
                    </TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.rank}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t flex justify-center items-center space-x-4">
            <Button
              variant="outline"
              disabled={staffPage <= 1}
              onClick={() => setStaffPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span>
              Page {staffPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={staffPage >= totalPages}
              onClick={() => setStaffPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
