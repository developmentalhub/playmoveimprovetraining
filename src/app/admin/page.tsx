import { redirect } from 'next/navigation';
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
