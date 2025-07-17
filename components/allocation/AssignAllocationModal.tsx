"use client";

import { Staff } from "@/lib/definitions/staffDefinitions";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Button } from "../ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SelectRole from "./SelectRole";
import SelectStaffModal from "./SelectStaffModal";

export type AssignmentSuccess = {
  bol: boolean;
  message: string;
};

export default function AssignAllocationModal({
  selectedUnit,
  setCreateAssignmentSuccess,
}: {
  selectedUnit: any;
  setCreateAssignmentSuccess: (success: AssignmentSuccess) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={`flex items-center gap-2`}>
          <FiPlus className="text-lg" />

          <span>{"Assign Staff"}</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Staff</DialogTitle>
          <DialogDescription>Select a role to assign.</DialogDescription>
        </DialogHeader>
        {selectedStaff ? (
          <SelectRole
            selectedUnit={selectedUnit}
            staff={selectedStaff}
            setIsOpen={setIsOpen}
            setSelectedStaff={setSelectedStaff}
            setCreateAssignmentSuccess={setCreateAssignmentSuccess}
          />
        ) : (
          <SelectStaffModal
            setSelectedStaff={setSelectedStaff}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
