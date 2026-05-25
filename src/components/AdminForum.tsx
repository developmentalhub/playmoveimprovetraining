'use client';
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
