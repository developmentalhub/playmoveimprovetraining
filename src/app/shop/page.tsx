'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Video } from '@/lib/types'

export default function ShopPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [cart, setCart] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVideos() {
      const { data } = await supabase.from('videos').select('*')
      setVideos(data || [])
      setLoading(false)
    }
    fetchVideos()
  }, [])

  function addToCart(video: Video) {
    if (!cart.find(v => v.id === video.id)) {
      setCart([...cart, video])
    }
  }

  function removeFromCart(videoId: string) {
    setCart(cart.filter(v => v.id !== videoId))
  }

  async function handleCheckout() {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems: cart }),
    })
    const { url } = await res.json()
    window.location.href = url
  }

  const total = cart.reduce((sum, v) => sum + v.price_cents, 0)

  if (loading) return <div className="p-8">Loading videos...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-700">
          Play Move Improve Videos
        </h1>
        <button
          onClick={handleCheckout}
          disabled={cart.length === 0}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Cart ({cart.length}) — ${(total / 100).toFixed(2)}
        </button>
      </div>

      {/* Videos Grid */}
      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos.length === 0 && (
          <p className="col-span-3 text-center text-gray-500">
            No videos yet — add some in Supabase!
          </p>
        )}
        {videos.map(video => (
          <div key={video.id} className="bg-white rounded-xl shadow overflow-hidden">
            {video.thumbnail_url && (
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <span className="text-xs text-purple-500 font-medium uppercase">
                {video.category}
              </span>
              <h3 className="font-bold text-gray-800 mt-1">{video.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{video.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="font-bold text-gray-800">
                  ${(video.price_cents / 100).toFixed(2)}
                </span>
                {cart.find(v => v.id === video.id) ? (
                  <button
                    onClick={() => removeFromCart(video.id)}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={() => addToCart(video)}
                    className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}