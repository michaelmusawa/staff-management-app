// app/reports/page.tsx
"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DateRangePicker from "@/components/reports/DateRangePicker";
import UnitSelect from "@/components/reports/UnitSelect";
import SummaryCards from "@/components/reports/SummaryCards";
import AttendanceTrend from "@/components/reports/AttendanceTrend";
import LeaveAnalytics from "@/components/reports/LeaveAnalytics";
import AssignmentCoverage from "@/components/reports/AssignmentCoverage";
import IncidentReports from "@/components/reports/IncidentReports";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [unit, setUnit] = useState<string>("all");

  return (
    <div className="p-6 space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="flex gap-4">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <UnitSelect value={unit} onChange={setUnit} />
        </div>
        <Button
          onClick={() => {
            /* re-fetch all */
          }}
        >
          Refresh
        </Button>
      </div>

      {/* Top-level summary cards */}
      <SummaryCards dateRange={dateRange} unit={unit} />

      {/* Detailed Tabs */}
      <Tabs defaultValue="attendance">
        <TabsList>
          <TabsTrigger value="attendance">Attendance Trend</TabsTrigger>
          <TabsTrigger value="leave">Leave Breakdown</TabsTrigger>
          <TabsTrigger value="assignments">Assignment Coverage</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceTrend dateRange={dateRange} unit={unit} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave">
          <Card>
            <CardHeader>
              <CardTitle>Leave Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaveAnalytics dateRange={dateRange} unit={unit} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <AssignmentCoverage dateRange={dateRange} unit={unit} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle>Incident Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <IncidentReports dateRange={dateRange} unit={unit} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
