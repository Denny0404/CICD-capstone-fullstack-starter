import request from 'supertest';
import { vi } from 'vitest';
vi.mock('../src/db.js', () => ({ dbPing: async () => true }));
import app from '../src/app.js';

test('GET /api/v1/db-ping -> up', async () => {
  const r = await request(app).get('/api/v1/db-ping');
  expect(r.status).toBe(200);
  expect(r.body.db).toBe('up');
});
