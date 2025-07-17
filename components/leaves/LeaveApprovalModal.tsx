// app/components/leaves/LeaveApprovalModal.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LeaveApprovalModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose(): void;
}) {
  const [pdf, setPdf] = useState<File | null>(null);

  function handleApprove() {
    // TODO: upload signed PDF, mark leave APPROVED
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Approve Leave</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Label>Upload Signed Approval (PDF)</Label>
          <Input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files?.[0] || null)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!pdf} onClick={handleApprove}>
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
