"use client";

import AssignAllocationModal from "@/components/allocation/AssignAllocationModal";
import AssignAllocationTable from "@/components/allocation/AssignAllocationTable";
import AttendanceSidebar from "@/components/attendance/AttendanceSidebar";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Search from "@/components/ui/search";
import { OrgUnit } from "@/lib/definitions/orgDefinitions";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const searchParams = useSearchParams();

  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [selectedUnit, setSelectedUnit] = useState<OrgUnit | null>(null);
  const [createAssignmentSuccess, setCreateAssignmentSuccess] = useState<{
    bol: boolean;
    message: string;
  }>({ bol: false, message: "" });

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
              Allocation Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Allocate staff to different organization units
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search placeholder="Search users..." />
            </div>
          </div>
        </div>

        {/* Main: Assignments */}
        <main className="flex-1 p-6 space-y-4 overflow-auto">
          {!selectedUnit ? (
            <p className="text-muted-foreground">
              Select a unit to view assignments.
            </p>
          ) : (
            <>
              <header className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold">{selectedUnit.name}</h1>
                  <p className="text-sm text-muted-foreground">
                    {selectedUnit.description}
                  </p>
                </div>
              </header>
            </>
          )}
        </main>

        <Card>
          <CardHeader>
            <CardTitle>Current Assignments</CardTitle>
            <CardDescription>Who’s filling each role</CardDescription>
            {selectedUnit && (
              <CardDescription>
                <AssignAllocationModal
                  selectedUnit={selectedUnit}
                  setCreateAssignmentSuccess={setCreateAssignmentSuccess}
                />
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <AssignAllocationTable
              query={query}
              unitId={selectedUnit?.id}
              currentPage={currentPage}
              createAssignmentSuccess={createAssignmentSuccess}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;

// // app/allocations/page.tsx
// "use client";

// import {
//   useState,
//   useEffect,
//   FormEvent,
//   startTransition,
//   useActionState,
// } from "react";

// import { OrgUnit } from "@/lib/definitions/orgDefinitions";
// import { Staff } from "@/lib/definitions/staffDefinitions";
// import {
//   Assignment,
//   ActionState,
// } from "@/lib/definitions/allocationDefinitions";

// import {
//   getAssignments,
//   createAssignment,
//   deleteAssignment,
// } from "@/lib/actions/allocationActions";
// import { getStaffs } from "@/lib/actions/staffActions";

// import { FiPlus, FiTrash2, FiSearch, FiX } from "react-icons/fi";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { getOrgUnits } from "@/lib/actions/orgActions";
// import { UnitSidebar } from "@/components/allocation/UnitSidebar";
// import { Input } from "@/components/ui/input";
// import Pagination from "@/components/ui/pagination";
// import { Skeleton } from "@/components/ui/skeleton";

// export default function AllocationPage() {
//   // 1) Load units & staff
//   const [units, setUnits] = useState<OrgUnit[]>([]);
//   const [allStaffs, setAllStaffs] = useState<Staff[]>([]);
//   const [filteredStaffs, setFilteredStaffs] = useState<Staff[]>([]);
//   const [staffLoading, setStaffLoading] = useState(false);

//   useEffect(() => {
//     getOrgUnits().then(setUnits);
//     loadStaffs();
//   }, []);

//   const loadStaffs = async (query = "") => {
//     setStaffLoading(true);
//     try {
//       const staffData = await getStaffs(query);
//       setAllStaffs(staffData);
//       setFilteredStaffs(staffData.slice(0, 50)); // Initial page
//     } catch (error) {
//       console.error("Failed to load staff", error);
//     } finally {
//       setStaffLoading(false);
//     }
//   };

//   // 2) Selected unit & its assignments
//   const [selectedUnit, setSelectedUnit] = useState<OrgUnit | null>(null);
//   const [assignments, setAssignments] = useState<Assignment[]>([]);
//   const loadAssignments = (unitId: string) =>
//     getAssignments(unitId).then(setAssignments);

//   useEffect(() => {
//     if (selectedUnit) loadAssignments(selectedUnit.id);
//     else setAssignments([]);
//   }, [selectedUnit]);

//   // 3) Create/Delete action states
//   const initial: ActionState = { message: null, state_error: null, errors: {} };
//   const [createState, createAction, creating] = useActionState(
//     createAssignment,
//     initial
//   );
//   const [deleteState, deleteAction, deleting] = useActionState(
//     deleteAssignment,
//     initial
//   );

//   // reload after success
//   useEffect(() => {
//     if (createState.message || deleteState.message) {
//       if (selectedUnit) loadAssignments(selectedUnit.id);
//       setShowAssign(false);
//     }
//   }, [createState.message, deleteState.message]);

//   // 4) Assign modal with search and pagination
//   const [showAssign, setShowAssign] = useState(false);
//   const [assignStaffId, setAssignStaffId] = useState<string>("");
//   const [assignRoleId, setAssignRoleId] = useState<string>("");
//   const [staffSearch, setStaffSearch] = useState("");
//   const [currentStaffPage, setCurrentStaffPage] = useState(1);
//   const staffPerPage = 20;

//   // Staff pagination
//   useEffect(() => {
//     if (staffSearch) {
//       const filtered = allStaffs.filter(
//         (staff) =>
//           `${staff.first_name} ${staff.last_name}`
//             .toLowerCase()
//             .includes(staffSearch.toLowerCase()) ||
//           staff.staff_number?.toLowerCase().includes(staffSearch.toLowerCase())
//       );
//       setFilteredStaffs(filtered);
//     } else {
//       const start = (currentStaffPage - 1) * staffPerPage;
//       setFilteredStaffs(allStaffs.slice(start, start + staffPerPage));
//     }
//   }, [allStaffs, currentStaffPage, staffSearch]);

//   const totalStaffPages = Math.ceil(allStaffs.length / staffPerPage);

//   function openAssign() {
//     setAssignStaffId("");
//     setAssignRoleId("");
//     setStaffSearch("");
//     setCurrentStaffPage(1);
//     setShowAssign(true);
//   }

//   function handleAssign(e: FormEvent) {
//     e.preventDefault();

//     if (!assignStaffId || !assignRoleId || !selectedUnit) return;

//     const fm = new FormData(e.target as HTMLFormElement);

//     // 📌 Add these two lines!
//     fm.set("staff_id", assignStaffId);
//     fm.set("role_id", assignRoleId);

//     fm.set("org_unit_id", selectedUnit.id);

//     console.log("Submitting assignment:", {
//       staff_id: assignStaffId,
//       role_id: assignRoleId,
//       org_unit_id: selectedUnit.id,
//     });

//     startTransition(() => createAction(fm));
//   }

//   // 5) Delete assignment
//   function handleDeleteAssignment(a: Assignment) {
//     if (!confirm(`Unassign ${a.staff.first_name} from ${a.role_title}?`))
//       return;
//     const fm = new FormData();
//     fm.set("id", String(a.id));
//     startTransition(() => deleteAction(fm));
//   }

//   return (
//     <div className="flex h-full">
//       {/* Sidebar: Unit tree */}
//       <UnitSidebar
//         units={units}
//         selectedId={selectedUnit?.id ?? null}
//         onSelect={(u) => setSelectedUnit(u)}
//       />
//       {/* Main: Assignments */}
//       <main className="flex-1 p-6 space-y-4 overflow-auto">
//         {!selectedUnit ? (
//           <p className="text-muted-foreground">
//             Select a unit to view assignments.
//           </p>
//         ) : (
//           <>
//             <header className="flex justify-between items-center">
//               <div>
//                 <h1 className="text-2xl font-bold">{selectedUnit.name}</h1>
//                 <p className="text-sm text-muted-foreground">
//                   {selectedUnit.description}
//                 </p>
//               </div>
//               <Button onClick={openAssign} disabled={creating}>
//                 <FiPlus className="mr-1" /> Assign Staff
//               </Button>
//             </header>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Current Assignments</CardTitle>
//                 <CardDescription>Who’s filling each role</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Role</TableHead>
//                       <TableHead>Staff</TableHead>
//                       <TableHead>Staff Number</TableHead>
//                       <TableHead>Date</TableHead>
//                       <TableHead className="text-right">Unassign</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {assignments.map((a) => (
//                       <TableRow key={a.id}>
//                         <TableCell>{a.role_title}</TableCell>
//                         <TableCell>
//                           {a.staff.first_name} {a.staff.last_name}
//                         </TableCell>
//                         <TableCell>{a.staff.staff_number}</TableCell>
//                         <TableCell>{a.start_date}</TableCell>
//                         <TableCell className="text-right">
//                           <Button
//                             size="icon"
//                             variant="ghost"
//                             onClick={() => handleDeleteAssignment(a)}
//                             disabled={deleting}
//                           >
//                             <FiTrash2 className="text-destructive" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                     {assignments.length === 0 && (
//                       <TableRow>
//                         <TableCell
//                           colSpan={5}
//                           className="text-center py-8 text-muted-foreground"
//                         >
//                           No assignments yet
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           </>
//         )}
//       </main>

//       {/* Assign Modal */}
//       <Dialog open={showAssign} onOpenChange={() => setShowAssign(false)}>
//         <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
//           <DialogHeader>
//             <DialogTitle>Assign Staff</DialogTitle>
//             <DialogDescription>
//               Pick a staff member and role to assign.
//             </DialogDescription>
//             {createState.state_error && (
//               <p className="text-red-600">{createState.state_error}</p>
//             )}
//           </DialogHeader>

//           <form onSubmit={handleAssign} className="flex-1 flex flex-col">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Staff Selection */}
//               <div className="space-y-4">
//                 <Label>Search Staff</Label>
//                 <div className="relative">
//                   <Input
//                     placeholder="Search by name or staff number..."
//                     value={staffSearch}
//                     onChange={(e) => {
//                       setStaffSearch(e.target.value);
//                       setCurrentStaffPage(1);
//                     }}
//                   />
//                   {staffSearch && (
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
//                       onClick={() => setStaffSearch("")}
//                     >
//                       <FiX className="h-4 w-4" />
//                     </Button>
//                   )}
//                 </div>

//                 <div className="border rounded-lg overflow-hidden">
//                   <div className="max-h-60 overflow-y-auto">
//                     <Table className="border-collapse">
//                       <TableHeader className="sticky top-0 bg-background z-10">
//                         <TableRow>
//                           <TableHead>Name</TableHead>
//                           <TableHead>Staff Number</TableHead>
//                           <TableHead>Rank</TableHead>
//                           <TableHead className="w-20">Select</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {staffLoading ? (
//                           Array.from({ length: 5 }).map((_, i) => (
//                             <TableRow key={i}>
//                               <TableCell>
//                                 <Skeleton className="h-4 w-32" />
//                               </TableCell>
//                               <TableCell>
//                                 <Skeleton className="h-4 w-24" />
//                               </TableCell>
//                               <TableCell>
//                                 <Skeleton className="h-4 w-20" />
//                               </TableCell>
//                               <TableCell>
//                                 <Skeleton className="h-4 w-4 rounded-full" />
//                               </TableCell>
//                             </TableRow>
//                           ))
//                         ) : filteredStaffs.length > 0 ? (
//                           filteredStaffs.map((staff) => (
//                             <TableRow key={staff.id}>
//                               <TableCell>
//                                 {staff.first_name} {staff.last_name}
//                               </TableCell>
//                               <TableCell>{staff.staff_number}</TableCell>
//                               <TableCell>{staff.rank}</TableCell>
//                               <TableCell>
//                                 <Button
//                                   size="icon"
//                                   variant={
//                                     assignStaffId === String(staff.id)
//                                       ? "default"
//                                       : "outline"
//                                   }
//                                   onClick={() =>
//                                     setAssignStaffId(String(staff.id))
//                                   }
//                                 >
//                                   {assignStaffId === String(staff.id) ? (
//                                     <FiPlus className="h-4 w-4" />
//                                   ) : (
//                                     <div className="h-4 w-4 rounded-full border" />
//                                   )}
//                                 </Button>
//                               </TableCell>
//                             </TableRow>
//                           ))
//                         ) : (
//                           <TableRow>
//                             <TableCell
//                               colSpan={4}
//                               className="text-center py-4 text-muted-foreground"
//                             >
//                               No staff found
//                             </TableCell>
//                           </TableRow>
//                         )}
//                       </TableBody>
//                     </Table>
//                   </div>

//                   {!staffSearch && allStaffs.length > staffPerPage && (
//                     <div className="border-t p-2">
//                       <Pagination
//                         totalPages={totalStaffPages}
//                         currentPage={currentStaffPage}
//                         onPageChange={setCurrentStaffPage}
//                       />
//                     </div>
//                   )}
//                 </div>

//                 {assignStaffId && (
//                   <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                     <p className="text-green-700 dark:text-green-300 flex items-center">
//                       <FiPlus className="mr-2" />
//                       Selected:{" "}
//                       {
//                         allStaffs.find((s) => s.id === Number(assignStaffId))
//                           ?.first_name
//                       }{" "}
//                       {
//                         allStaffs.find((s) => s.id === Number(assignStaffId))
//                           ?.last_name
//                       }
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Role Selection */}
//               <div className="space-y-4">
//                 <Label htmlFor="role_id">Select Role</Label>
//                 <Select
//                   name="role_id"
//                   value={assignRoleId}
//                   onValueChange={setAssignRoleId}
//                 >
//                   <SelectTrigger id="role_id" className="w-full">
//                     <SelectValue placeholder="Select role" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {selectedUnit && selectedUnit.roles.length > 0 ? (
//                       selectedUnit.roles.map((r, idx) => (
//                         <SelectItem key={idx} value={String(r.id)}>
//                           {r.title}
//                         </SelectItem>
//                       ))
//                     ) : (
//                       <div className="p-4 text-center text-muted-foreground">
//                         No roles available for this unit
//                       </div>
//                     )}
//                   </SelectContent>
//                 </Select>

//                 <div className="space-y-2">
//                   <Label>Unit Details</Label>
//                   <div className="p-4 bg-muted/30 rounded-lg">
//                     <h4 className="font-medium">{selectedUnit?.name}</h4>
//                     <p className="text-sm text-muted-foreground mt-1">
//                       {selectedUnit?.description}
//                     </p>
//                     <div className="mt-3">
//                       <p className="text-sm font-medium">Available Roles:</p>
//                       <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
//                         {selectedUnit?.roles.map((role, idx) => (
//                           <li key={idx} className="flex items-center">
//                             <span className="h-1.5 w-1.5 rounded-full bg-current mr-2"></span>
//                             {role.title}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <DialogFooter className="mt-6">
//               <Button variant="outline" onClick={() => setShowAssign(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={creating || !assignStaffId || !assignRoleId}
//               >
//                 {creating ? "Assigning..." : "Assign Staff"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
