// app/components/attendance/HolidayManager.tsx
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

interface Props {
  open: boolean;
  onClose(): void;
  date: Date;
  onHolidaySet: (dates: Date[]) => void;
}

export default function HolidayManager({
  open,
  onClose,
  date,
  onHolidaySet,
}: Props) {
  const [start, setStart] = useState(date.toISOString().slice(0, 10));
  const [end, setEnd] = useState(date.toISOString().slice(0, 10));

  const save = () => {
    const dates: Date[] = [];
    const s = new Date(start),
      e = new Date(end);
    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    onHolidaySet(dates);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Mark Holiday</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <label>From:</label>
            <Input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div>
            <label>To:</label>
            <Input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Save Holiday</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
