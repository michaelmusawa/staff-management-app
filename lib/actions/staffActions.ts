// app/lib/actions/staffActions.ts
import { getDb } from "../db/db";
import { Staff, StaffActionState } from "../definitions/staffDefinitions";
import {
  CreateStaffSchema,
  CreateStaffData,
  UpdateStaffSchema,
  UpdateStaffData,
} from "../schemas/staffSchemas";

/**
 * Create a new staff member.
 */
export async function createStaff(
  prevState: StaffActionState,
  formData: FormData
): Promise<StaffActionState> {
  const parsed = CreateStaffSchema.safeParse({
    first_name: formData.get("first_name"),
    middle_name: formData.get("middle_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    gender: formData.get("gender"),
    rank: formData.get("rank"),
    staff_number: formData.get("staff_number"),
    ippd_number: formData.get("ippd_number"),
    address: formData.get("address"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
    };
  }
  const data = parsed.data as CreateStaffData;

  try {
    const db = await getDb();

    // Insert & return new id via RETURNING
    const [{ id: newId }] = await db.select<{ id: number }[]>(
      `
      INSERT INTO staffs
        (first_name, middle_name, last_name, email, phone, gender, rank,
         staff_number, ippd_number, address, status)
      VALUES
        (?1, NULLIF(?2,''), ?3, ?4, NULLIF(?5,''), ?6, NULLIF(?7,''), ?8, NULLIF(?9,''), NULLIF(?10,''), ?11)
      RETURNING id
      `,
      [
        data.first_name,
        data.middle_name,
        data.last_name,
        data.email,
        data.phone,
        data.gender,
        data.rank,
        data.staff_number,
        data.ippd_number,
        data.address,
        data.status,
      ]
    );

    console.log("Created staff id:", newId);
    return { message: "Staff created successfully!" };
  } catch (err: any) {
    console.error("createStaff error:", err);
    // handle unique constraint failures
    if (err.toString().includes("UNIQUE constraint failed: staffs.email")) {
      return { errors: { email: ["Email already in use"] } };
    }
    if (err.toString().includes("staffs.staff_number")) {
      return { errors: { staff_number: ["Staff number already in use"] } };
    }
    return { state_error: "Unexpected error. Please try again." };
  }
}

/**
 * Update an existing staff member.
 */
export async function updateStaff(
  prevState: StaffActionState,
  formData: FormData
): Promise<StaffActionState> {
  const parsed = UpdateStaffSchema.safeParse({
    id: formData.get("id"),
    first_name: formData.get("first_name"),
    middle_name: formData.get("middle_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    gender: formData.get("gender"),
    rank: formData.get("rank"),
    staff_number: formData.get("staff_number"),
    ippd_number: formData.get("ippd_number"),
    address: formData.get("address"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
    };
  }
  const data = parsed.data as UpdateStaffData;

  try {
    const db = await getDb();
    await db.execute(
      `
      UPDATE staffs
      SET
        first_name  = ?1,
        middle_name = NULLIF(?2,''),
        last_name   = ?3,
        email       = ?4,
        phone       = NULLIF(?5,''),
        gender      = ?6,
        rank        = NULLIF(?7,''),
        staff_number= ?8,
        ippd_number = NULLIF(?9,''),
        address     = NULLIF(?10,''),
        status      = ?11,
        updated_at  = CURRENT_TIMESTAMP
      WHERE id = ?12
      `,
      [
        data.first_name,
        data.middle_name,
        data.last_name,
        data.email,
        data.phone,
        data.gender,
        data.rank,
        data.staff_number,
        data.ippd_number,
        data.address,
        data.status,
        data.id,
      ]
    );
    return { message: "Staff updated successfully!" };
  } catch (err: any) {
    console.error("updateStaff error:", err);
    if (err.toString().includes("staffs.email")) {
      return { errors: { email: ["Email already in use"] } };
    }
    if (err.toString().includes("staffs.staff_number")) {
      return { errors: { staff_number: ["Staff number already in use"] } };
    }
    return { state_error: "Unexpected error. Please try again." };
  }
}

/**
 * Delete a staff member.
 */
export async function deleteStaff(
  prevState: StaffActionState,
  formData: FormData
): Promise<StaffActionState> {
  const id = formData.get("id") as string;
  if (!id) return { state_error: "Missing staff ID." };

  try {
    const db = await getDb();
    await db.execute(`DELETE FROM staffs WHERE id = ?1`, [parseInt(id, 10)]);
    return { message: "Staff deleted successfully." };
  } catch (err: any) {
    console.error("deleteStaff error:", err);
    return { state_error: "Could not delete staff." };
  }
}

/**
 * Fetch the total number of pages of staffs matching the filters.
 */
export async function fetchStaffsPages(query: string): Promise<number> {
  const ITEMS_PER_PAGE = 10;
  const likeParam = `%${query}%`;

  const db = await getDb();
  const rows = await db.select<{ total: number }[]>(
    `
    SELECT
      COUNT(*) AS total
    FROM staffs u
    WHERE
      u.first_name   LIKE ?1 COLLATE NOCASE OR
      u.middle_name  LIKE ?1 COLLATE NOCASE OR
      u.last_name    LIKE ?1 COLLATE NOCASE OR
      u.email        LIKE ?1 COLLATE NOCASE OR
      u.phone        LIKE ?1 COLLATE NOCASE OR
      u.staff_number LIKE ?1 COLLATE NOCASE OR
      u.ippd_number  LIKE ?1 COLLATE NOCASE
    `,
    [likeParam]
  );

  const total = rows[0]?.total ?? 0;
  return Math.ceil(total / ITEMS_PER_PAGE);
}

/**
 * Fetch filtered and paginated staff records.
 */
export async function fetchFilteredStaffs(
  query: string,
  currentPage: number
): Promise<Staff[]> {
  console.log("query, current page", query, currentPage);
  const ITEMS_PER_PAGE = 10;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const likeParam = `%${query}%`;

  const sql = `
    SELECT
      u.id,
      u.first_name,
      u.middle_name,
      u.last_name,
      u.phone,
      u.gender,
      u.ippd_number,
      u.staff_number,
      u.email,
      u.address,
      u.rank,
      u.status,
      u.created_at,
      u.updated_at
    FROM staffs u
    WHERE
      u.first_name    LIKE ?1 COLLATE NOCASE OR
      u.middle_name   LIKE ?1 COLLATE NOCASE OR
      u.last_name     LIKE ?1 COLLATE NOCASE OR
      u.email         LIKE ?1 COLLATE NOCASE OR
      u.phone         LIKE ?1 COLLATE NOCASE OR
      u.staff_number  LIKE ?1 COLLATE NOCASE OR
      u.ippd_number   LIKE ?1 COLLATE NOCASE
    ORDER BY u.created_at ASC
    LIMIT ?2
    OFFSET ?3
  `;

  const db = await getDb();
  // Note: binding [likeParam, limit, offset] corresponds to ?1, ?2, ?3
  return db.select<Staff[]>(sql, [likeParam, ITEMS_PER_PAGE, offset]);
}

/**
 * Fetch all staff records.
 */
export async function getStaffs(): Promise<Staff[]> {
  const db = await getDb();
  return db.select<Staff[]>(
    `
    SELECT
      id, first_name, middle_name, last_name, email, phone,
      gender, rank, staff_number, ippd_number AS ippd_number,
      address, status,
      created_at, updated_at
    FROM staffs
    ORDER BY last_name, first_name
    `,
    []
  );
}
