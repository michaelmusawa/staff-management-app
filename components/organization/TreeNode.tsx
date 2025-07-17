// TreeNode.tsx
"use client";
import { OrgUnit } from "@/lib/definitions/orgDefinitions";
import { Button } from "../ui/button";
import {
  FiChevronDown,
  FiChevronRight,
  FiEdit2,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { Badge } from "../ui/badge";

export function TreeNode({
  node,
  depth,
  onAdd,
  onEdit,
  onRemove,
  onToggle,
}: {
  node: OrgUnit;
  depth: number;
  onAdd: (parent: OrgUnit) => void;
  onEdit: (unit: OrgUnit) => void;
  onRemove: (unit: OrgUnit) => void;
  onToggle: (id: string) => void;
}) {
  const hasChildren = node?.children?.length > 0;
  const indent = depth * 24;

  return (
    <div className="mb-2">
      <div
        className={`flex items-center p-4 rounded-lg border transition-all hover:shadow-sm ${
          depth === 0
            ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-blue-200 dark:border-gray-700"
            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        }`}
        style={{ marginLeft: `${indent}px` }}
      >
        {hasChildren && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 h-6 w-6 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => onToggle(node.id)}
          >
            {node.expanded ? (
              <FiChevronDown className="h-4 w-4" />
            ) : (
              <FiChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}

        {!hasChildren && <div className="w-6" />}

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800 dark:text-white truncate">
            {node?.name}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {node?.description}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {node?.roles?.map((role, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 font-normal"
              >
                {role.title}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAdd(node)}
            title="Add child unit"
            className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <FiPlus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(node)}
            title="Edit unit"
            className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <FiEdit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(node)}
            title="Remove unit"
            className="text-gray-500 hover:text-red-600 dark:hover:text-red-400"
          >
            <FiTrash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {node?.expanded && hasChildren && (
        <div className="mt-2 ml-6 pl-3 border-l border-gray-200 dark:border-gray-700">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onAdd={onAdd}
              onEdit={onEdit}
              onRemove={onRemove}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
