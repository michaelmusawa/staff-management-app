// components/attendance/AttendanceTable.tsx
"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  startTransition,
} from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "../ui/spinner";
import { getAttendance, saveAttendance } from "@/lib/actions/attendanceActions";
import { Button } from "@/components/ui/button";

interface AttendanceRecord {
  id?: number;
  staff_id: number;
  staff_name: string;
  staff_number: string;
  status: "PRESENT" | "ABSENT";
}

interface Props {
  query: string;
  date: string;
  unitId: number;
}

export default function AttendanceTable({ query, date, unitId }: Props) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // local present/absent marks
  const [marks, setMarks] = useState<Record<number, boolean>>({});

  // load data
  const load = useCallback(async () => {
    if (!unitId) {
      setRecords([]);
      return;
    }
    setLoading(true);
    try {
      const all = await getAttendance(String(unitId), {
        date: date || undefined,
        query: query || undefined,
      });
      setRecords(all);
      // initialize marks from loaded status
      const initMarks: Record<number, boolean> = {};
      all.forEach((r) => {
        initMarks[r.staff_id] = r.status === "PRESENT";
      });
      setMarks(initMarks);
    } catch (e) {
      console.error("Failed to load attendance", e);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [query, date, unitId]);

  useEffect(() => {
    load();
  }, [load]);

  // toggle a single mark
  const toggleMark = (staff_id: number, present: boolean) => {
    setMarks((m) => ({ ...m, [staff_id]: present }));
  };

  // submit all marks
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await Promise.all(
        records.map(async (r) => {
          const present = Boolean(marks[r.staff_id]);
          const fm = new FormData();
          if (r.id) fm.set("id", String(r.id));
          fm.set("date", date);
          fm.set("unitId", String(unitId));
          fm.set("staff_id", String(r.staff_id));
          fm.set("staffNumber", r.staff_number);
          fm.set("status", present ? "PRESENT" : "ABSENT");
          const result = await saveAttendance(null, fm);
          if (result.state_error) {
            console.error(
              `Error saving ${r.staff_number}:`,
              result.state_error
            );
          }
        })
      );
      // reload after all done
      startTransition(() => {
        load();
      });
    } catch (e) {
      console.error("Batch save error:", e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Present</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Staff #</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((r) => (
            <TableRow
              key={r.staff_number}
              className={submitting ? "opacity-50" : ""}
            >
              <TableCell>
                <Checkbox
                  checked={marks[r.staff_id]}
                  onCheckedChange={(chk) =>
                    toggleMark(r.staff_id, Boolean(chk))
                  }
                  disabled={submitting}
                />
              </TableCell>
              <TableCell>{r.staff_name}</TableCell>
              <TableCell>{r.staff_number}</TableCell>
            </TableRow>
          ))}
          {records.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                No one to mark (everyone on leave/sick or no staff)
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={submitting || !records.length}
          variant="primary"
        >
          {submitting ? (
            <>
              <Spinner size="sm" className="mr-2" /> Saving…
            </>
          ) : (
            "Submit Attendance"
          )}
        </Button>
      </div>
    </>
  );
}
