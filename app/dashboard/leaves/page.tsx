"use client";

import LeavesTable from "@/components/leaves/LeavesTable";
import LeaveTabs from "@/components/leaves/LeaveTabs";
import StaffsModal from "@/components/leaves/StaffsModal";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DateFilter from "@/components/ui/dateRangeFilter";
import Pagination from "@/components/ui/pagination";
import Search from "@/components/ui/search";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const Page = () => {
  // const [totalPages, setTotalPages] = useState(0);
  const searchParams = useSearchParams();

  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const [view, setView] = useState<"annual" | "sick" | "offDuty" | "maternity">(
    "annual"
  );

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Leave Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage staff annual leave, sick offs, maternity/paternity and off
            days
          </p>
        </div>

        <LeaveTabs view={view} setView={setView} />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search placeholder="Search leaves..." />
          </div>

          <div className="flex items-center gap-4">
            <DateFilter />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{view}</CardTitle>
          <div className="flex justify-between">
            <CardDescription>Personnel on {view} leave</CardDescription>
            <CardDescription>
              <StaffsModal view={view} />
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <LeavesTable
            query={query}
            currentPage={currentPage}
            startDate={startDate}
            endDate={endDate}
            view={view}
          />

          {/* <div className="mt-6 flex justify-center">
            <Pagination totalPages={totalPages} />
          </div> */}
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
