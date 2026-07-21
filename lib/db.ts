import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  password: '*kB%.2ANtPf?HZ8',
  host: 'db.fykhrbfbhecytqetyudk.supabase.co',
  port: 5432,
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
});

export async function query(text: string, params?: any[]) {
  const res = await pool.query(text, params);
  return res;
}

export default pool;
