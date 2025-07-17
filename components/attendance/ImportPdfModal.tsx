// app/components/attendance/ImportPdfModal.tsx
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

interface Props {
  open: boolean;
  onClose(): void;
  onImported(): void;
}

export default function ImportPdfModal({ open, onClose, onImported }: Props) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleUpload = async () => {
    if (!files) return;
    setProcessing(true);
    // TODO: send files to backend/PDF parser, then onImported()
    await new Promise((r) => setTimeout(r, 1500));
    setProcessing(false);
    onImported();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Attendance PDF</DialogTitle>
        </DialogHeader>
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!files || processing}>
            {processing ? "Processing…" : "Upload & Parse"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
