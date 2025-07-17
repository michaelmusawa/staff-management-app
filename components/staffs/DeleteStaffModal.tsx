import React, { useActionState, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Staff, StaffActionState } from "@/lib/definitions/staffDefinitions";
import { FiTrash } from "react-icons/fi";
import { deleteStaff } from "@/lib/actions/staffActions";

const DeleteStaffModal = ({ showDelete }: { showDelete: Staff }) => {
  const [isOpen, setIsOpen] = useState(false);

  const initial: StaffActionState = {
    message: null,
    state_error: null,
    errors: {},
  };
  const [state, formAction, isPending] = useActionState(deleteStaff, initial);

  // Close modal on successful submission
  if (state.message && !state.state_error && isOpen) {
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-center items-center">
          <FiTrash className="text-lg " />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {showDelete?.first_name}{" "}
            {showDelete?.last_name}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <form action={formAction}>
            <input type="hidden" name="id" defaultValue={showDelete.id} />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Processing..." : "Yes, delete"}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStaffModal;
