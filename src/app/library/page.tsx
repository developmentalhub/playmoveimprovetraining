'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Purchase = {
  id: string
  video_id: string
  bundle_id: string
  created_at: string
  videos: {
    id: string
    title: string
    description: string
    bunny_video_id: string
    category: string
    printable_url: string | null
  }
}

export default function LibraryPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLibrary() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/login'
        return
      }

      setUser(user)

      const { data } = await supabase
        .from('purchases')
        .select('*, videos(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setPurchases(data || [])
      setLoading(false)
    }
    fetchLibrary()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
         style={{backgroundColor: '#f8fffe'}}>
      <p style={{color: '#4ABFB0'}} className="font-semibold text-lg">
        Loading your library...
      </p>
    </div>
  )

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f8fffe'}}>
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-1" style={{color: '#1a2e44'}}>
            My Video Library
          </h2>
          <p style={{color: '#4a5568'}}>
            {user?.email} —{' '}
            <span style={{color: '#7B4FA6'}} className="font-semibold">
              {purchases.length} video{purchases.length !== 1 ? 's' : ''} purchased
            </span>
          </p>
        </div>

        {purchases.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center border-t-4"
               style={{borderColor: '#4ABFB0'}}>
            <h3 className="text-xl font-bold mb-2" style={{color: '#1a2e44'}}>
              No videos yet
            </h3>
            <p className="mb-6" style={{color: '#4a5568'}}>
              Browse our resources and find the right support for your child.
            </p>
            <Link
              href="/shop"
              className="text-white px-6 py-3 rounded-full font-semibold"
              style={{backgroundColor: '#4ABFB0'}}
            >
              Browse Videos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map(purchase => (
              <div
                key={purchase.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden border-2"
                style={{
                  borderColor: activeVideo === purchase.videos?.bunny_video_id
                    ? '#7B4FA6' : 'transparent'
                }}
              >
                {/* Video Player */}
                {activeVideo === purchase.videos?.bunny_video_id ? (
                  <div className="w-full aspect-video bg-black">
                    <iframe
                      src={`https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID}/${purchase.videos.bunny_video_id}`}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                ) : (
                  <div
                    className="w-full h-40 flex items-center justify-center cursor-pointer"
                    style={{backgroundColor: '#e0f7f5'}}
                    onClick={() => setActiveVideo(purchase.videos?.bunny_video_id)}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                      style={{backgroundColor: '#4ABFB0'}}
                    >
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor"
                           viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                )}

                <div className="p-4">
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full text-white"
                    style={{backgroundColor: '#4ABFB0'}}
                  >
                    {purchase.videos?.category}
                  </span>
                  <h4 className="font-bold mt-2" style={{color: '#1a2e44'}}>
                    {purchase.videos?.title}
                  </h4>
                  <p className="text-xs mt-1" style={{color: '#4a5568'}}>
                    {purchase.videos?.description}
                  </p>

                  <div className="mt-3 flex gap-2 flex-wrap">
                    <button
                      onClick={() => setActiveVideo(
                        activeVideo === purchase.videos?.bunny_video_id
                          ? null
                          : purchase.videos?.bunny_video_id
                      )}
                      className="text-sm font-semibold px-4 py-1 rounded-full text-white"
                      style={{backgroundColor: '#7B4FA6'}}
                    >
                      {activeVideo === purchase.videos?.bunny_video_id
                        ? 'Close video'
                        : 'Watch now'}
                    </button>

                    {purchase.videos?.printable_url && (
                      
                        href={purchase.videos.printable_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold px-4 py-1 rounded-full border-2"
                        style={{borderColor: '#4ABFB0', color: '#4ABFB0'}}
                      >
                        Download Printable
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}