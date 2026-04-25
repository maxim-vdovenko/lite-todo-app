import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(__dirname, '../../data.db');

let _db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (_db) return _db;

  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const data = fs.readFileSync(DB_PATH);
    _db = new SQL.Database(data);
  } else {
    _db = new SQL.Database();
  }

  _db.run(`
    CREATE TABLE IF NOT EXISTS custom_fields (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      label TEXT NOT NULL,
      field_type TEXT NOT NULL DEFAULT 'text',
      created_at DATETIME DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS todo_custom_values (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      todo_id INTEGER NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
      field_id INTEGER NOT NULL REFERENCES custom_fields(id) ON DELETE CASCADE,
      value TEXT NOT NULL DEFAULT '',
      UNIQUE(todo_id, field_id)
    );
  `);

  save();
  return _db;
}

export function save(): void {
  if (!_db) return;
  const data = _db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

export function queryAll<T = Record<string, unknown>>(
  db: Database,
  sql: string,
  params: unknown[] = []
): T[] {
  const stmt = db.prepare(sql);
  stmt.bind(params as any);
  const rows: T[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as unknown as T);
  }
  stmt.free();
  return rows;
}

export function queryOne<T = Record<string, unknown>>(
  db: Database,
  sql: string,
  params: unknown[] = []
): T | null {
  const rows = queryAll<T>(db, sql, params);
  return rows[0] ?? null;
}

export function run(db: Database, sql: string, params: unknown[] = []): number {
  db.run(sql, params as any);
  const idRows = queryAll<{ id: number }>(db, 'SELECT last_insert_rowid() as id');
  save();
  return idRows[0]?.id ?? 0;
}
