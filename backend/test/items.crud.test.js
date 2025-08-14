import request from 'supertest';
import { vi } from 'vitest';
const store = { items: [] };
vi.mock('../src/items.repo.js', () => ({
  listItems: async () => store.items,
  createItem: async (name) => { const it={ id: Date.now(), name, done:false, created_at:new Date().toISOString() }; store.items=[it,...store.items]; return it; },
  toggleItem: async (id, done) => { store.items = store.items.map(it => it.id===id? {...it, done: done ?? !it.done}: it); return store.items.find(it=>it.id===id); },
  deleteItem: async (id) => { store.items = store.items.filter(it=>it.id!==id); }
}));
import app from '../src/app.js';

test('POST creates → PATCH toggles → DELETE removes', async () => {
  const created = await request(app).post('/api/v1/items').send({ name: 'New' });
  expect(created.status).toBe(201);
  const id = created.body.id;

  const toggled = await request(app).patch(`/api/v1/items/${id}/toggle`).send();
  expect(toggled.status).toBe(200);
  expect(toggled.body.done).toBe(true);

  const del = await request(app).delete(`/api/v1/items/${id}`);
  expect(del.status).toBe(200);
});
