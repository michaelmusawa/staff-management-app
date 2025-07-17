"use client";

import AddStaffModal from "@/components/staffs/AddStaffModal";
import StaffsTable from "@/components/staffs/staffsTable";
import TableSkeleton from "@/components/staffs/TableSkeleton";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Pagination from "@/components/ui/pagination";
import Search from "@/components/ui/search";
import { fetchStaffsPages } from "@/lib/actions/staffActions";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const Page = () => {
  const [totalPages, setTotalPages] = useState(0);
  const searchParams = useSearchParams();

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
            Staff Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage inspectorate personnel, adding, deleting and updating
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search placeholder="Search users..." />
          </div>
          <AddStaffModal />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff list</CardTitle>
          <CardDescription>All unit personnel</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense key={query + currentPage} fallback={<TableSkeleton />}>
            <StaffsTable query={query} currentPage={currentPage} />
          </Suspense>

          <div className="mt-6 flex justify-center">
            <Pagination totalPages={totalPages} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
