import { getDb } from "../db/db";
import { createTransferSchema } from "../schemas/transferSchemas";

export interface Transfer {
  id: number;
  staff_id: number;
  staff_number: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  type: "INCOMING" | "OUTGOING";
  from_unit: string | null;
  to_unit: string | null;
  requested_at: string;
  completed_at: string | null;
  status: "PENDING" | "COMPLETED";
}

/**
 * Return total pages of transfers matching filters.
 */
export async function fetchTransferPages(
  query: string,
  type: "INCOMING" | "OUTGOING",
  startDate: string,
  endDate: string
): Promise<number> {
  const ITEMS_PER_PAGE = 10;
  const db = await getDb();

  // Build dynamic WHERE clauses
  const clauses: string[] = [`t.type = ?1`];
  const params: any[] = [type];

  if (query) {
    clauses.push(`(s.first_name || ' ' || s.last_name LIKE ?${
      params.length + 1
    } 
                 OR s.staff_number LIKE ?${params.length + 1})`);
    params.push(`%${query}%`);
  }
  if (startDate) {
    clauses.push(`date(t.requested_at) >= ?${params.length + 1}`);
    params.push(startDate);
  }
  if (endDate) {
    clauses.push(`date(t.requested_at) <= ?${params.length + 1}`);
    params.push(endDate);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  const row = await db.select<{ total: number }>(
    `
      SELECT COUNT(*) AS total
        FROM transfers t
        JOIN staffs s ON t.staff_id = s.id
      ${where}
    `,
    params
  );

  const total = row[0]?.total ?? 0;
  return Math.ceil(total / ITEMS_PER_PAGE);
}

/**
 * Fetch a page of transfers with all the joined fields.
 */
export async function fetchFilteredTransfers(
  query: string,
  type: "INCOMING" | "OUTGOING",
  currentPage: number,
  startDate: string,
  endDate: string
): Promise<Transfer[]> {
  const ITEMS_PER_PAGE = 10;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const db = await getDb();

  // Re‑build the same WHERE clauses
  const clauses: string[] = [`t.type = ?1`];
  const params: any[] = [type];

  if (query) {
    clauses.push(`(s.first_name || ' ' || s.last_name LIKE ?${
      params.length + 1
    } 
                 OR s.staff_number LIKE ?${params.length + 1})`);
    params.push(`%${query}%`);
  }
  if (startDate) {
    clauses.push(`date(t.requested_at) >= ?${params.length + 1}`);
    params.push(startDate);
  }
  if (endDate) {
    clauses.push(`date(t.requested_at) <= ?${params.length + 1}`);
    params.push(endDate);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  const rows = await db.select<Transfer[]>(
    `
      SELECT
        t.id,
        t.staff_id,
        s.staff_number,
        s.first_name,
        s.middle_name,
        s.last_name,
        t.type,
        t.from_unit,
        t.to_unit,
        t.requested_at,
        t.completed_at,
        t.status
      FROM transfers t
      JOIN staffs s ON t.staff_id = s.id
      ${where}
      ORDER BY t.requested_at DESC
      LIMIT ?${params.length + 1}
      OFFSET ?${params.length + 2}
    `,
    [...params, ITEMS_PER_PAGE, offset]
  );

  return rows;
}

/**
 * Create a new transfer record.
 * Expects a FormData with keys:
 *  - staff_id (string of digits)
 *  - type ("INCOMING"|"OUTGOING")
 *  - draft_text (optional)
 *  - letter_pdf (optional, path or filename)
 *  - from_unit (optional)
 *  - to_unit (optional)
 */
export async function createTransfer(formData: FormData): Promise<{
  message?: string;
  state_error?: string;
  errors?: Record<string, string>;
}> {
  // 2) Extract and validate
  const raw = {
    staff_id: formData.get("staff_id"),
    type: formData.get("type"),
    draft_text: formData.get("draft_text"),
    letter_pdf: formData.get("letter_pdf"),
    from_unit: formData.get("from_unit"),
    to_unit: formData.get("to_unit"),
  };

  const parseResult = createTransferSchema.safeParse(raw);
  if (!parseResult.success) {
    // collect Zod errors
    const errors: Record<string, string> = {};
    for (const [key, issue] of parseResult.error.flatten().fieldErrors) {
      if (issue && issue.length) errors[key] = issue[0];
    }
    return { state_error: "Validation error", errors };
  }

  const { staff_id, type, draft_text, letter_pdf, from_unit, to_unit } =
    parseResult.data;

  const db = await getDb();

  try {
    await db.execute(
      `
      INSERT INTO transfers
        (staff_id, type, draft_text, letter_pdf, from_unit, to_unit, status)
      VALUES
        (?1,      ?2,    ?3,         ?4,         ?5,        ?6,      'PENDING')
      `,
      [staff_id, type, draft_text, letter_pdf, from_unit, to_unit]
    );
    return { message: "Transfer created successfully" };
  } catch (e: any) {
    console.error("createTransfer error:", e);
    return { state_error: "Failed to create transfer" };
  }
}
