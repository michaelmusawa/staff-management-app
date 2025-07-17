// app/components/correspondence/ViewDrawer.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface Item {
  id: number;
  to: string;
  from: string;
  subject: string;
  body: string;
  attachmentUrl?: string;
}

export default function ViewDrawer({
  id,
  open,
  onClose,
  onReply,
}: {
  id: number | null;
  open: boolean;
  onClose(): void;
  onReply?: (id: number) => void;
}) {
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    if (id !== null) {
      // TODO: fetch item by id
      setItem({
        id,
        to: "Me",
        from: "HQ",
        subject: "Quarterly Report",
        body: "Dear Officer,\nPlease see attached...",
        attachmentUrl: "/dummy.pdf",
      });
    }
  }, [id]);

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent className="sm:max-w-lg">
          <DrawerHeader>
            <DrawerTitle>{item?.subject}</DrawerTitle>
            <DrawerDescription>
              From: {item?.from} • To: {item?.to}
            </DrawerDescription>
          </DrawerHeader>

          {/* Content goes directly here */}
          <div className="p-4 space-y-4">
            <pre className="whitespace-pre-wrap">{item?.body}</pre>
            {item?.attachmentUrl && (
              <Button
                variant="link"
                onClick={() => window.open(item.attachmentUrl)}
              >
                View Attachment
              </Button>
            )}
          </div>

          <DrawerFooter className="flex justify-end space-x-2">
            {onReply && (
              <Button onClick={() => onReply(item!.id)}>Reply</Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
