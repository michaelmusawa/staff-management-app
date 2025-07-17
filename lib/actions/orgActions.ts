// app/lib/actions/orgActions.ts
import { getDb } from "../db/db";
import { OrgActionState, OrgUnit } from "../definitions/orgDefinitions";
import {
  CreateOrgUnitSchema,
  UpdateOrgUnitSchema,
  CreateOrgUnitData,
  UpdateOrgUnitData,
} from "../schemas/orgSchemas";

/**
 * Creates a new organizational unit and its associated roles.
 */
// app/lib/actions/orgActions.ts
export async function createOrgUnit(
  prevState: OrgActionState,
  formData: FormData
): Promise<OrgActionState> {
  const parsed = CreateOrgUnitSchema.safeParse({
    parentId: formData.get("parentId") as string | undefined,
    name: formData.get("name"),
    description: formData.get("description"),
    roles: formData.get("rolesCsv"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Please fix the errors and try again.",
    };
  }
  const data = parsed.data as CreateOrgUnitData;

  try {
    const db = await getDb();

    // 1) Insert the unit (parentId → null if undefined)
    // 1) Insert and return the new id
    const result = await db.select<{ id: number }[]>(
      `
  INSERT INTO org_units (parent_id, name, description)
  VALUES (?1, ?2, ?3)
  RETURNING id
  `,
      [data.parentId ?? null, data.name, data.description]
    );

    // 2) Pull the id out
    const newId = result[0].id;

    // 3) De‑duplicate roles
    const uniqueRoles = Array.from(new Set(data.roles));

    // 4) Insert each role, using IGNORE to skip duplicates
    for (const title of uniqueRoles) {
      await db.execute(
        `INSERT OR IGNORE INTO roles (org_unit_id, title)
         VALUES (?1, ?2)`,
        [newId, title]
      );
    }

    return { message: "Unit created successfully!" };
  } catch (err: any) {
    console.error("createOrgUnit error:", err);
    return { state_error: "Unexpected error. Please try again." };
  }
}

/**
 * Updates an existing org unit's fields and its roles.
 */
export async function updateOrgUnit(
  prevState: OrgActionState,
  formData: FormData
): Promise<OrgActionState> {
  const parsed = UpdateOrgUnitSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
    roles: formData.get("rolesCsv"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Please fix the errors and try again.",
    };
  }
  const data = parsed.data as UpdateOrgUnitData;

  try {
    const db = await getDb();

    // 1) Update the unit table
    await db.execute(
      `
      UPDATE org_units
      SET name = ?1,
          description = ?2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?3
    `,
      [data.name, data.description, data.id]
    );

    // 2) Delete all existing roles for this unit
    await db.execute(`DELETE FROM roles WHERE org_unit_id = ?1`, [data.id]);

    // 3) Re‑insert new roles
    for (const title of data.roles) {
      await db.execute(
        `INSERT INTO roles (org_unit_id, title) VALUES (?1, ?2)`,
        [data.id, title]
      );
    }

    return { message: "Unit updated successfully!" };
  } catch (err: any) {
    console.error("updateOrgUnit error:", err);
    return { state_error: "Unexpected error. Please try again." };
  }
}

/**
 * Deletes an organizational unit (and cascades to roles & assignments).
 */
export async function deleteOrgUnit(
  prevState: OrgActionState,
  formData: FormData
): Promise<OrgActionState> {
  const id = formData.get("id") as string;
  if (!id) {
    return { state_error: "No unit ID provided." };
  }

  try {
    const db = await getDb();

    // Check if unit has children
    const children = await db.select<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM org_units WHERE parent_id = ?1",
      [id]
    );

    if (children[0].count > 0) {
      return {
        state_error:
          "Cannot delete unit because it has child units. Delete children first.",
      };
    }

    await db.execute("DELETE FROM org_units WHERE id = ?1", [id]);
    return { message: "Unit deleted successfully." };
  } catch (err: any) {
    console.error("deleteOrgUnit error:", err);
    return { state_error: "Could not delete unit. Please try again." };
  }
}

/**
 * Fetches the full org tree with roles attached to each node.
 */
// app/lib/actions/orgActions.ts

export async function getOrgUnits(): Promise<OrgUnit[]> {
  const db = await getDb();

  // 1) Load all units
  const units = await db.select<
    {
      id: number;
      parent_id: number | null;
      name: string;
      description: string;
    }[]
  >(
    `SELECT id, parent_id, name, description
     FROM org_units
     ORDER BY id`,
    []
  );

  // 2) Load all roles *with their IDs*
  const roles = await db.select<
    { id: number; org_unit_id: number; title: string }[]
  >(
    `SELECT id, org_unit_id, title
     FROM roles`,
    []
  );

  // 3) Build a map of unitId → Role[]
  const rolesMap: Record<number, Role[]> = {};
  for (const { id, org_unit_id, title } of roles) {
    if (!rolesMap[org_unit_id]) rolesMap[org_unit_id] = [];
    rolesMap[org_unit_id].push({ id: id.toString(), title });
  }

  // 4) Convert to OrgUnit nodes
  const nodeMap: Record<number, OrgUnit> = {};
  for (const u of units) {
    nodeMap[u.id] = {
      id: u.id.toString(),
      parentId: u.parent_id?.toString() ?? null,
      name: u.name,
      description: u.description,
      roles: rolesMap[u.id] ?? [],
      children: [],
      expanded: true,
    };
  }

  // 5) Link children into a tree
  const roots: OrgUnit[] = [];
  for (const u of units) {
    const node = nodeMap[u.id];
    if (u.parent_id && nodeMap[u.parent_id]) {
      nodeMap[u.parent_id].children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
