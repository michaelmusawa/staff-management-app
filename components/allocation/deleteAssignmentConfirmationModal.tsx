"use client";

import { useState } from "react";
import { Button } from "../ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Assignment } from "@/lib/definitions/allocationDefinitions";
import { FiTrash2 } from "react-icons/fi";

export default function ConfirmationModal({
  assignment,
  deleteAction,
  isPending,
}: {
  assignment: Assignment;
  deleteAction: any;
  isPending: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="text-right">
          <FiTrash2 className="text-destructive" />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Delete Assignment</DialogTitle>
          <DialogDescription>
            Do you want to delete the role of {assignment.role_title} from{" "}
            {assignment.staff.first_name} {assignment.staff.last_name}
          </DialogDescription>
        </DialogHeader>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={assignment.id} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              Approve
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
