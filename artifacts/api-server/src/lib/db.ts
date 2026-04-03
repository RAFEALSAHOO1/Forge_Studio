import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const dbUrl = process.env["DATABASE_URL"];
    if (!dbUrl) throw new Error("DATABASE_URL not set");
    pool = new Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  }
  return pool;
}

export async function query(sql: string, params?: unknown[]) {
  const client = getPool();
  return client.query(sql, params);
}
