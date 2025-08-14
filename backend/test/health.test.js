/* global test, expect, describe, beforeAll, afterAll */
import request from 'supertest';
import app from '../src/app.js';

test('GET /health ok', async () => {
  const r = await request(app).get('/health');
  expect(r.status).toBe(200);
  expect(r.body.status).toBe('ok');
});
