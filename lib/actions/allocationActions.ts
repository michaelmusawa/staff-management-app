// app/lib/actions/allocationActions.ts
import { getDb } from "../db/db";
import { Assignment, ActionState } from "../definitions/allocationDefinitions";

/**
 * Load all assignments for a given org unit, including staff info and role title.
 */
export async function getAssignments(unitId: number): Promise<Assignment[]> {
  const db = await getDb();
  const rows = await db.select<
    {
      id: number;
      staff_id: number;
      role_id: number;
      org_unit_id: number;
      start_date: string;
      end_date: string | null;
      first_name: string;
      last_name: string;
      email: string;
      title: string;
    }[]
  >(
    `
    SELECT
      a.id,
      a.staff_id,
      a.role_id,
      a.org_unit_id,
      a.start_date,
      a.end_date,
      s.first_name,
      s.last_name,
      s.email,
      r.title
    FROM staff_assignments a
    JOIN staffs s ON s.id = a.staff_id
    JOIN roles   r ON r.id = a.role_id
    WHERE a.org_unit_id = ?1
    ORDER BY a.start_date DESC
    `,
    [unitId]
  );

  // map to our Assignment type
  return rows.map((r) => ({
    id: r.id,
    staff_id: r.staff_id,
    role_id: r.role_id,
    org_unit_id: r.org_unit_id,
    start_date: r.start_date,
    end_date: r.end_date,
    staff: {
      id: r.staff_id,
      first_name: r.first_name,
      middle_name: null,
      last_name: r.last_name,
      email: r.email,
      phone: null,
      gender: "OTHER",
      rank: null,
      staff_number: "",
      ippd_number: null,
      address: null,
      status: "ON_DUTY",
      created_at: "",
      updated_at: "",
    },
    role_title: r.title,
  }));
}

/**
 * Assign a staff to a role in an org unit.
 * Expects formData with keys: staff_id, role_id, org_unit_id.
 */
export async function createAssignment(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const staffId = formData.get("staff_id")?.toString();
  const roleId = formData.get("role_id")?.toString();
  const orgUnitId = formData.get("org_unit_id")?.toString();

  console.log("Assignment data", staffId, roleId, orgUnitId);

  if (!staffId || !roleId || !orgUnitId) {
    return { state_error: "Missing assignment data." };
  }

  try {
    const db = await getDb();
    await db.execute(
      `
      INSERT INTO staff_assignments
        (staff_id, role_id, org_unit_id, start_date)
      VALUES
        (?1, ?2, ?3, DATE('now'))
      `,
      [staffId, roleId, orgUnitId]
    );
    return { message: "Staff assigned successfully!" };
  } catch (err: any) {
    console.error("createAssignment error:", err);
    if (err.toString().includes("UNIQUE constraint failed")) {
      return { state_error: "This assignment already exists." };
    }
    return { state_error: "Could not create assignment." };
  }
}

/**
 * Remove an assignment by its ID.
 * Expects formData with key: id.
 */
export async function deleteAssignment(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id")?.toString();
  if (!id) {
    return { state_error: "Missing assignment ID." };
  }

  try {
    const db = await getDb();
    await db.execute(`DELETE FROM staff_assignments WHERE id = ?1`, [id]);
    return { message: "Assignment removed." };
  } catch (err) {
    console.error("deleteAssignment error:", err);
    return { state_error: "Could not remove assignment." };
  }
}
