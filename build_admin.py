import os
os.makedirs('src/app/admin', exist_ok=True)

files = {}

files['src/app/admin/page.tsx'] = """import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import AdminDashboard from '@/components/AdminDashboard';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin | Play Move Improve' };

export default async function AdminPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user || session.user.id !== process.env.ROBYN_USER_ID) redirect('/');
  const [{ data: videos }, { data: webinars }, { data: members }, { data: posts }] = await Promise.all([
    supabase.from('videos').select('id, title, description, thumbnail_url, bunny_video_id, category, age_group, printable_url, is_membership, price_cents, created_at').order('created_at', { ascending: false }),
    supabase.from('webinars').select('id, title, description, zoom_url, scheduled_at, created_at').order('scheduled_at', { ascending: false }),
    supabase.from('subscriptions').select('id, user_id, status, current_period_end, created_at').order('created_at', { ascending: false }).limit(50),
    supabase.from('posts').select('id, user_id, content, parent_id, created_at').is('parent_id', null).order('created_at', { ascending: false }).limit(50),
  ]);
  return <AdminDashboard videos={videos ?? []} webinars={webinars ?? []} members={members ?? []} posts={posts ?? []} robynUserId={process.env.ROBYN_USER_ID ?? ''} />;
}
"""

files['src/components/AdminDashboard.tsx'] = """'use client';
import { useState } from 'react';
import AdminVideos from '@/components/AdminVideos';
import AdminWebinars from '@/components/AdminWebinars';
import AdminMembers from '@/components/AdminMembers';
import AdminForum from '@/components/AdminForum';

interface Props { videos: any[]; webinars: any[]; members: any[]; posts: any[]; robynUserId: string; }
const tabs = ['Videos', 'Webinars', 'Members', 'Forum'];

export default function AdminDashboard({ videos, webinars, members, posts, robynUserId }: Props) {
  const [activeTab, setActiveTab] = useState('Videos');
  return (
    <main className="min-h-screen" style={{ background: '#f8fffe' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-3" style={{ background: 'rgba(123,79,166,0.1)', color: '#7B4FA6' }}>Admin Only</div>
          <h1 className="text-3xl font-bold" style={{ color: '#1a2e44' }}>Admin Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: '#4a5568' }}>Manage your Play Move Improve content</p>
        </div>
        <div className="flex gap-2 mb-8 border-b" style={{ borderColor: 'rgba(74,191,176,0.2)' }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="px-5 py-3 text-sm font-semibold transition-all relative" style={{ color: activeTab === tab ? '#4ABFB0' : '#4a5568' }}>
              {tab}
              {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: '#4ABFB0' }} />}
            </button>
          ))}
        </div>
        {activeTab === 'Videos' && <AdminVideos initialVideos={videos} />}
        {activeTab === 'Webinars' && <AdminWebinars initialWebinars={webinars} />}
        {activeTab === 'Members' && <AdminMembers members={members} />}
        {activeTab === 'Forum' && <AdminForum initialPosts={posts} robynUserId={robynUserId} />}
      </div>
    </main>
  );
}
"""

files['src/components/AdminVideos.tsx'] = """'use client';
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
"""

files['src/components/AdminWebinars.tsx'] = """'use client';
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
"""

files['src/components/AdminMembers.tsx'] = """'use client';

export default function AdminMembers({ members }: { members: any[] }) {
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  const active = members.filter(m => m.status === 'active').length;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(74,191,176,0.1), rgba(74,191,176,0.05))', border: '1px solid rgba(74,191,176,0.2)' }}>
          <p className="text-3xl font-bold" style={{ color: '#4ABFB0' }}>{active}</p>
          <p className="text-sm font-semibold mt-1" style={{ color: '#1a2e44' }}>Active Members</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(123,79,166,0.1), rgba(123,79,166,0.05))', border: '1px solid rgba(123,79,166,0.2)' }}>
          <p className="text-3xl font-bold" style={{ color: '#7B4FA6' }}>{members.length}</p>
          <p className="text-sm font-semibold mt-1" style={{ color: '#1a2e44' }}>Total Subscriptions</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(26,46,68,0.08), rgba(26,46,68,0.04))', border: '1px solid rgba(26,46,68,0.1)' }}>
          <p className="text-3xl font-bold" style={{ color: '#1a2e44' }}>${(active * 39).toLocaleString()}</p>
          <p className="text-sm font-semibold mt-1" style={{ color: '#1a2e44' }}>Est. Monthly Revenue</p>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(74,191,176,0.2)' }}>
        <table className="w-full text-sm">
          <thead><tr style={{ background: 'rgba(74,191,176,0.08)' }}><th className="text-left px-4 py-3 font-semibold text-xs" style={{ color: '#1a2e44' }}>User ID</th><th className="text-left px-4 py-3 font-semibold text-xs" style={{ color: '#1a2e44' }}>Status</th><th className="text-left px-4 py-3 font-semibold text-xs" style={{ color: '#1a2e44' }}>Renews</th><th className="text-left px-4 py-3 font-semibold text-xs" style={{ color: '#1a2e44' }}>Joined</th></tr></thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={m.id} style={{ background: i % 2 === 0 ? '#fff' : 'rgba(74,191,176,0.02)', borderTop: '1px solid rgba(74,191,176,0.1)' }}>
                <td className="px-4 py-3 font-mono text-xs" style={{ color: '#4a5568' }}>{m.user_id?.slice(0, 16)}...</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: m.status === 'active' ? 'rgba(74,191,176,0.12)' : 'rgba(255,0,0,0.08)', color: m.status === 'active' ? '#4ABFB0' : '#ef4444' }}>{m.status}</span></td>
                <td className="px-4 py-3 text-xs" style={{ color: '#4a5568' }}>{m.current_period_end ? fmt(m.current_period_end) : '-'}</td>
                <td className="px-4 py-3 text-xs" style={{ color: '#4a5568' }}>{fmt(m.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && <p className="text-sm text-center py-8" style={{ color: '#4a5568' }}>No members yet.</p>}
      </div>
    </div>
  );
}
"""

files['src/components/AdminForum.tsx'] = """'use client';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminForum({ initialPosts, robynUserId }: { initialPosts: any[]; robynUserId: string }) {
  const [posts, setPosts] = useState(initialPosts);
  const [replyText, setReplyText] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});

  const submitReply = async (parentId: string) => {
    const text = replyText[parentId]?.trim();
    if (!text) return;
    setLoading(l => ({ ...l, [parentId]: true }));
    const { data, error } = await supabase.from('posts').insert({ user_id: robynUserId, content: text, parent_id: parentId }).select().single();
    if (!error && data) {
      setPosts(posts.map(p => p.id === parentId ? { ...p, replies: [...(p.replies ?? []), data] } : p));
      setReplyText(r => ({ ...r, [parentId]: '' }));
    }
    setLoading(l => ({ ...l, [parentId]: false }));
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4">
      {posts.length === 0 && <p className="text-sm text-center py-8" style={{ color: '#4a5568' }}>No forum posts yet.</p>}
      {posts.map(post => (
        <div key={post.id} className="rounded-2xl p-4 bg-white" style={{ border: '1px solid rgba(74,191,176,0.15)' }}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #4ABFB0, #7B4FA6)' }}>M</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1"><span className="text-xs font-semibold" style={{ color: '#4ABFB0' }}>Member</span><span className="text-xs" style={{ color: '#4a5568' }}>{fmt(post.created_at)}</span></div>
              <p className="text-sm" style={{ color: '#4a5568' }}>{post.content}</p>
            </div>
          </div>
          {(post.replies ?? []).length > 0 && (
            <div className="ml-11 space-y-2 mb-3">
              {(post.replies ?? []).map((r: any) => (
                <div key={r.id} className="rounded-xl p-3" style={{ background: 'rgba(74,191,176,0.06)', border: '1px solid rgba(74,191,176,0.2)' }}>
                  <div className="flex items-center gap-2 mb-1"><span className="text-xs font-bold" style={{ color: '#4ABFB0' }}>✨ Robyn</span><span className="text-xs" style={{ color: '#4a5568' }}>{fmt(r.created_at)}</span></div>
                  <p className="text-sm" style={{ color: '#4a5568' }}>{r.content}</p>
                </div>
              ))}
            </div>
          )}
          <div className="ml-11">
            <textarea value={replyText[post.id] ?? ''} onChange={e => setReplyText(r => ({ ...r, [post.id]: e.target.value }))} placeholder="Reply as Robyn..." rows={2} className="w-full border rounded-xl px-3 py-2 text-sm resize-none focus:outline-none mb-2" style={{ borderColor: 'rgba(74,191,176,0.3)', color: '#4a5568' }} />
            <button onClick={() => submitReply(post.id)} disabled={loading[post.id] || !replyText[post.id]?.trim()} className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white disabled:opacity-50" style={{ background: '#4ABFB0' }}>{loading[post.id] ? 'Sending...' : 'Reply as Robyn'}</button>
          </div>
        </div>
      ))}
    </div>
  );
}
"""

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'w', encoding='utf-8').write(content)
    print(f'wrote {path}')

print('all done')
