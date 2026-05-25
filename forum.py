f = open('src/components/ForumSection.tsx', 'w', encoding='utf-8')
f.write("""'use client';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface Post { id: string; user_id: string; content: string; created_at: string; replies: Post[]; }
interface Props { initialPosts: Post[]; userId: string; robynUserId: string; }

export default function ForumSection({ initialPosts, userId, robynUserId }: Props) {
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPost, setNewPost] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  const submitPost = async () => {
    if (!newPost.trim()) return;
    setLoading(true);
    const { data, error } = await supabase.from('posts').insert({ user_id: userId, content: newPost.trim(), parent_id: null }).select().single();
    if (!error && data) { setPosts([{ ...data, replies: [] }, ...posts]); setNewPost(''); }
    setLoading(false);
  };

  const submitReply = async (parentId: string) => {
    if (!replyText.trim()) return;
    setLoading(true);
    const { data, error } = await supabase.from('posts').insert({ user_id: userId, content: replyText.trim(), parent_id: parentId }).select().single();
    if (!error && data) {
      setPosts(posts.map(p => p.id === parentId ? { ...p, replies: [...p.replies, { ...data, replies: [] }] } : p));
      setReplyText('');
      setReplyingTo(null);
    }
    setLoading(false);
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  const isRobyn = (uid: string) => uid === robynUserId;

  return (
    <div>
      <div className="rounded-2xl p-5 mb-6" style={{ background: 'rgba(74,191,176,0.06)', border: '1px solid rgba(74,191,176,0.2)' }}>
        <h3 className="font-bold text-base mb-3" style={{ color: '#1a2e44' }}>Ask a question or share a win 🌟</h3>
        <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="What's on your mind? Robyn reads every post..." className="w-full rounded-xl border p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-300" style={{ borderColor: 'rgba(74,191,176,0.3)', color: '#4a5568', minHeight: '80px' }} rows={3} />
        <div className="flex justify-end mt-2">
          <button onClick={submitPost} disabled={loading || !newPost.trim()} className="px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all hover:brightness-110" style={{ background: 'linear-gradient(135deg, #4ABFB0, #3aa89a)' }}>{loading ? 'Posting...' : 'Post'}</button>
        </div>
      </div>
      <div className="space-y-4">
        {posts.length === 0 && <p className="text-center py-8 text-sm" style={{ color: '#4a5568' }}>No posts yet — be the first to share!</p>}
        {posts.map(post => (
          <div key={post.id} className="rounded-2xl p-4 bg-white" style={{ border: '1px solid rgba(74,191,176,0.15)' }}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #4ABFB0, #7B4FA6)' }}>M</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold" style={{ color: '#4ABFB0' }}>Member</span>
                  <span className="text-xs" style={{ color: '#4a5568' }}>{fmt(post.created_at)}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#4a5568' }}>{post.content}</p>
                <button onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)} className="mt-2 text-xs font-medium hover:underline" style={{ color: '#7B4FA6' }}>Reply</button>
              </div>
            </div>
            {post.replies.length > 0 && (
              <div className="mt-3 ml-11 space-y-3">
                {post.replies.map(reply => (
                  <div key={reply.id} className="rounded-xl p-3" style={{ background: isRobyn(reply.user_id) ? 'rgba(74,191,176,0.08)' : 'rgba(123,79,166,0.05)', border: isRobyn(reply.user_id) ? '1px solid rgba(74,191,176,0.25)' : '1px solid rgba(123,79,166,0.1)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      {isRobyn(reply.user_id) ? <span className="text-xs font-bold" style={{ color: '#4ABFB0' }}>✨ Robyn</span> : <span className="text-xs font-semibold" style={{ color: '#7B4FA6' }}>Member</span>}
                      <span className="text-xs" style={{ color: '#4a5568' }}>{fmt(reply.created_at)}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#4a5568' }}>{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
            {replyingTo === post.id && (
              <div className="mt-3 ml-11">
                <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write your reply..." className="w-full rounded-xl border p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-300" style={{ borderColor: 'rgba(74,191,176,0.3)', color: '#4a5568', minHeight: '60px' }} rows={2} />
                <div className="flex gap-2 mt-2">
                  <button onClick={() => submitReply(post.id)} disabled={loading || !replyText.trim()} className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white disabled:opacity-50" style={{ background: '#4ABFB0' }}>Reply</button>
                  <button onClick={() => { setReplyingTo(null); setReplyText(''); }} className="px-4 py-1.5 rounded-xl text-xs font-semibold" style={{ color: '#4a5568', background: 'rgba(0,0,0,0.06)' }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
""")
f.close()
print('done')
