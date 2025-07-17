// app/components/correspondence/ReplyModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ReplyModal({
  open,
  onClose,
  originalId,
}: {
  open: boolean;
  onClose(): void;
  originalId: number;
}) {
  const [body, setBody] = useState("");

  useEffect(() => {
    if (open) {
      // TODO: optionally fetch original to quote
      setBody(`\n\n---\nReplying to memo #${originalId}:\n`);
    }
  }, [open, originalId]);

  const handleSend = () => {
    // TODO: send reply
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Reply to Memo #{originalId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label>Message</Label>
            <Textarea
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend}>Send Reply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
