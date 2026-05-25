'use client';
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
