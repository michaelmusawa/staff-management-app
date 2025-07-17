// app/lib/definitions/orgDefinitions.ts

/**
 * Represents one node in our organization tree.
 */

export interface Role {
  id: string;
  title: string;
}

export interface OrgUnit {
  /** Unique identifier */
  id: string;
  /** Optional parent reference (null for root) */
  parentId: string | null;
  /** Display name of this unit (e.g. “Rapid Response Sector”) */
  name: string;
  /** A short description of its responsibilities */
  description: string;
  /** Titles/roles attached to this unit */
  roles: Role[];
  /** Child units (sub‐structure) */
  children: OrgUnit[];
  /** UI helper: whether children are expanded */
  expanded?: boolean;
}

/**
 * Shape of the state returned by CRUD actions.
 */
export interface OrgActionState {
  /** Success message, if any */
  message?: string | null;
  /** Fatal error (non‑field) */
  state_error?: string | null;
  /** Per‑field validation errors */
  errors?: Record<string, string[]>;
}

export type Node = {
  id: string;
  name: string;
  description: string;
  roles: string[];
  children: Node[];
  expanded?: boolean;
};
