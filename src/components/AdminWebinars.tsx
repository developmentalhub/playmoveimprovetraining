'use client';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const empty = { title: '', description: '', zoom_url: '', scheduled_at: '' };

export default function AdminWebinars({ initialWebinars }: { initialWebinars: any[] }) {
  const [webinars, setWebinars] = useState(initialWebinars);
  const [form, setForm] = useState({ ...empty });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setLoading(true); setMsg('');
    if (editing) {
      const { error } = await supabase.from('webinars').update(form).eq('id', editing);
      if (!error) { setWebinars(webinars.map(w => w.id === editing ? { ...form, id: editing } : w)); setMsg('Saved!'); setEditing(null); setForm({ ...empty }); }
      else setMsg(error.message);
    } else {
      const { data, error } = await supabase.from('webinars').insert(form).select().single();
      if (!error && data) { setWebinars([data, ...webinars]); setMsg('Added!'); setForm({ ...empty }); }
      else setMsg(error?.message ?? 'Error');
    }
    setLoading(false);
  };

  const del = async (id: string) => {
    if (!confirm('Delete this webinar?')) return;
    const { error } = await supabase.from('webinars').delete().eq('id', id);
    if (!error) setWebinars(webinars.filter(w => w.id !== id));
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <div className="rounded-2xl p-6 mb-8" style={{ background: '#fff', border: '1px solid rgba(74,191,176,0.2)' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#1a2e44' }}>{editing ? 'Edit Webinar' : 'Add New Webinar'}</h2>
        {msg && <div className="px-4 py-2 rounded-lg mb-4 text-sm" style={{ background: msg === 'Saved!' || msg === 'Added!' ? 'rgba(74,191,176,0.1)' : 'rgba(255,0,0,0.1)', color: msg === 'Saved!' || msg === 'Added!' ? '#4ABFB0' : 'red' }}>{msg}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div><label className="block text-xs font-semibold mb-1" style={{ color: '#1a2e44' }}>Title</label><input value={form.title} onChange={e => set('title', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor: 'rgba(74,191,176,0.4)' }} /></div>
          <div><label className="block text-xs font-semibold mb-1" style={{ color: '#1a2e44' }}>Zoom Link</label><input value={form.zoom_url} onChange={e => set('zoom_url', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor: 'rgba(74,191,176,0.4)' }} placeholder="https://zoom.us/j/..." /></div>
          <div><label className="block text-xs font-semibold mb-1" style={{ color: '#1a2e44' }}>Date & Time</label><input type="datetime-local" value={form.scheduled_at} onChange={e => set('scheduled_at', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor: 'rgba(74,191,176,0.4)' }} /></div>
        </div>
        <div className="mb-4"><label className="block text-xs font-semibold mb-1" style={{ color: '#1a2e44' }}>Description</label><textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" style={{ borderColor: 'rgba(74,191,176,0.4)' }} /></div>
        <div className="flex gap-3">
          <button onClick={save} disabled={loading} className="px-6 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #4ABFB0, #3aa89a)' }}>{loading ? 'Saving...' : editing ? 'Save Changes' : 'Add Webinar'}</button>
          {editing && <button onClick={() => { setEditing(null); setForm({ ...empty }); setMsg(''); }} className="px-6 py-2 rounded-xl text-sm font-semibold" style={{ background: 'rgba(0,0,0,0.06)', color: '#4a5568' }}>Cancel</button>}
        </div>
      </div>
      <div className="space-y-3">
        {webinars.length === 0 && <p className="text-sm text-center py-8" style={{ color: '#4a5568' }}>No webinars yet.</p>}
        {webinars.map(w => (
          <div key={w.id} className="rounded-xl p-4 flex items-center gap-4 bg-white" style={{ border: '1px solid rgba(74,191,176,0.15)' }}>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: '#1a2e44' }}>{w.title}</p>
              <p className="text-xs" style={{ color: '#4a5568' }}>{fmt(w.scheduled_at)}</p>
              <a href={w.zoom_url} target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: '#4ABFB0' }}>{w.zoom_url}</a>
            </div>
            <button onClick={() => { setForm({ title: w.title, description: w.description, zoom_url: w.zoom_url, scheduled_at: w.scheduled_at?.slice(0, 16) }); setEditing(w.id); window.scrollTo(0, 0); }} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(74,191,176,0.1)', color: '#4ABFB0' }}>Edit</button>
            <button onClick={() => del(w.id)} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,0,0,0.08)', color: '#ef4444' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
