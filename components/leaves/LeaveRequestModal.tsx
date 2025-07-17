// app/components/leaves/LeaveRequestModal.tsx
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function LeaveRequestModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose(): void;
}) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [type, setType] = useState<
    "SICK" | "MATERNITY" | "PATERNITY" | "ANNUAL" | "OFF_DUTY"
  >("SICK");
  const [staffId, setStaffId] = useState<string>("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [draft, setDraft] = useState("");

  function next() {
    setStep((s) => (s < 2 ? ((s + 1) as 0 | 1 | 2) : 2));
  }
  function prev() {
    setStep((s) => (s > 0 ? ((s - 1) as 0 | 1 | 2) : 0));
  }
  function submit() {
    // TODO: save leave request
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Leave Request</DialogTitle>
        </DialogHeader>

        {step === 0 && (
          <div className="space-y-4 py-4">
            <div>
              <Label>Select Staff</Label>
              <Select value={staffId} onValueChange={setStaffId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pick a staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Alice Mwangi</SelectItem>
                  <SelectItem value="2">Bob Otieno</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Leave Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SICK">Sick</SelectItem>
                  <SelectItem value="MATERNITY">Maternity</SelectItem>
                  <SelectItem value="PATERNITY">Paternity</SelectItem>
                  <SelectItem value="ANNUAL">Annual</SelectItem>
                  <SelectItem value="OFF_DUTY">Off Duty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {type !== "ANNUAL" && type !== "OFF_DUTY" && (
              <div>
                <Label>Supporting Doc (PDF)</Label>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdf(e.target.files?.[0] || null)}
                />
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 py-4">
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            {(type === "ANNUAL" || type === "OFF_DUTY") && (
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </div>
            )}
            <div>
              <Label>Draft Request</Label>
              <textarea
                className="w-full border rounded p-2"
                rows={4}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <h3 className="font-semibold">Preview</h3>
            <div className="border p-4 whitespace-pre-wrap">{draft}</div>
            <Button
              variant="outline"
              onClick={() => {
                const blob = new Blob([draft], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "leave-request.txt";
                a.click();
              }}
            >
              Download Draft
            </Button>
          </div>
        )}

        <DialogFooter className="gap-2">
          {step > 0 && (
            <Button variant="outline" onClick={prev}>
              Back
            </Button>
          )}
          {step < 2 && (
            <Button
              disabled={
                step === 0 &&
                (!staffId ||
                  (pdf === null && type !== "ANNUAL" && type !== "OFF_DUTY"))
              }
              onClick={next}
            >
              Next
            </Button>
          )}
          {step === 2 && <Button onClick={submit}>Submit Request</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
