"use client";

import AttendanceSidebar from "@/components/attendance/AttendanceSidebar";
import AttendanceSummary from "@/components/attendance/AttendanceSummary";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DateFilter from "@/components/ui/dateRangeFilter";
import Search from "@/components/ui/search";
import { OrgUnit } from "@/lib/definitions/orgDefinitions";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const searchParams = useSearchParams();

  const query = searchParams.get("query") || "";
  const date = searchParams.get("date") || "";

  const [useDate, setUseDate] = useState(new Date().toISOString());

  useEffect(() => {
    setUseDate(date);
  }, [date]);

  const [selectedUnit, setSelectedUnit] = useState<OrgUnit | null>(null);

  return (
    <div className="flex h-full">
      <AttendanceSidebar
        selectedUnit={selectedUnit}
        setSelectedUnit={setSelectedUnit}
      />

      <div className="p-6 bg-background min-h-screen">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Attendance Register
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Mark and view personnel register
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search placeholder="Search users..." />
            </div>

            <div className="flex items-center gap-4">
              <DateFilter mode="single" defaultStart="today" />
            </div>

            <div className="flex gap-2">
              <Button>Import PDF</Button>
              <Button variant="outline">Mark Holiday</Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attendance summary</CardTitle>
            <CardDescription>Summary for {selectedUnit?.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceSummary unitId={selectedUnit?.id} date={useDate} />
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardTitle>Attendance</CardTitle>
          <CardDescription>{selectedUnit?.name} staff list</CardDescription>
          <CardContent>
            <AttendanceTable
              query={query}
              date={useDate}
              unitId={selectedUnit?.id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;

// // app/attendance/page.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import { getStaffs } from "@/lib/actions/staffActions";
// import { getOrgUnits } from "@/lib/actions/orgActions";
// import { OrgUnit } from "@/lib/definitions/orgDefinitions";
// import { Staff } from "@/lib/definitions/staffDefinitions";
// import { UnitSidebar } from "@/components/allocation/UnitSidebar";
// import AttendanceHeader from "@/components/attendance/AttendanceHeader";
// import AttendanceSummary from "@/components/attendance/AttendanceSummary";
// import AttendanceTable from "@/components/attendance/AttendanceTable";
// import OffDayAccrual from "@/components/attendance/OffDayAccrual";
// import ImportPdfModal from "@/components/attendance/ImportPdfModal";
// import HolidayManager from "@/components/attendance/HolidayManager";

// export default function AttendancePage() {
//   const [units, setUnits] = useState<OrgUnit[]>([]);
//   const [staffs, setStaffs] = useState<Staff[]>([]);
//   const [selectedUnit, setSelectedUnit] = useState<OrgUnit | null>(null);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [showImport, setShowImport] = useState(false);
//   const [showHolidayMgr, setShowHolidayMgr] = useState(false);

//   useEffect(() => {
//     getOrgUnits().then(setUnits);
//     getStaffs().then(setStaffs);
//   }, []);

//   return (
//     <div className="flex h-full">
//       {/* Sidebar */}
//       <UnitSidebar
//         units={units}
//         selectedId={selectedUnit?.id ?? null}
//         onSelect={setSelectedUnit}
//       />

//       {/* Main area */}
//       <main className="flex-1 p-6 space-y-6 overflow-auto">
//         <AttendanceHeader
//           date={selectedDate}
//           onDateChange={setSelectedDate}
//           onImportClick={() => setShowImport(true)}
//           onMarkHolidayClick={() => setShowHolidayMgr(true)}
//           unitName={selectedUnit?.name}
//         />

//         <AttendanceSummary date={selectedDate} unitId={selectedUnit?.id} />

//         <AttendanceTable date={selectedDate} unitId={selectedUnit?.id} />

//         <OffDayAccrual unitId={selectedUnit?.id} />

//         {/* Modals */}
//         <ImportPdfModal
//           open={showImport}
//           onClose={() => setShowImport(false)}
//           onImported={() => {
//             /* re-fetch attendance for table & summary */
//           }}
//         />

//         <HolidayManager
//           open={showHolidayMgr}
//           date={selectedDate}
//           onClose={() => setShowHolidayMgr(false)}
//           onHolidaySet={(newDates) => {
//             /* re-fetch attendance summary/table */
//           }}
//         />
//       </main>
//     </div>
//   );
// }
