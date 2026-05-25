import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

interface RawPost { id: string; user_id: string; content: string; parent_id: string | null; created_at: string; }
export interface Post extends RawPost { replies: Post[]; }

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
}

export async function getMemberStatus() {
  const supabase = await getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return { member: false, user: null };
  const { data: sub } = await supabase.from('subscriptions').select('status, current_period_end').eq('user_id', session.user.id).eq('status', 'active').maybeSingle();
  return { member: !!sub, user: session.user, subscription: sub };
}

export async function getMembershipVideos() {
  const supabase = await getSupabase();
  const { data } = await supabase.from('videos').select('id, title, description, thumbnail_url, bunny_video_id, category, age_group, printable_url, created_at').eq('is_membership', true).order('created_at', { ascending: false });
  return data ?? [];
}

export async function getForumPosts(): Promise<Post[]> {
  const supabase = await getSupabase();
  const { data } = await supabase.from('posts').select('id, user_id, content, parent_id, created_at').is('parent_id', null).order('created_at', { ascending: false }).limit(30);
  if (!data) return [];
  const withReplies: Post[] = await Promise.all((data as RawPost[]).map(async (post: RawPost) => {
    const { data: replies } = await supabase.from('posts').select('id, user_id, content, parent_id, created_at').eq('parent_id', post.id).order('created_at', { ascending: true });
    return { ...post, replies: ((replies ?? []) as RawPost[]).map(r => ({ ...r, replies: [] })) };
  }));
  return withReplies;
}

export async function getUpcomingWebinars() {
  const supabase = await getSupabase();
  const { data } = await supabase.from('webinars').select('id, title, description, zoom_url, scheduled_at, created_at').gte('scheduled_at', new Date().toISOString()).order('scheduled_at', { ascending: true }).limit(3);
  return data ?? [];
}
