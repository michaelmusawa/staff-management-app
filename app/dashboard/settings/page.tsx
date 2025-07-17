// app/page.tsx
"use client";

import {
  useState,
  useEffect,
  useCallback,
  startTransition,
  useActionState,
} from "react";
import { toast } from "sonner";
import {
  getOrgUnits,
  createOrgUnit,
  updateOrgUnit,
  deleteOrgUnit,
} from "@/lib/actions/orgActions";
import { OrgUnit, OrgActionState } from "@/lib/definitions/orgDefinitions";
import { FiPlus, FiUsers, FiXCircle } from "react-icons/fi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { TreeNode } from "@/components/organization/TreeNode";
import { Badge } from "@/components/ui/badge";

export default function OrgBuilderPage() {
  const [tree, setTree] = useState<OrgUnit[]>([]);
  const [loading, setLoading] = useState(true);

  const initial: OrgActionState = {
    message: null,
    state_error: null,
    errors: {},
  };
  const [createState, createAction, creating] = useActionState(
    createOrgUnit,
    initial
  );
  const [updateState, updateAction, updating] = useActionState(
    updateOrgUnit,
    initial
  );
  const [deleteState, deleteAction, deleting] = useActionState(
    deleteOrgUnit,
    initial
  );

  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [currentUnit, setCurrentUnit] = useState<OrgUnit | null>(null);
  const [parentUnit, setParentUnit] = useState<OrgUnit | null>(null);
  const [form, setForm] = useState({ name: "", description: "", rolesCsv: "" });

  const fetchTree = useCallback(async () => {
    try {
      setLoading(true);
      const units = await getOrgUnits();
      setTree(units.map((u) => ({ ...u, expanded: true })));
    } catch (e) {
      toast.error("Failed to load organization structure");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  // Handle success/error toasts
  useEffect(() => {
    if (createState.message) {
      toast.success(createState.message);
      fetchTree();
      setModalMode(null);
    }
    if (updateState.message) {
      toast.success(updateState.message);
      fetchTree();
      setModalMode(null);
    }
    if (deleteState.message) {
      toast.success(deleteState.message);
      fetchTree();
    }

    if (createState.state_error) {
      toast.error(createState.state_error);
    }
    if (updateState.state_error) {
      toast.error(updateState.state_error);
    }
    if (deleteState.state_error) {
      toast.error(deleteState.state_error);
    }
  }, [createState, updateState, deleteState, fetchTree]);

  const openAdd = (parent?: OrgUnit) => {
    setModalMode("add");
    setCurrentUnit(null);
    setParentUnit(parent || null);
    setForm({ name: "", description: "", rolesCsv: "" });
  };

  const openEdit = (unit: OrgUnit) => {
    setModalMode("edit");
    setCurrentUnit(unit);
    setParentUnit(null);
    setForm({
      name: unit.name,
      description: unit.description,
      rolesCsv: unit.roles.join(", "),
    });
  };

  const handleSave = () => {
    const fm = new FormData();
    if (modalMode === "edit" && currentUnit) {
      fm.set("id", currentUnit.id);
      fm.set("name", form.name);
      fm.set("description", form.description);
      fm.set("rolesCsv", form.rolesCsv);
      startTransition(() => updateAction(fm));
      return;
    }
    if (modalMode === "add") {
      if (parentUnit) fm.set("parentId", parentUnit.id);
      fm.set("name", form.name);
      fm.set("description", form.description);
      fm.set("rolesCsv", form.rolesCsv);
      startTransition(() => createAction(fm));
    }
  };

  const handleDelete = (unit: OrgUnit) => {
    if (
      !confirm(
        `Are you sure you want to delete "${unit.name}"? This action cannot be undone.`
      )
    )
      return;
    const fm = new FormData();
    fm.set("id", unit.id);
    startTransition(() => deleteAction(fm));
  };

  const toggleExpand = (id: string) => {
    const recurse = (nodes: OrgUnit[]): OrgUnit[] =>
      nodes.map((n) =>
        n.id === id
          ? { ...n, expanded: !n.expanded }
          : { ...n, children: recurse(n.children) }
      );
    setTree((t) => recurse(t));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Organization Structure Designer
          </h1>
          <p className="text-muted-foreground">
            Create and manage your organizational hierarchy
          </p>
        </div>
        <Button onClick={() => openAdd(null)} variant="primary">
          <FiPlus className="mr-2" /> Add Root Unit
        </Button>
      </div>

      <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b">
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
            <FiUsers className="text-indigo-600 dark:text-indigo-400" />
            Command Structure
          </CardTitle>
          <CardDescription>
            Define units, descriptions, roles & nesting relationships
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : tree.length === 0 ? (
            <div className="text-center py-10">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiUsers className="text-gray-400 text-2xl" />
              </div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                No organizational units
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                Start by creating your first unit
              </p>
              <Button onClick={() => openAdd(null)} variant="primary">
                Create Root Unit
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tree.map((rootNode) => (
                <TreeNode
                  key={rootNode.id}
                  node={rootNode}
                  depth={0}
                  onAdd={openAdd}
                  onEdit={openEdit}
                  onRemove={handleDelete}
                  onToggle={toggleExpand}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!modalMode} onOpenChange={(o) => !o && setModalMode(null)}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-white">
              {modalMode === "edit" ? "Edit Unit" : "Add New Unit"}
            </DialogTitle>
            <DialogDescription>
              {modalMode === "edit"
                ? "Update unit details"
                : parentUnit
                ? `Adding under: ${parentUnit.name}`
                : "Creating root unit"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {(modalMode === "edit" && updateState.state_error) ||
            (modalMode === "add" && createState.state_error) ? (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg flex items-start gap-2">
                <FiXCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-300">
                  {modalMode === "edit"
                    ? updateState.state_error
                    : createState.state_error}
                </p>
              </div>
            ) : null}

            <div>
              <Label
                htmlFor="name"
                className="text-gray-700 dark:text-gray-300"
              >
                Name *
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="mt-1"
              />
              {modalMode === "edit" && updateState.errors?.name?.[0] && (
                <p className="mt-1 text-red-600 text-sm">
                  {updateState.errors.name[0]}
                </p>
              )}
              {modalMode === "add" && createState.errors?.name?.[0] && (
                <p className="mt-1 text-red-600 text-sm">
                  {createState.errors.name[0]}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="description"
                className="text-gray-700 dark:text-gray-300"
              >
                Description
              </Label>
              <Input
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="rolesCsv"
                className="text-gray-700 dark:text-gray-300"
              >
                Roles (comma separated)
              </Label>
              <Input
                id="rolesCsv"
                value={form.rolesCsv}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rolesCsv: e.target.value }))
                }
                className="mt-1"
                placeholder="Manager, Supervisor, Lead"
              />
              <p className="mt-1 text-gray-500 text-sm">
                Separate multiple roles with commas
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalMode(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={creating || updating || deleting}
              className="relative"
            >
              {(creating || updating) && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                </span>
              )}
              {modalMode === "edit"
                ? updating
                  ? "Updating..."
                  : "Update Unit"
                : creating
                ? "Creating..."
                : "Create Unit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
