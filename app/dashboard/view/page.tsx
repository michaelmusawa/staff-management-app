"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Pagination from "@/components/ui/pagination";
import Search from "@/components/ui/search";
import AllocationTables from "@/components/views/AllocationTable";
import NominalTable from "@/components/views/NominalTable";
import ViewTabs from "@/components/views/ViewTabs";
import { fetchStaffsPages } from "@/lib/actions/staffActions";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const [totalPages, setTotalPages] = useState(0);
  const searchParams = useSearchParams();
  const [view, setView] = useState<"nominal" | "allocation">("nominal");

  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    fetchStaffsPages(query).then(setTotalPages);
  }, [query]);

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            View Staffs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View staff nominal roll and allocation of duties
          </p>
        </div>

        <ViewTabs view={view} setView={setView} />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search placeholder="Filter staffs..." />
          </div>
        </div>
      </div>

      {view === "nominal" ? (
        <Card>
          <CardHeader>
            <CardTitle>Nominal Roll</CardTitle>
            <CardDescription>All station personnel</CardDescription>
          </CardHeader>
          <CardContent>
            <NominalTable query={query} currentPage={currentPage} />

            <div className="mt-6 flex justify-center">
              <Pagination totalPages={totalPages} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Allocation of Duties</CardTitle>
            <CardDescription>All station personnel</CardDescription>
          </CardHeader>
          <CardContent>
            <AllocationTables query={query} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Page;
