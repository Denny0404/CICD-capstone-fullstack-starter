import { useEffect, useState } from "react";
import "./App.css";
import { api } from "./lib/api";

const API = "/api/v1";

export default function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true); setErr("");
    try { setItems(await api(`${API}/items`)); }
    catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }

  async function addItem(e) {
    e.preventDefault();
    const n = name.trim(); if (!n) return;
    setLoading(true); setErr("");
    try {
      const it = await api(`${API}/items`, {
        method: "POST", body: JSON.stringify({ name: n })
      });
      setItems([it, ...items]); setName("");
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }

  async function toggle(id) {
    try {
      const it = await api(`${API}/items/${id}/toggle`, { method: "POST" });
      setItems(items.map(x => x.id === id ? it : x));
    } catch (e) { setErr(e.message); }
  }

  async function remove(id) {
    try {
      await api(`${API}/items/${id}`, { method: "DELETE" });
      setItems(items.filter(x => x.id !== id));
    } catch (e) { setErr(e.message); }
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1>Capstone Items</h1>
      {err && <p style={{color:'crimson'}}>Error: {err}</p>}

      <form onSubmit={addItem} style={{marginBottom:12}}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="New item…" />
        <button disabled={loading}>Add</button>
      </form>

      {loading && <p>Loading…</p>}
      <ul>
        {items.map(it => (
          <li key={it.id} style={{display:'flex', gap:8, alignItems:'center'}}>
            <input type="checkbox" checked={!!it.done} onChange={()=>toggle(it.id)} />
            <span style={{textDecoration: it.done ? 'line-through' : 'none'}}>{it.name}</span>
            <small style={{opacity:.6}}>{new Date(it.created_at).toLocaleString()}</small>
            <button onClick={()=>remove(it.id)} style={{marginLeft:'auto'}}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
