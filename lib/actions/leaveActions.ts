import { getDb } from "../db/db";
import { Staff } from "../definitions/staffDefinitions";

export interface LeaveRequest {
  id: number;
  staff_number: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  type: "ANNUAL" | "SICK" | "MATERNITY" | "PATERNITY" | "OFF_DUTY";
  start_date: string;
  end_date: string | null;
  status: "PENDING" | "APPROVED" | "ON_LEAVE";
}

const ITEMS_PER_PAGE = 10;

export async function fetchLeavesPages(
  query: string,
  view: string,
  startDate: string,
  endDate: string
): Promise<number> {
  const db = await getDb();
  const likeParam = `%${query}%`;

  // Base count query
  let sql = `
    SELECT COUNT(*) AS total
      FROM leave_requests lr
      JOIN staffs s ON s.id = lr.staff_id
     WHERE lr.type = ?1
       AND (
         s.first_name   LIKE ?2 COLLATE NOCASE OR
         s.middle_name  LIKE ?2 COLLATE NOCASE OR
         s.last_name    LIKE ?2 COLLATE NOCASE OR
         s.staff_number LIKE ?2 COLLATE NOCASE
       )
  `;
  const params: any[] = [view, likeParam];

  // date filtering
  if (startDate) {
    params.push(startDate);
    sql += ` AND lr.start_date >= ?${params.length}`;
  }
  if (endDate) {
    params.push(endDate);
    sql += ` AND lr.start_date <= ?${params.length}`;
  }

  const rows = await db.select<{ total: number }[]>(sql, params);
  const total = rows[0]?.total ?? 0;
  return Math.ceil(total / ITEMS_PER_PAGE);
}

export async function fetchFilteredLeaves(
  query: string,
  view: string,
  currentPage: number,
  startDate: string,
  endDate: string
): Promise<LeaveRequest[]> {
  const db = await getDb();
  const likeParam = `%${query}%`;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  let sql = `
    SELECT
      lr.id,
      s.staff_number,
      s.first_name,
      s.middle_name,
      s.last_name,
      lr.type,
      lr.start_date,
      lr.end_date,
      lr.status
    FROM leave_requests lr
    JOIN staffs s ON s.id = lr.staff_id
   WHERE lr.type = ?1
     AND (
       s.first_name   LIKE ?2 COLLATE NOCASE OR
       s.middle_name  LIKE ?2 COLLATE NOCASE OR
       s.last_name    LIKE ?2 COLLATE NOCASE OR
       s.staff_number LIKE ?2 COLLATE NOCASE
     )
  `;
  const params: any[] = [view, likeParam];

  if (startDate) {
    params.push(startDate);
    sql += ` AND lr.start_date >= ?${params.length}`;
  }
  if (endDate) {
    params.push(endDate);
    sql += ` AND lr.start_date <= ?${params.length}`;
  }

  sql += `
    ORDER BY lr.start_date DESC
    LIMIT ?${params.length + 1}
    OFFSET ?${params.length + 2}
  `;
  params.push(ITEMS_PER_PAGE, offset);

  return db.select<LeaveRequest>(sql, params);
}

/**
 * Fetch a single staff either by their integer `id` or by their unique `staff_number`.
 */
export async function getStaff(identifier: string): Promise<Staff | null> {
  const db = await getDb();
  // We compare against both columns; SQLite will coerce string→int for the id match.
  const rows = await db.select<Staff[]>(
    `
    SELECT
      id,
      first_name,
      middle_name,
      last_name,
      email,
      phone,
      gender,
      rank,
      staff_number,
      ippd_number,
      address,
      status,
      created_at,
      updated_at
    FROM staffs
    WHERE id = ?1
       OR staff_number = ?2
    LIMIT 1
    `,
    [identifier, identifier]
  );
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Fetch a single staff by their staff number.
 */
export async function getStaffByNumber(
  staffNumber: string
): Promise<Staff | null> {
  return getStaff(staffNumber);
}

/**
 * Fetch a single staff by their primary key ID.
 */
export async function getStaffById(id: string): Promise<Staff | null> {
  return getStaff(id);
}
