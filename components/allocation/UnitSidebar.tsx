// app/components/allocation/UnitSidebar.tsx
"use client";

import React, { useState } from "react";
import { OrgUnit } from "@/lib/definitions/orgDefinitions";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import { Button } from "@/components/ui/button";

interface UnitSidebarProps {
  units: OrgUnit[];
  selectedId: string | null;
  onSelect: (unit: OrgUnit) => void;
}

/**
 * Sidebar listing OrgUnits as a collapsible tree.
 * Highlights the selected unit and calls onSelect when clicked.
 */
export function UnitSidebar({ units, selectedId, onSelect }: UnitSidebarProps) {
  // track expanded state by unit ID
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpandedIds((s) => {
      const copy = new Set(s);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const renderNode = (node: OrgUnit, depth: number = 0) => {
    const isExpanded = expandedIds.has(node.id);
    const hasChildren = node.children.length > 0;
    const isSelected = node.id === selectedId;

    return (
      <div key={node.id} style={{ marginLeft: depth * 12 }} className="mb-1">
        <div className="flex items-center">
          {hasChildren ? (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => toggle(node.id)}
              className="mr-1 p-1 text-sm"
            >
              {isExpanded ? (
                <FiChevronDown className="w-4 h-4" />
              ) : (
                <FiChevronRight className="w-4 h-4" />
              )}
            </Button>
          ) : (
            <div className="w-5" />
          )}
          <Button
            variant={isSelected ? "default" : "ghost"}
            size="sm"
            className="truncate text-left w-full"
            onClick={() => onSelect(node)}
          >
            {node.name}
          </Button>
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-64 border-r p-4 overflow-auto">
      <h2 className="text-lg font-semibold mb-4">Units</h2>
      {units.map((u) => renderNode(u))}
    </aside>
  );
}
