// components/attendance/AttendanceTable.tsx
"use client";

import React, { useEffect, useState, useActionState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Spinner } from "../ui/spinner";

import {
  AllocationActionState,
  Assignment,
} from "@/lib/definitions/allocationDefinitions";
import {
  deleteAssignment,
  getAssignments,
} from "@/lib/actions/allocationActions";
import { toast } from "sonner";
import ConfirmationModal from "./deleteAssignmentConfirmationModal";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

interface Props {
  unitId: number;
  createAssignmentSuccess: { bol: boolean; message: string };
}

export default function AssignAllocationTable({
  unitId,
  createAssignmentSuccess,
}: Props) {
  const router = useRouter();
  // 1) Load units & staff
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  // 2) Selected unit & its assignments
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const loadAssignments = (unitId: number) => {
    setAssignmentLoading(true);
    try {
      getAssignments(unitId).then(setAssignments);
    } catch (error) {
      console.error("Failed to load assignments", error);
    } finally {
      setAssignmentLoading(false);
    }
  };

  useEffect(() => {
    if (unitId) loadAssignments(unitId);
    else setAssignments([]);
  }, [unitId]);

  const initialState: AllocationActionState = {
    message: null,
    state_error: null,
    errors: {},
  };

  const [state, deleteAction, isPending] = useActionState(
    deleteAssignment,
    initialState
  );

  // reload after success
  useEffect(() => {
    if (state.message && !state.state_error) {
      if (unitId) loadAssignments(unitId);
      toast.success(state.message);
    } else if (
      createAssignmentSuccess.bol === true &&
      createAssignmentSuccess.message
    ) {
      if (unitId) loadAssignments(unitId);
      toast.success(createAssignmentSuccess.message);
    }
  }, [
    createAssignmentSuccess.bol,
    createAssignmentSuccess.message,
    state.message,
    state.state_error,
    unitId,
  ]);

  if (assignmentLoading) {
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
            <TableHead>Role</TableHead>
            <TableHead>Staff</TableHead>
            <TableHead>Staff Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Unassign</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((a) => (
            <TableRow key={a.id}>
              <TableCell>{a.role_title}</TableCell>
              <TableCell>
                {a.staff.first_name} {a.staff.last_name}
              </TableCell>
              <TableCell>{a.staff.staff_number}</TableCell>
              <TableCell>{a.start_date}</TableCell>
              <TableCell className="text-right">
                <ConfirmationModal
                  assignment={a}
                  deleteAction={deleteAction}
                  isPending={isPending}
                />
              </TableCell>
            </TableRow>
          ))}
          {assignments.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                No assignments yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
