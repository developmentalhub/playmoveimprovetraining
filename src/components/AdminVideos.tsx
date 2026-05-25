'use client';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const empty = { id: '', title: '', description: '', thumbnail_url: '', bunny_video_id: '', category: '', age_group: '', printable_url: '', is_membership: true, price_cents: 0 };

export default function AdminVideos({ initialVideos }: { initialVideos: any[] }) {
  const [videos, setVideos] = useState(initialVideos);
  const [form, setForm] = useState({ ...empty });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setLoading(true); setMsg('');
    if (editing) {
      const { error } = await supabase.from('videos').update({ ...form, price_cents: Number(form.price_cents) }).eq('id', editing);
      if (!error) { setVideos(videos.map(v => v.id === editing ? { ...form, id: editing } : v)); setMsg('Saved!'); setEditing(null); setForm({ ...empty }); }
      else setMsg(error.message);
    } else {
      const { data, error } = await supabase.from('videos').insert({ ...form, price_cents: Number(form.price_cents) }).select().single();
      if (!error && data) { setVideos([data, ...videos]); setMsg('Added!'); setForm({ ...empty }); }
      else setMsg(error?.message ?? 'Error');
    }
    setLoading(false);
  };

  const del = async (id: string) => {
    if (!confirm('Delete this video?')) return;
    const { error } = await supabase.from('videos').delete().eq('id', id);
    if (!error) setVideos(videos.filter(v => v.id !== id));
  };

  const toggleMembership = async (id: string, current: boolean) => {
    const { error } = await supabase.from('videos').update({ is_membership: !current }).eq('id', id);
    if (!error) setVideos(videos.map(v => v.id === id ? { ...v, is_membership: !current } : v));
  };

  const startEdit = (v: any) => { setForm({ ...v }); setEditing(v.id); window.scrollTo(0, 0); };

  return (
    <div>
      <div className="rounded-2xl p-6 mb-8" style={{ background: '#fff', border: '1px solid rgba(74,191,176,0.2)' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#1a2e44' }}>{editing ? 'Edit Video' : 'Add New Video'}</h2>
        {msg && <div className="px-4 py-2 rounded-lg mb-4 text-sm" style={{ background: msg === 'Saved!' || msg === 'Added!' ? 'rgba(74,191,176,0.1)' : 'rgba(255,0,0,0.1)', color: msg === 'Saved!' || msg === 'Added!' ? '#4ABFB0' : 'red' }}>{msg}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {[['title', 'Title'], ['bunny_video_id', 'Bunny Video ID'], ['thumbnail_url', 'Thumbnail URL'], ['category', 'Category'], ['age_group', 'Age Group'], ['printable_url', 'Printable PDF URL']].map(([k, label]) => (
            <div key={k}>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#1a2e44' }}>{label}</label>
              <input value={(form as any)[k]} onChange={e => set(k, e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor: 'rgba(74,191,176,0.4)' }} />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#1a2e44' }}>Price (cents, e.g. 1500 = $15)</label>
            <input type="number" value={form.price_cents} onChange={e => set('price_cents', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor: 'rgba(74,191,176,0.4)' }} />
          </div>
          <div className="flex items-center gap-3 mt-4">
            <label className="text-sm font-semibold" style={{ color: '#1a2e44' }}>Membership video?</label>
            <button onClick={() => set('is_membership', !form.is_membership)} className="w-12 h-6 rounded-full transition-all relative" style={{ background: form.is_membership ? '#4ABFB0' : '#d1d5db' }}>
              <span className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all" style={{ left: form.is_membership ? '26px' : '4px' }} />
            </button>
            <span className="text-xs" style={{ color: '#4a5568' }}>{form.is_membership ? 'Members only' : 'Pay per view'}</span>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-semibold mb-1" style={{ color: '#1a2e44' }}>Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" style={{ borderColor: 'rgba(74,191,176,0.4)' }} />
        </div>
        <div className="flex gap-3">
          <button onClick={save} disabled={loading} className="px-6 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #4ABFB0, #3aa89a)' }}>{loading ? 'Saving...' : editing ? 'Save Changes' : 'Add Video'}</button>
          {editing && <button onClick={() => { setEditing(null); setForm({ ...empty }); setMsg(''); }} className="px-6 py-2 rounded-xl text-sm font-semibold" style={{ background: 'rgba(0,0,0,0.06)', color: '#4a5568' }}>Cancel</button>}
        </div>
      </div>

      <div className="space-y-3">
        {videos.map(v => (
          <div key={v.id} className="rounded-xl p-4 flex items-center gap-4 bg-white" style={{ border: '1px solid rgba(74,191,176,0.15)' }}>
            {v.thumbnail_url && <img src={v.thumbnail_url} alt={v.title} className="w-16 h-10 object-cover rounded-lg flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: '#1a2e44' }}>{v.title}</p>
              <p className="text-xs" style={{ color: '#4a5568' }}>{v.category} · {v.age_group}</p>
            </div>
            <button onClick={() => toggleMembership(v.id, v.is_membership)} className="px-3 py-1 rounded-full text-xs font-semibold transition-all" style={{ background: v.is_membership ? 'rgba(74,191,176,0.12)' : 'rgba(123,79,166,0.1)', color: v.is_membership ? '#4ABFB0' : '#7B4FA6' }}>{v.is_membership ? 'Members' : 'Pay-per-view'}</button>
            <button onClick={() => startEdit(v)} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(74,191,176,0.1)', color: '#4ABFB0' }}>Edit</button>
            <button onClick={() => del(v.id)} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,0,0,0.08)', color: '#ef4444' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
