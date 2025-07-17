// app/components/transfers/IncomingTransferModal.tsx
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

interface Props {
  open: boolean;
  onClose(): void;
}

export default function IncomingTransferModal({ open, onClose }: Props) {
  const [pdf, setPdf] = useState<File | null>(null);
  const [parsed, setParsed] = useState<
    Partial<{
      name: string;
      staffNumber: string;
      email: string;
      fromUnit: string;
    }>
  >({});
  const [editing, setEditing] = useState(false);

  const handleUpload = async () => {
    if (!pdf) return;
    // TODO: send to backend for parsing
    // dummy:
    setParsed({
      name: "John Parsed",
      staffNumber: "200123",
      email: "john.parsed@example.com",
      fromUnit: "Unit X",
    });
    setEditing(true);
  };

  const handleSave = () => {
    // TODO: save to DB
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register Incoming Transfer</DialogTitle>
        </DialogHeader>

        {!editing ? (
          <>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdf(e.target.files?.[0] || null)}
            />
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={!pdf} onClick={handleUpload}>
                Parse PDF
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={parsed.name || ""}
                  onChange={(e) =>
                    setParsed((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Staff #</Label>
                <Input
                  value={parsed.staffNumber || ""}
                  onChange={(e) =>
                    setParsed((p) => ({ ...p, staffNumber: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={parsed.email || ""}
                  onChange={(e) =>
                    setParsed((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>From Unit</Label>
                <Input
                  value={parsed.fromUnit || ""}
                  onChange={(e) =>
                    setParsed((p) => ({ ...p, fromUnit: e.target.value }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Transfer</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
