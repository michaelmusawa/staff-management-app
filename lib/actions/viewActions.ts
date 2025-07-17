import { getDb } from "../db/db";
import { Assignment } from "../definitions/allocationDefinitions";

/**
 * Fetch all assignments matching the staff‑name/number filter.
 */
export async function fetchAllAssignments(
  query: string
): Promise<Assignment[]> {
  const likeParam = `%${query}%`;

  const sql = `
    SELECT
      sa.id,
      sa.org_unit_id,
      r.title   AS role_title,
      s.id      AS staff_id,
      s.first_name,
      s.middle_name,
      s.last_name,
      s.email,
      s.staff_number
    FROM staff_assignments sa
    JOIN staffs s ON s.id = sa.staff_id
    JOIN roles r   ON r.id = sa.role_id
    WHERE
      s.first_name   LIKE ?1 COLLATE NOCASE OR
      s.middle_name  LIKE ?1 COLLATE NOCASE OR
      s.last_name    LIKE ?1 COLLATE NOCASE OR
      s.staff_number LIKE ?1 COLLATE NOCASE
    ORDER BY sa.start_date DESC
  `;

  const db = await getDb();
  return db.select<Assignment[]>(sql, [likeParam]);
}
