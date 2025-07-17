// components/views/AllocationTables.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { OrgUnit } from "@/lib/definitions/orgDefinitions";
import { Assignment } from "@/lib/definitions/allocationDefinitions";
import { Staff } from "@/lib/definitions/staffDefinitions";
import { getOrgUnits } from "@/lib/actions/orgActions";
import { getStaffs } from "@/lib/actions/staffActions";
import { fetchAllAssignments } from "@/lib/actions/viewActions";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Spinner } from "../ui/spinner";

interface Props {
  query: string;
}

export default function AllocationTables({ query }: Props) {
  const [units, setUnits] = useState<OrgUnit[]>([]);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);

  // 1) Load units & staff once
  useEffect(() => {
    getOrgUnits().then(setUnits).catch(console.error);
    getStaffs().then(setStaffs).catch(console.error);
  }, []);

  // 2) Fetch assignments matching the query
  useEffect(() => {
    setLoading(true);
    fetchAllAssignments(query)
      .then(setAssignments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  // 3) Group filtered assignments by unit
  const byUnit = useMemo(() => {
    const map: Record<string, Assignment[]> = {};
    for (const a of assignments) {
      (map[a.org_unit_id] ||= []).push(a);
    }
    return map;
  }, [assignments]);

  // 4) Which staff have any assignment at all? (filtered)
  const assignedIds = useMemo(
    () => new Set(assignments.map((a) => a.staff_id)),
    [assignments]
  );

  // 5) Helper: does this staff match the current query?
  const staffMatches = (s: Staff) => {
    const q = query.toLowerCase();
    return (
      s.first_name.toLowerCase().includes(q) ||
      s.middle_name?.toLowerCase().includes(q) ||
      s.last_name.toLowerCase().includes(q) ||
      s.staff_number.toLowerCase().includes(q)
    );
  };

  // 6) Compute “unassigned” *and* matching the query*
  const unassigned = useMemo(
    () => staffs.filter((s) => staffMatches(s) && !assignedIds.has(s.id)),
    [staffs, assignedIds, query]
  );

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Spinner />
      </div>
    );
  }

  // Recursive renderer
  function renderUnitRecursively(unit: OrgUnit, depth = 0): React.ReactNode {
    const own = byUnit[unit.id] || [];
    const children = unit.children
      .map((c) => renderUnitRecursively(c, depth + 1))
      .filter(Boolean);
    if (!own.length && !children.length) return null;

    return (
      <div
        key={unit.id}
        style={{ marginLeft: depth * 16 }}
        className="space-y-8"
      >
        {own.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{unit.name}</CardTitle>
              <CardDescription>{unit.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {own.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{a.staff_number}</TableCell>
                      <TableCell>
                        {a.first_name}{" "}
                        {(a.middle_name ? `${a.middle_name} ` : "") +
                          a.last_name}
                      </TableCell>
                      <TableCell>{a.email}</TableCell>
                      <TableCell>{a.role_title}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        {children}
      </div>
    );
  }

  // 7) Render
  const anyAssigned = assignments.length > 0;
  const renderedTree = units.map((root) => renderUnitRecursively(root));

  return (
    <div className="space-y-8">
      {anyAssigned ? (
        renderedTree
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          No assignments match your filter.
        </div>
      )}

      {unassigned.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Unassigned Staff</CardTitle>
            <CardDescription>
              Staff without any assigned role matching “{query}”
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unassigned.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.staff_number}</TableCell>
                    <TableCell>
                      {s.first_name}{" "}
                      {(s.middle_name ? `${s.middle_name} ` : "") + s.last_name}
                    </TableCell>
                    <TableCell>{s.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
