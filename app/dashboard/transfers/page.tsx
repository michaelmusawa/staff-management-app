"use client";

import TransferModal from "@/components/transfers/TransferModal";
import TransfersTable from "@/components/transfers/TransfersTable";
import TransferTabs from "@/components/transfers/TransferTabs";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DateFilter from "@/components/ui/dateRangeFilter";
import Search from "@/components/ui/search";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const Page = () => {
  // const [totalPages, setTotalPages] = useState(0);
  const searchParams = useSearchParams();

  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const [view, setView] = useState<"incoming" | "outgoing">("incoming");

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Transfer Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage & record incoming and outgoing staff transfers days
          </p>
        </div>

        <TransferTabs view={view} setView={setView} />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search placeholder="Search transfers..." />
          </div>

          <div className="flex items-center gap-4">
            <DateFilter />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{view} transfers</CardTitle>
          <div className="flex justify-between">
            <CardDescription>
              {view} transfers that have occurred
            </CardDescription>
            <CardDescription>
              <TransferModal view={view} />
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <TransfersTable
            query={query}
            currentPage={currentPage}
            startDate={startDate}
            endDate={endDate}
            view={view}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;

// // app/leaves/page.tsx
// "use client";

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import RecentLeaves from "@/components/leaves/RecentLeaves";
// import LeaveRequestModal from "@/components/leaves/LeaveRequestModal";
// import LeaveApprovalModal from "@/components/leaves/LeaveApprovalModal";

// export default function LeavesPage() {
//   const [view, setView] = useState<"pending" | "approved" | "onLeave">(
//     "pending"
//   );
//   const [showRequest, setShowRequest] = useState(false);
//   const [showApproval, setShowApproval] = useState(false);

//   return (
//     <div className="p-6 space-y-6">
//       <header className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Leave Management</h1>
//         <Button onClick={() => setShowRequest(true)}>New Leave Request</Button>
//       </header>

//       <Tabs value={view} onValueChange={(v) => setView(v as any)}>
//         <TabsList>
//           <TabsTrigger value="pending">Pending</TabsTrigger>
//           <TabsTrigger value="approved">Approved</TabsTrigger>
//           <TabsTrigger value="onLeave">On Leave</TabsTrigger>
//         </TabsList>

//         <TabsContent value="pending">
//           <RecentLeaves
//             status="PENDING"
//             onApprove={() => setShowApproval(true)}
//           />
//         </TabsContent>
//         <TabsContent value="approved">
//           <RecentLeaves status="APPROVED" />
//         </TabsContent>
//         <TabsContent value="onLeave">
//           <RecentLeaves status="ON_LEAVE" />
//         </TabsContent>
//       </Tabs>

//       <LeaveRequestModal
//         open={showRequest}
//         onClose={() => setShowRequest(false)}
//       />

//       <LeaveApprovalModal
//         open={showApproval}
//         onClose={() => setShowApproval(false)}
//       />
//     </div>
//   );
// }

// // app/transfers/page.tsx
// "use client";

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import RecentTransfers from "@/components/transfers/RecentTransfers";
// import IncomingTransferModal from "@/components/transfers/IncomingTransferModal";
// import OutgoingTransferModal from "@/components/transfers/OutgoingTransferModal";

// export default function TransfersPage() {
//   const [tab, setTab] = useState<"incoming" | "outgoing">("incoming");
//   const [showIncoming, setShowIncoming] = useState(false);
//   const [showOutgoing, setShowOutgoing] = useState(false);

//   return (
//     <div className="p-6 space-y-6">
//       <header className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Staff Transfers</h1>
//         <Button
//           onClick={() =>
//             tab === "incoming" ? setShowIncoming(true) : setShowOutgoing(true)
//           }
//         >
//           {tab === "incoming" ? "Register Incoming" : "Initiate Outgoing"}
//         </Button>
//       </header>

//       <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
//         <TabsList>
//           <TabsTrigger value="incoming">Incoming</TabsTrigger>
//           <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
//         </TabsList>

//         <TabsContent value="incoming">
//           <RecentTransfers type="incoming" />
//         </TabsContent>
//         <TabsContent value="outgoing">
//           <RecentTransfers type="outgoing" />
//         </TabsContent>
//       </Tabs>

//       <IncomingTransferModal
//         open={showIncoming}
//         onClose={() => setShowIncoming(false)}
//       />

//       <OutgoingTransferModal
//         open={showOutgoing}
//         onClose={() => setShowOutgoing(false)}
//       />
//     </div>
//   );
// }
