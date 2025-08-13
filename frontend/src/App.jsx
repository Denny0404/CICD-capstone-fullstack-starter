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
    if (!name.trim()) return;
    try {
      const it = await api(`${API}/items`, {
        method: "POST",
        body: JSON.stringify({ name: name.trim() }),
      });
      setItems([it, ...items]);
      setName("");
    } catch (e) { setErr(e.message); }
  }

  async function toggle(id) {
    try {
      const it = await api(`${API}/items/${id}/toggle`, { method: "PATCH" });
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
    <div style={{maxWidth: 640, margin: "40px auto", padding: 16}}>
      <h1>Capstone Items</h1>

      <form onSubmit={addItem} style={{display:"flex", gap:8, marginBottom:16}}>
        <input
          value={name}
          onChange={e=>setName(e.target.value)}
          placeholder="Add a new item..."
          style={{flex:1, padding:8}}
        />
        <button type="submit">Add</button>
      </form>

      {err && <p style={{color:"crimson"}}>{err}</p>}
      {loading ? <p>Loading…</p> : null}

      <ul style={{listStyle:"none", padding:0, display:"grid", gap:8}}>
        {items.map(it => (
          <li key={it.id} style={{display:"flex", alignItems:"center", gap:12, border:"1px solid #eee", padding:8, borderRadius:8}}>
            <input type="checkbox" checked={!!it.done} onChange={()=>toggle(it.id)} />
            <div style={{flex:1, textDecoration: it.done ? "line-through" : "none"}}>{it.name}</div>
            <small>{new Date(it.created_at).toLocaleString()}</small>
            <button onClick={()=>remove(it.id)} style={{marginLeft:8}}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
