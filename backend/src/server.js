import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/hello', (req, res) => {
  res.json({ message: 'Backend API is alive 👋' });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
