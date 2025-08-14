import request from 'supertest';
import { vi } from 'vitest';
vi.mock('../src/items.repo.js', () => ({
  listItems: async () => [{ id:1, name:'Mock task', done:false, created_at: new Date().toISOString() }],
  createItem: async (name) => ({ id:2, name, done:false, created_at:new Date().toISOString() }),
  toggleItem: async (id, done) => ({ id, name:'Mock task', done: done ?? true, created_at:new Date().toISOString() }),
  deleteItem: async () => {}
}));
import app from '../src/app.js';

test('GET /api/v1/items returns array', async () => {
  const r = await request(app).get('/api/v1/items');
  expect(r.status).toBe(200);
  expect(Array.isArray(r.body)).toBe(true);
  expect(r.body[0].name).toBe('Mock task');
});
