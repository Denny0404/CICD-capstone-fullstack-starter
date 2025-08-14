export const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

export async function api(path, opts = {}) {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });

  if (!res.ok) {
    let bodyText;
    try { bodyText = await res.text(); } catch { bodyText = res.statusText; }
    throw new Error(`HTTP ${res.status}: ${bodyText}`);
  }

  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}
