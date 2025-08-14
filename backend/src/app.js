import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { dbPing } from './db.js';
import { listItems, createItem, toggleItem, deleteItem } from './items.repo.js';
let getVersionInfo;
try { ({ getVersionInfo } = await import('./version.js')); } catch { getVersionInfo = () => ({ app:'backend' }); }

const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.type('text').send('Backend API running. Try /health or /api/v1/items'));
app.get('/health', (_req, res) => res.json({ status:'ok', uptime:process.uptime(), timestamp:new Date().toISOString() }));
app.get('/api/v1/version', (_req, res) => res.json(getVersionInfo()));

app.get('/api/v1/db-ping', async (_req, res) => {
  try { res.json({ db: (await dbPing()) ? 'up' : 'down' }); }
  catch (err) { res.status(500).json({ db:'down', error: err.message }); }
});

app.get('/api/v1/items', async (_req, res) => {
  try { res.json(await listItems()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/v1/items', async (req, res) => {
  const name = (req.body?.name || '').trim();
  if (!name) return res.status(400).json({ error: 'name required' });
  try { res.status(201).json(await createItem(name)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
// toggle via explicit endpoint
app.patch('/api/v1/items/:id/toggle', async (req, res) => {
  const id = Number(req.params.id); if (!Number.isInteger(id)) return res.status(400).json({ error:'invalid id' });
  try { res.json(await toggleItem(id)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
// toggle via body {done:boolean}
app.patch('/api/v1/items/:id', async (req, res) => {
  const id = Number(req.params.id); if (!Number.isInteger(id)) return res.status(400).json({ error:'invalid id' });
  if (typeof req.body?.done !== 'boolean') return res.status(400).json({ error:'done must be boolean' });
  try { res.json(await toggleItem(id, req.body.done)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/v1/items/:id', async (req, res) => {
  const id = Number(req.params.id); if (!Number.isInteger(id)) return res.status(400).json({ error:'invalid id' });
  try { await deleteItem(id); res.json({ ok:true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

export default app;
