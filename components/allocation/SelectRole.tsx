import React, { useActionState, useEffect } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createAssignment } from "@/lib/actions/allocationActions";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Staff } from "@/lib/definitions/staffDefinitions";
import { AllocationActionState } from "@/lib/definitions/allocationDefinitions";
import { AssignmentSuccess } from "./AssignAllocationModal";

const SelectRole = ({
  selectedUnit,
  staff,
  setIsOpen,
  setSelectedStaff,
  setCreateAssignmentSuccess,
}: {
  selectedUnit: any;
  staff: Staff;
  setIsOpen: (bol: boolean) => void;
  setSelectedStaff: (staff: Staff | null) => void;
  setCreateAssignmentSuccess: (success: AssignmentSuccess) => void;
}) => {
  const initialState: AllocationActionState = {
    message: null,
    state_error: null,
    errors: {},
  };

  const [state, formAction, isPending] = useActionState(
    createAssignment,
    initialState
  );

  // 3) on success → toast + auto‑close
  useEffect(() => {
    if (state.message && !state.state_error) {
      setCreateAssignmentSuccess({ bol: true, message: state.message });
      // close after a moment so they see it
      setTimeout(() => {
        setIsOpen(false);
        setSelectedStaff(null);
      }, 300);
    }
    if (state.state_error) {
      toast.error(state.state_error);
    }
  }, [state.message, state.state_error]);

  return (
    <div className="space-y-4">
      <div>
        <p>Staff Details</p>
        <p>
          name: {staff.first_name} {staff.last_name}
        </p>
        <p>Staff Number: {staff.staff_number}</p>
      </div>
      <Label htmlFor="role_id">Select Role</Label>
      <form action={formAction}>
        <input type="hidden" name="staff_id" value={staff.id} />
        <input type="hidden" name="org_unit_id" value={selectedUnit.id} />
        <Select name="role_id">
          <SelectTrigger id="role_id" className="w-full">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {selectedUnit && selectedUnit.roles.length > 0 ? (
              selectedUnit.roles.map((r, idx) => (
                <SelectItem key={idx} value={String(r.id)}>
                  {r.title}
                </SelectItem>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No roles available for this unit
              </div>
            )}
          </SelectContent>
        </Select>

        {state.errors?.role_id && (
          <p className="text-red-600 text-sm mt-1">{state.errors.role_id[0]}</p>
        )}

        <div className="space-y-2">
          <Label>Unit Details</Label>
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium">{selectedUnit?.name}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedUnit?.description}
            </p>
            <div className="mt-3">
              <p className="text-sm font-medium">Available Roles:</p>
              <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                {selectedUnit?.roles.map((role, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-current mr-2"></span>
                    {role.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={() => setSelectedStaff(null)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Assigning..." : "Assign Staff"}
        </Button>
      </form>
    </div>
  );
};

export default SelectRole;
