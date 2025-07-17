// app/lib/actions/attendanceActions.ts

// app/lib/actions/attendanceActions.ts
import { getDb } from "../db/db";

/**
 * Returns the attendance summary for a given date range & (optionally) unit:
 *  - present: total PRESENT records
 *  - absent:  total ABSENT records
 *  - upcomingHolidays: count of holidays in the next 7 days after endDate
 */

export async function getAttendanceSummary(
  date: string,
  unitId?: string
): Promise<{
  present: number;
  absent: number;
  offDuty: number;
}> {
  console.log("The get prams", date, unitId);
  const db = await getDb();
  const params: Array<string | number> = [date];

  let presentSql = `
    SELECT COUNT(a.id) AS count
    FROM attendance a
    JOIN staff_assignments sa
      ON sa.staff_id = a.staff_id
    WHERE a.date = ?1
      AND a.status = 'PRESENT'
  `;
  let absentSql = presentSql.replace(
    `a.status = 'PRESENT'`,
    `a.status = 'ABSENT'`
  );
  let offDutySql = `
    SELECT COUNT(DISTINCT lr.staff_id) AS count
    FROM leave_requests lr
    JOIN staff_assignments sa
      ON sa.staff_id = lr.staff_id
    WHERE lr.status = 'ON_LEAVE'
      AND lr.start_date <= ?1
      AND (lr.end_date IS NULL OR lr.end_date >= ?1)
  `;

  if (unitId) {
    // add unit filter
    presentSql += ` AND sa.org_unit_id = ?2`;
    absentSql += ` AND sa.org_unit_id = ?2`;
    offDutySql += ` AND sa.org_unit_id = ?2`;
    params.push(unitId);
  }

  // fetch present
  const presentRow = await db.select<{ count: number }[]>(presentSql, params);
  const present = presentRow[0]?.count ?? 0;

  // fetch absent
  const absentRow = await db.select<{ count: number }[]>(absentSql, params);
  const absent = absentRow[0]?.count ?? 0;

  // fetch off-duty
  const offRow = await db.select<{ count: number }[]>(offDutySql, params);
  const offDuty = offRow[0]?.count ?? 0;

  return { present, absent, offDuty };
}

/**
 * Returns the attendance records for a given date & unit.
 * If you truly want a range, you can adjust this to BETWEEN.
 */

type Status = "PRESENT" | "ABSENT";

/**
 * Returns attendance records for a given unit,
 * optionally restricted to a date range and/or a name/number query.
 */

export async function getAttendance(
  unitId: string,
  opts: {
    date?: string;
    query?: string;
  } = {}
): Promise<AttendanceRecord[]> {
  const { date, query } = opts;
  const db = await getDb();

  // always bind unitId first
  const params: any[] = [Number(unitId)];
  const whereClauses = ["sa.org_unit_id = ?1", "sa.is_primary = 1"];

  // optional text search
  if (query) {
    const q = `%${query.toLowerCase()}%`;
    // we'll bind two params for name OR number
    params.push(q, q);
    whereClauses.push(
      `(LOWER(s.first_name || ' ' || s.last_name) LIKE ?${
        params.length - 1
      } OR LOWER(s.staff_number) LIKE ?${params.length})`
    );
  }

  // build the LEFT JOIN, optionally injecting the date predicate
  // if no date is passed, it simply becomes `LEFT JOIN attendance a ON a.staff_id = s.id`
  const dateJoinCondition = date ? `AND a.date = ?${params.length + 1}` : "";
  if (date) params.push(date);

  const sql = `
    SELECT
      COALESCE(a.id, 0)             AS id,
      s.id                          As staff_id,
      s.staff_number                AS staff_number,
      s.first_name                  AS first_name,
      s.last_name                   AS last_name,
      COALESCE(a.status, 'ABSENT')  AS status
    FROM staff_assignments sa
    JOIN staffs s
      ON s.id = sa.staff_id
    LEFT JOIN attendance a
      ON a.staff_id = s.id
      ${dateJoinCondition}
    WHERE ${whereClauses.join(" AND ")}
    ORDER BY s.last_name, s.first_name
  `;

  const rows = await db.select<
    {
      id: number;
      staff_id: number;
      staff_number: string;
      first_name: string;
      last_name: string;
      status: Status;
    }[]
  >(sql, params);

  return rows.map((r) => ({
    id: r.id,
    staff_name: `${r.first_name} ${r.last_name}`,
    staff_number: r.staff_number,
    staff_id: r.staff_id,
    status: r.status,
  }));
}
/**
 * Upsert a single attendance record.
 * If id is provided, UPDATE; otherwise INSERT.
 */
export async function saveAttendance(
  prev: any,
  formData: FormData
): Promise<{ message?: string; state_error?: string }> {
  const id = formData.get("id");
  const date = formData.get("date");
  const unitId = formData.get("unitId");
  const staffNumber = formData.get("staffNumber");
  const staff_id = formData.get("staff_id");
  const status = formData.get("status");

  if (!date || !unitId || !staffNumber || !staff_id || !status) {
    return { state_error: "Missing required fields" };
  }

  const db = await getDb();
  try {
    if (id) {
      // UPDATE existing record
      await db.execute(
        `
          UPDATE attendance
             SET status = ?1,
                 updated_at = CURRENT_TIMESTAMP
           WHERE id = ?2
          `,
        [status, id]
      );
      return { message: "Attendance updated" };
    } else {
      // INSERT new record
      await db.execute(
        `
          INSERT OR REPLACE INTO attendance
            (date, staff_id, status)
          VALUES (?1, ?2, ?3)
          `,
        [date, staff_id, status]
      );

      return { message: "Attendance marked" };
    }
  } catch (e: any) {
    console.error("saveAttendance error:", e);
    return { state_error: "Failed to save attendance" };
  }
}
