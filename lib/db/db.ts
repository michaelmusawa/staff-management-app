// app/lib/db/db.ts
import Database from "@tauri-apps/plugin-sql";

let dbPromise: Promise<Awaited<ReturnType<typeof Database.load>>>;

export async function getDb() {
  if (!dbPromise) {
    dbPromise = Database.load("sqlite:app.db");
    const db = await dbPromise;

    // --- ORGANIZATION STRUCTURE ---
    await db.execute(`
      CREATE TABLE IF NOT EXISTS org_units (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        parent_id       INTEGER REFERENCES org_units(id) ON DELETE SET NULL,
        name            TEXT    NOT NULL,
        description     TEXT,
        hierarchy_path  TEXT,
        created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS roles (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        org_unit_id    INTEGER NOT NULL REFERENCES org_units(id) ON DELETE CASCADE,
        title          TEXT    NOT NULL,
        is_command     BOOLEAN DEFAULT FALSE,
        created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (org_unit_id, title)
      );
    `);
    await db.execute(
      `CREATE INDEX IF NOT EXISTS idx_roles_unit ON roles(org_unit_id);`
    );

    // --- STAFF ---
    await db.execute(`
      CREATE TABLE IF NOT EXISTS staffs (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name     TEXT    NOT NULL,
        middle_name    TEXT,
        last_name      TEXT    NOT NULL,
        email          TEXT    UNIQUE NOT NULL,
        phone          TEXT,
        gender         TEXT    CHECK(gender IN ('MALE','FEMALE','OTHER')),
        rank           TEXT,
        staff_number   TEXT    UNIQUE NOT NULL,
        ippd_number    TEXT    UNIQUE,
        address        TEXT,
        status         TEXT    CHECK(status IN ('ON_DUTY','SICK','LEAVE')),
        created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await db.execute(
      `CREATE INDEX IF NOT EXISTS idx_staffs_status ON staffs(status);`
    );

    // --- ASSIGNMENTS ---
    await db.execute(`
      CREATE TABLE IF NOT EXISTS staff_assignments (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        staff_id       INTEGER NOT NULL REFERENCES staffs(id) ON DELETE CASCADE,
        role_id        INTEGER NOT NULL REFERENCES roles(id)   ON DELETE CASCADE,
        org_unit_id    INTEGER NOT NULL REFERENCES org_units(id) ON DELETE CASCADE,
        start_date     DATE    NOT NULL,
        end_date       DATE,
        is_primary     BOOLEAN DEFAULT TRUE,
        created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (staff_id, role_id, org_unit_id)
      );
    `);
    await db.execute(
      `CREATE INDEX IF NOT EXISTS idx_assign_staff ON staff_assignments(staff_id);`
    );
    await db.execute(
      `CREATE INDEX IF NOT EXISTS idx_assign_unit ON staff_assignments(org_unit_id);`
    );

    // --- TRANSFERS ---
    await db.execute(`
      CREATE TABLE IF NOT EXISTS transfers (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        staff_id       INTEGER NOT NULL REFERENCES staffs(id) ON DELETE CASCADE,
        type           TEXT    CHECK(type IN ('INCOMING','OUTGOING')) NOT NULL,
        letter_pdf     TEXT,    -- path in AppConfigDir
        draft_text     TEXT,    -- generated or edited letter body
        from_unit      TEXT,
        to_unit        TEXT,
        requested_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at   DATETIME,
        status         TEXT    CHECK(status IN ('PENDING','COMPLETED')) DEFAULT 'PENDING'
      );
    `);
    await db.execute(
      `CREATE INDEX IF NOT EXISTS idx_transfers_staff ON transfers(staff_id);`
    );
    await db.execute(
      `CREATE INDEX IF NOT EXISTS idx_transfers_status ON transfers(status);`
    );

    // --- LEAVES ---
    await db.execute(`
      CREATE TABLE IF NOT EXISTS leave_requests (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        staff_id       INTEGER NOT NULL REFERENCES staffs(id) ON DELETE CASCADE,
        type           TEXT    CHECK(type IN ('SICK','MATERNITY','PATERNITY','ANNUAL','OFF_DUTY')) NOT NULL,
        start_date     DATE    NOT NULL,
        end_date       DATE,
        draft_text     TEXT,
        request_pdf    TEXT,
        approval_pdf   TEXT,
        status         TEXT    CHECK(status IN ('PENDING','APPROVED','ON_LEAVE')) DEFAULT 'PENDING',
        created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await db.execute(
      `CREATE INDEX IF NOT EXISTS idx_leave_staff ON leave_requests(staff_id);`
    );
    await db.execute(
      `CREATE INDEX IF NOT EXISTS idx_leave_status ON leave_requests(status);`
    );

    // --- ATTENDANCE ---
    await db.execute(`
      CREATE TABLE IF NOT EXISTS attendance (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        staff_id       INTEGER NOT NULL REFERENCES staffs(id) ON DELETE CASCADE,
        date           DATE    NOT NULL,
        status         TEXT    CHECK(status IN ('PRESENT','ABSENT')) NOT NULL,
        created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(staff_id, date)
      );
    `);
    await db.execute(
      `CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);`
    );

    // --- CORRESPONDENCE ---
    await db.execute(`
      CREATE TABLE IF NOT EXISTS correspondence (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        type           TEXT    CHECK(type IN ('MEMO','LETTER')) NOT NULL,
        direction      TEXT    CHECK(direction IN ('INBOX','SENT','DRAFT')) NOT NULL,
        subject        TEXT,
        body           TEXT,
        from_addr      TEXT,
        to_addr        TEXT,
        attachment     TEXT,   -- path
        reply_to       INTEGER REFERENCES correspondence(id) ON DELETE SET NULL,
        created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await db.execute(
      `CREATE INDEX IF NOT EXISTS idx_corr_dir ON correspondence(direction);`
    );
    await db.execute(
      `CREATE INDEX IF NOT EXISTS idx_corr_reply ON correspondence(reply_to);`
    );

    // --- INCIDENTS ---
    await db.execute(`
      CREATE TABLE IF NOT EXISTS incidents (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        date           DATE    NOT NULL,
        type           TEXT,
        location       TEXT,
        description    TEXT,
        reported_by    INTEGER REFERENCES staffs(id),
        created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await db.execute(
      `CREATE INDEX IF NOT EXISTS idx_incidents_date ON incidents(date);`
    );
    await db.execute(
      `CREATE INDEX IF NOT EXISTS idx_incidents_type ON incidents(type);`
    );

    // --- HOLIDAYS / NON-WORK DAYS ---
    await db.execute(`
      CREATE TABLE IF NOT EXISTS holidays (
        date           DATE    PRIMARY KEY,
        description    TEXT
      );
    `);
  }

  return dbPromise;
}
