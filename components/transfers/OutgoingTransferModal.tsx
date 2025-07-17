// app/components/transfers/OutgoingTransferModal.tsx
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getStaffs } from "@/lib/actions/staffActions";

interface Props {
  open: boolean;
  onClose(): void;
}

export default function OutgoingTransferModal({ open, onClose }: Props) {
  const [staffList, setStaffList] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selected, setSelected] = useState<string>("");
  const [letter, setLetter] = useState("Dear …\n\nWe hereby release …");
  const [signedFile, setSignedFile] = useState<File | null>(null);

  React.useEffect(() => {
    getStaffs().then((s) =>
      setStaffList(
        s.map((st) => ({
          id: String(st.id),
          name: `${st.first_name} ${st.last_name}`,
        }))
      )
    );
  }, []);

  const handleDownload = () => {
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "release-letter.txt";
    a.click();
  };

  const handleSubmit = () => {
    // TODO: save pending state, then upload signedFile
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Initiate Outgoing Transfer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Select Staff</Label>
            <Select value={selected} onValueChange={setSelected}>
              <SelectTrigger>
                <SelectValue placeholder="Choose staff…" />
              </SelectTrigger>
              <SelectContent>
                {staffList.map((st) => (
                  <SelectItem key={st.id} value={st.id}>
                    {st.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Draft Release Letter</Label>
            <textarea
              className="w-full border rounded p-2"
              rows={6}
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
            />
            <div className="mt-2">
              <Button variant="outline" onClick={handleDownload}>
                Download Draft
              </Button>
            </div>
          </div>

          <div>
            <Label>Upload Signed Letter</Label>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => setSignedFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!selected || !signedFile} onClick={handleSubmit}>
            {signedFile ? "Submit Transfer" : "Waiting for signed letter…"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
