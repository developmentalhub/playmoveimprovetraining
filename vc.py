content = open('src/components/MembersVideoCard.tsx', 'w', encoding='utf-8')
content.write("""'use client';
import { useState } from 'react';

interface Video { id: string; title: string; description: string; thumbnail_url: string; bunny_video_id: string; category: string; age_group: string; printable_url?: string; }
interface Props { video: Video; libraryId: string; }

export default function MembersVideoCard({ video, libraryId }: Props) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${video.bunny_video_id}?autoplay=true&responsive=true`;
  return (
    <div className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white" style={{ border: '1px solid rgba(74,191,176,0.2)' }}>
      <div className="relative aspect-video bg-gray-900 cursor-pointer overflow-hidden" onClick={() => setPlaying(true)}>
        {!playing ? (
          <>
            {video.thumbnail_url && <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, rgba(26,46,68,0.1), rgba(26,46,68,0.55))' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform" style={{ background: 'rgba(74,191,176,0.95)' }}>
                <svg className="w-5 h-5 ml-1" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
          </>
        ) : (
          <iframe src={embedUrl} className="w-full h-full" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowFullScreen />
        )}
      </div>
      <div className="p-4">
        <div className="flex gap-2 mb-2">
          {video.category && <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(74,191,176,0.12)', color: '#4ABFB0' }}>{video.category}</span>}
          {video.age_group && <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(123,79,166,0.1)', color: '#7B4FA6' }}>{video.age_group}</span>}
        </div>
        <h3 className="font-bold text-base mb-1" style={{ color: '#1a2e44' }}>{video.title}</h3>
        <p className="text-sm leading-relaxed line-clamp-2 mb-4" style={{ color: '#4a5568' }}>{video.description}</p>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(true)} className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-95" style={{ background: 'linear-gradient(135deg, #4ABFB0, #3aa89a)' }}>Watch Now</button>
          {video.printable_url && <a href={video.printable_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border transition-all hover:bg-purple-50 no-underline" style={{ color: '#7B4FA6', borderColor: 'rgba(123,79,166,0.3)' }}>⬇ PDF</a>}
        </div>
      </div>
    </div>
  );
}
""")
content.close()
print('done')
