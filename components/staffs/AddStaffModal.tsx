"use client";

import { Staff, StaffActionState } from "@/lib/definitions/staffDefinitions";
import { useEffect, useState } from "react";
import { FiEdit2, FiPlus } from "react-icons/fi";
import { Button } from "../ui/button";
import { StaffForm } from "./StaffForm";
import { createStaff, updateStaff } from "@/lib/actions/staffActions";
import { useActionState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AddUserModal({ staff }: { staff?: Staff }) {
  const [isOpen, setIsOpen] = useState(false);
  const initialState: StaffActionState = {
    message: null,
    state_error: null,
    errors: {},
  };

  const action = staff ? updateStaff : createStaff;
  const [state, formAction, isPending] = useActionState(action, initialState);

  // 3) on success → toast + auto‑close
  useEffect(() => {
    if (state.message && !state.state_error) {
      toast.success(state.message);
      // close after a moment so they see it
      setTimeout(() => setIsOpen(false), 300);
    }
    if (state.state_error) {
      toast.error(state.state_error);
    }
  }, [state.message, state.state_error]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {staff ? (
          <div className="flex justify-center items-center">
            <FiEdit2 className="text-lg " />
          </div>
        ) : (
          <Button className={`flex items-center gap-2`}>
            <FiPlus className="text-lg" />

            <span>{"Add Staff"}</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{staff ? "Edit Staff" : "Add New Staff"}</DialogTitle>
        </DialogHeader>

        <form action={formAction}>
          {staff && <input type="hidden" name="staffId" value={staff.id} />}

          <StaffForm formData={staff} errors={state.errors} />

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Processing..."
                : staff
                ? "Update Staff"
                : "Add Staff"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
