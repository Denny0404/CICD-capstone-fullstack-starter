import express from 'express';
import { getVersionInfo } from './version.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { dbPing, _debugConnectOnce } from './db.js';
import { listItems, createItem, toggleItem, deleteItem } from './items.repo.js';

const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Root
app.get('/', (_req, res) => {
  res.type('text').send('Backend API running. Try /health or /api/v1/items');
});

// Health
app.get('/health', (_req, res) => {
app.get('/api/v1/version', (_req, res) => res.json(getVersionInfo()));
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Hello
app.get('/api/v1/hello', (_req, res) => {
  res.json({ message: 'Backend API is alive 👋' });
});

// DB ping
app.get('/api/v1/db-ping', async (_req, res) => {
  try {
    const up = await dbPing();
    res.json({ db: up ? 'up' : 'down' });
  } catch (err) {
    console.error('db-ping error:', err.message);
    res.status(500).json({ db: 'down', error: err.message });
  }
});

// TEMP: one-off debug connect to inspect pg's password type
app.get('/api/v1/db-debug', async (_req, res) => {
  try {
    const out = await _debugConnectOnce();
    res.json(out);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Items CRUD
app.get('/api/v1/items', async (_req, res) => {
  try { res.json(await listItems()); } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/v1/items', async (req, res) => {
  try {
    const { name } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ error: 'name is required' });
    const item = await createItem(name.trim());
    res.status(201).json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/v1/items/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { done } = req.body || {};
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'invalid id' });
    if (typeof done !== 'boolean') return res.status(400).json({ error: 'done must be boolean' });
    const updated = await toggleItem(id, done);
    if (!updated) return res.status(404).json({ error: 'not found' });
    res.json(updated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/v1/items/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'invalid id' });
    const deleted = await deleteItem(id);
    if (!deleted) return res.status(404).json({ error: 'not found' });
    res.status(204).end();
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(PORT, HOST, () => {
  console.log(`API listening on http://${HOST}:${PORT}`);
});
