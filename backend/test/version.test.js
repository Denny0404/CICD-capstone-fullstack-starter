import request from 'supertest';
import app from '../src/app.js';

test('GET /api/v1/version returns app name', async () => {
  const r = await request(app).get('/api/v1/version');
  expect(r.status).toBe(200);
  expect(r.body.app).toBe('backend');
});
