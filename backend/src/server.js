import app from './app.js';

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

if (process.env.NODE_ENV !== 'test' && process.env.VITEST !== 'true') {
  app.listen(PORT, HOST, () => console.log(`API listening on http://${HOST}:${PORT}`));
}

export default app;
