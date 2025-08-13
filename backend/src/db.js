import { Pool, Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Remove any implicit PG* env that pg might read
for (const k of ['PGHOST','PGHOSTADDR','PGPORT','PGUSER','PGPASSWORD','PGDATABASE','DATABASE_URL','PGPASSFILE']) {
  if (process.env[k] !== undefined) {
    console.log('[DB] Unsetting implicit env', k);
    delete process.env[k];
  }
}

// Read ONLY explicit DB_* envs and coerce to primitives
const asString = (v, d='') => (typeof v === 'string' ? v : (v == null ? d : String(v)));
const cfg = {
  host: asString(process.env.DB_HOST, '127.0.0.1'),
  port: Number(process.env.DB_PORT ?? 5432),
  user: asString(process.env.DB_USER, 'appuser'),
  password: asString(process.env.DB_PASSWORD, 'apppass'),
  database: asString(process.env.DB_NAME, 'appdb'),
  ssl: false,
};

console.log('[DB cfg]', { ...cfg, password: `***len=${cfg.password.length}` });
console.log('[DB types]', Object.fromEntries(Object.entries(cfg).map(([k,v]) => [k, typeof v])));

// Guard: ensure password is a string
if (typeof cfg.password !== 'string') {
  throw new Error('DB_PASSWORD is not a string at runtime');
}

// Debug: one-off direct Client connect to prove what pg uses
export async function _debugConnectOnce() {
  const client = new Client(cfg);
  try {
    await client.connect();
    const ptype = typeof client.connectionParameters.password;
    console.log('[DB debug] connectionParameters.password typeof =', ptype);
    const res = await client.query('SELECT 1 AS ok');
    await client.end();
    return { ok: res.rows[0]?.ok === 1, ptype };
  } catch (e) {
    try { await client.end(); } catch {}
    console.error('[DB debug] connect error:', e?.message);
    return { ok: false, error: e?.message };
  }
}

const pool = new Pool(cfg);

export async function dbPing() {
  const { rows } = await pool.query('SELECT 1 AS ok');
  return rows[0]?.ok === 1;
}

export default pool;
