import pool from './db.js';

export async function listItems() {
  const { rows } = await pool.query(
    'SELECT id, name, done, created_at FROM items ORDER BY id DESC'
  );
  return rows;
}

export async function createItem(name) {
  const { rows } = await pool.query(
    'INSERT INTO items(name) VALUES($1) RETURNING id, name, done, created_at',
    [name]
  );
  return rows[0];
}

export async function toggleItem(id, done) {
  const { rows } = await pool.query(
    'UPDATE items SET done = $1 WHERE id = $2 RETURNING id, name, done, created_at',
    [done, id]
  );
  return rows[0];
}

export async function deleteItem(id) {
  const { rows } = await pool.query(
    'DELETE FROM items WHERE id = $1 RETURNING id',
    [id]
  );
  return rows[0];
}
