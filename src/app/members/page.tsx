import { redirect } from 'next/navigation';
import { getMemberStatus, getMembershipVideos, getForumPosts, getUpcomingWebinars } from '@/lib/membersData';
import MembersVideoCard from '@/components/MembersVideoCard';
import ForumSection from '@/components/ForumSection';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Members Area | Play Move Improve', description: 'Your exclusive membership content' };

const ROBYN_USER_ID = process.env.ROBYN_USER_ID ?? '';

export default async function MembersPage() {
  const { member, user } = await getMemberStatus();
  if (!member || !user) redirect('/videos');

  const [videos, posts, webinars] = await Promise.all([getMembershipVideos(), getForumPosts(), getUpcomingWebinars()]);
  const libraryId = process.env.NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID ?? '';
  const nextWebinar = webinars[0] ?? null;
  const webinarDate = nextWebinar ? new Date(nextWebinar.scheduled_at).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : null;
  const webinarTime = nextWebinar ? new Date(nextWebinar.scheduled_at).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }) : null;
  const categories = [...new Set(videos.map((v: {category: string}) => v.category).filter(Boolean))];

  return (
    <main className="min-h-screen" style={{ background: '#f8fffe' }}>
      <div className="max-w-7xl mx-auto px-4 py-10">

        <div className="rounded-3xl px-8 py-10 mb-10 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a2e44 0%, #2a4a6e 100%)' }}>
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #4ABFB0, transparent)', transform: 'translate(30%, -30%)' }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ background: 'rgba(74,191,176,0.2)', color: '#4ABFB0' }}>✨ Active Member</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome to your Members Area</h1>
            <p className="text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>Movement is the foundation of learning — your full library is ready.</p>
          </div>
        </div>

        {nextWebinar && (
          <div className="rounded-2xl p-6 mb-10" style={{ background: 'linear-gradient(135deg, rgba(74,191,176,0.1), rgba(123,79,166,0.07))', border: '1px solid rgba(74,191,176,0.25)' }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#4ABFB0' }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#4ABFB0' }}>Upcoming Live Webinar</span>
                </div>
                <h2 className="text-xl font-bold mb-1" style={{ color: '#1a2e44' }}>{nextWebinar.title}</h2>
                <p className="text-sm mb-2" style={{ color: '#4a5568' }}>{nextWebinar.description}</p>
                <p className="text-sm font-semibold" style={{ color: '#7B4FA6' }}>{webinarDate} at {webinarTime}</p>
              </div>
              <a href={nextWebinar.zoom_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-white text-sm whitespace-nowrap transition-all hover:brightness-110 hover:scale-105 no-underline" style={{ background: 'linear-gradient(135deg, #7B4FA6, #9b6fc6)', flexShrink: 0 }}>🎥 Join Webinar</a>
            </div>
          </div>
        )}

        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ color: '#1a2e44' }}>Your Video Library</h2>
            <span className="text-sm" style={{ color: '#4a5568' }}>{videos.length} video{videos.length !== 1 ? 's' : ''}</span>
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat: string) => (
                <span key={cat} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(74,191,176,0.12)', color: '#4ABFB0' }}>{cat}</span>
              ))}
            </div>
          )}
          {videos.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(74,191,176,0.06)', border: '1px dashed rgba(74,191,176,0.3)' }}>
              <p className="text-lg font-semibold mb-1" style={{ color: '#1a2e44' }}>Videos coming soon!</p>
              <p className="text-sm" style={{ color: '#4a5568' }}>Robyn is uploading new content — check back shortly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video: {id: string; title: string; description: string; thumbnail_url: string; bunny_video_id: string; category: string; age_group: string; printable_url?: string}) => <MembersVideoCard key={video.id} video={video} libraryId={libraryId} />)}
            </div>
          )}
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold" style={{ color: '#1a2e44' }}>Community Forum</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(123,79,166,0.1)', color: '#7B4FA6' }}>Members only</span>
          </div>
          <p className="text-sm mb-6" style={{ color: '#4a5568' }}>Ask questions, share wins, and get replies directly from Robyn.</p>
          <ForumSection initialPosts={posts} userId={user.id} robynUserId={ROBYN_USER_ID} />
        </div>

      </div>
    </main>
  );
}
