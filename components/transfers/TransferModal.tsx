// components/transfers/TransferModal.tsx
"use client";

import React, { useState, useEffect, FormEvent } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useActionState } from "react";
import { Staff } from "@/lib/definitions/staffDefinitions";
import { PDFViewer } from "@react-pdf/renderer";
import { toast } from "sonner";
import { getStaffById, getStaffByNumber } from "@/lib/actions/leaveActions";
import SelectStaffModal from "../allocation/SelectStaffModal";
import { createTransfer } from "@/lib/actions/transferActions";

// Dynamically import PDFDownloadLink if you want inline downloads
// const PDFDownloadLink = dynamic(
//   () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
//   { ssr: false }
// );

interface Props {
  view: "incoming" | "outgoing";
}

export default function TransferModal({ view }: Props) {
  const [open, setOpen] = useState(false);

  // Incoming state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [parsedStaffNumber, setParsedStaffNumber] = useState("");
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loadingParse, setLoadingParse] = useState(false);

  // Outgoing state
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [letterBody, setLetterBody] = useState("");

  const [actionState, action, isPending] = useActionState(createTransfer, {
    message: null,
    state_error: null,
    errors: {},
  });

  // 1) Handlers for incoming: parse PDF & lookup
  const parseAndLookup = async (file: File) => {
    setLoadingParse(true);
    try {
      // TODO: replace this stub with real PDF text‐extraction
      const text = await file.text();
      // naive regex for staff number:
      const match = text.match(/\b\d{5,}\b/);
      const sn = match?.[0] ?? "";
      setParsedStaffNumber(sn);
      if (sn) {
        const s = await getStaffByNumber(sn);
        setStaff(s);
      }
    } catch (e) {
      console.error("Failed to parse PDF", e);
      toast.error("Could not read PDF for staff number");
    } finally {
      setLoadingParse(false);
    }
  };

  // re‐lookup on manual change
  useEffect(() => {
    if (parsedStaffNumber.length >= 5) {
      getStaffById(parsedStaffNumber)
        .then((s) => setStaff(s))
        .catch(() => setStaff(null));
    }
  }, [parsedStaffNumber]);

  // 2) Submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const fm = new FormData();
    fm.set("type", view === "incoming" ? "INCOMING" : "OUTGOING");
    if (view === "incoming") {
      if (!pdfFile || !staff) {
        toast.error("Need a valid PDF & staff");
        return;
      }
      fm.set("staff_number", parsedStaffNumber);
      fm.set("letter_pdf", pdfFile);
      fm.set("from_unit", ""); // optional incoming meta
      fm.set("to_unit", staff?.unit ?? "");
    } else {
      // outgoing
      if (!selectedStaff || !letterBody) {
        toast.error("Select staff and draft letter");
        return;
      }
      fm.set("staff_id", String(selectedStaff.id));
      fm.set("draft_text", letterBody);
    }
    action(fm);
  };

  // on success, close modal
  useEffect(() => {
    if (actionState.message && !actionState.state_error) {
      toast.success(actionState.message);
      setOpen(false);
    }
    if (actionState.state_error) {
      toast.error(actionState.state_error);
    }
  }, [actionState]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {view === "incoming" ? "Record Incoming" : "Record Outgoing"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {view === "incoming"
              ? "New Incoming Transfer"
              : "New Outgoing Transfer"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          {view === "incoming" ? (
            <>
              <div>
                <Label>Upload Transfer Letter (PDF)</Label>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setPdfFile(f);
                    if (f) parseAndLookup(f);
                  }}
                />
              </div>

              {loadingParse ? (
                <Spinner />
              ) : (
                <>
                  <div>
                    <Label>Staff Number</Label>
                    <Input
                      value={parsedStaffNumber}
                      onChange={(e) => setParsedStaffNumber(e.target.value)}
                    />
                  </div>
                  {staff ? (
                    <div className="p-4 bg-gray-50 rounded">
                      <p>
                        <strong>
                          {staff.first_name} {staff.last_name}
                        </strong>{" "}
                        (#{staff.staff_number})
                      </p>
                      <small>{staff.email}</small>
                    </div>
                  ) : (
                    <p className="text-sm text-red-600">No staff found</p>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <div>
                <Button variant="outline" onClick={() => setSelectOpen(true)}>
                  {selectedStaff
                    ? `Change: ${selectedStaff.first_name} ${selectedStaff.last_name}`
                    : "Select Staff…"}
                </Button>
              </div>

              {selectedStaff && (
                <div className="p-4 rounded">
                  <p>
                    <strong>
                      {selectedStaff.first_name} {selectedStaff.last_name}
                    </strong>{" "}
                    (#{selectedStaff.staff_number})
                  </p>
                </div>
              )}

              <div>
                <Label>Draft Release Letter</Label>
                <Textarea
                  rows={6}
                  value={letterBody}
                  onChange={(e) => setLetterBody(e.target.value)}
                />
              </div>

              {selectedStaff && (
                <div className="border p-2">
                  {/* <PDFViewer width="100%" height={200}>
                    <TransferLetterPDF
                      staff={selectedStaff}
                      body={letterBody}
                      type="OUTGOING"
                    />
                  </PDFViewer> */}
                </div>
              )}
            </>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Submit"}
            </Button>
          </div>
        </form>

        {/* Nested staff‐picker for outgoing */}
        {view === "outgoing" && (
          <SelectStaffModal
            isOpen={selectOpen}
            setIsOpen={setSelectOpen}
            setSelectedStaff={setSelectedStaff}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
