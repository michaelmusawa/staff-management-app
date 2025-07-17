// app/correspondence/page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RecentCorrespondence from "@/components/correspondence/RecentCorrespondence";
import ComposeModal from "@/components/correspondence/ComposeModal";
import ViewDrawer from "@/components/correspondence/ViewDrawer";
import ReplyModal from "@/components/correspondence/ReplyModal";

export default function CorrespondencePage() {
  const [tab, setTab] = useState<"inbox" | "sent" | "drafts">("inbox");
  const [showCompose, setShowCompose] = useState(false);
  const [showViewId, setShowViewId] = useState<number | null>(null);
  const [showReplyId, setShowReplyId] = useState<number | null>(null);

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Correspondence</h1>
        <Button onClick={() => setShowCompose(true)}>New Memo/Letter</Button>
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox">
          <RecentCorrespondence
            box="inbox"
            onView={(id) => setShowViewId(id)}
            onReply={(id) => setShowReplyId(id)}
          />
        </TabsContent>
        <TabsContent value="sent">
          <RecentCorrespondence box="sent" onView={(id) => setShowViewId(id)} />
        </TabsContent>
        <TabsContent value="drafts">
          <RecentCorrespondence
            box="drafts"
            onView={(id) => setShowViewId(id)}
            onEdit={(id) => setShowCompose(true) /* pass id into compose */}
          />
        </TabsContent>
      </Tabs>

      <ComposeModal
        open={showCompose}
        onClose={() => setShowCompose(false)}
        draftId={tab === "drafts" ? undefined : undefined}
      />

      <ViewDrawer
        id={showViewId}
        open={showViewId !== null}
        onClose={() => setShowViewId(null)}
        onReply={(id) => {
          setShowReplyId(id);
          setShowViewId(null);
        }}
      />

      <ReplyModal
        open={showReplyId !== null}
        onClose={() => setShowReplyId(null)}
        originalId={showReplyId!}
      />
    </div>
  );
}
