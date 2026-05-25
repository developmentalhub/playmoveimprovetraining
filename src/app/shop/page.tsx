'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Video } from '@/lib/types'

type Bundle = {
  id: string
  title: string
  description: string
  thumbnail_url: string
  price_cents: number
  category: string
  age_group: string
}

type CartItem = {
  id: string
  title: string
  price_cents: number
  type: 'video' | 'bundle'
}

const categories = [
  {
    key: 'pre-literacy',
    heading: 'My child is getting ready to read',
    subheading: 'Build the foundations of language and literacy through movement and rhythm.',
  },
  {
    key: 'early-literacy',
    heading: 'My child is learning to read',
    subheading: 'Activities to support letters, sounds and early reading confidence.',
  },
  {
    key: 'pre-writing',
    heading: 'My child struggles with writing',
    subheading: 'Develop the movement and fine motor skills children need before they can write.',
  },
  {
    key: 'fine-motor',
    heading: 'My child needs help with focus and coordination',
    subheading: 'Targeted activities to build attention, body awareness and hand strength.',
  },
  {
    key: 'regulation',
    heading: 'My child struggles with big feelings',
    subheading: 'Calm, practical strategies to help children manage emotions and self-regulate.',
  },
]

export default function ShopPage() {
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const [{ data: bundleData }, { data: videoData }] = await Promise.all([
        supabase.from('bundles').select('*').order('created_at'),
        supabase.from('videos').select('*').order('created_at'),
      ])
      setBundles(bundleData || [])
      setVideos(videoData || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  function addToCart(item: CartItem) {
    if (!cart.find(c => c.id === item.id)) {
      setCart([...cart, item])
    }
  }

  function removeFromCart(id: string) {
    setCart(cart.filter(c => c.id !== id))
  }

  function inCart(id: string) {
    return cart.some(c => c.id === id)
  }

  async function handleCheckout() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      window.location.href = '/login'
      return
    }
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ cartItems: cart }),
    })
    const { url } = await res.json()
    window.location.href = url
  }

  const total = cart.reduce((sum, c) => sum + c.price_cents, 0)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
         style={{backgroundColor: '#f0faf9'}}>
      <p style={{color: '#4ABFB0'}} className="font-semibold text-lg">
        Loading resources...
      </p>
    </div>
  )

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f8fffe'}}>

      {/* Cart Dropdown */}
      {cartOpen && (
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-xl shadow-lg p-6 mt-2 border-2"
               style={{borderColor: '#7B4FA6'}}>
            <h3 className="font-bold text-lg mb-4" style={{color: '#1a2e44'}}>
              Your Cart
            </h3>
            {cart.length === 0 ? (
              <p className="text-gray-500">No items yet</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id}
                       className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium" style={{color: '#1a2e44'}}>
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.type === 'bundle' ? 'Bundle' : 'Single video'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold" style={{color: '#7B4FA6'}}>
                        A${(item.price_cents / 100).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-lg" style={{color: '#1a2e44'}}>
                    Total: A${(total / 100).toFixed(2)}
                  </span>
                  <button
                    onClick={handleCheckout}
                    className="text-white px-6 py-2 rounded-full font-semibold shadow"
                    style={{backgroundColor: '#7B4FA6'}}
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hero */}
      <div style={{backgroundColor: '#e0f7f5'}} className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-3" style={{color: '#1a2e44'}}>
            What does your child need help with?
          </h2>
          <p className="text-lg max-w-2xl" style={{color: '#4a5568'}}>
            Select an area below to find targeted video activities designed by
            child development specialists. Buy individual videos for A$5,
            or get a full bundle of 10 videos for A$39.
          </p>
        </div>
      </div>

      {/* Category List with inline expansion */}
      <div className="max-w-6xl mx-auto px-6 py-10 pb-16">
        <div className="flex flex-col gap-3">
          {categories.map(cat => {
            const catBundles = bundles.filter(b => b.category === cat.key)
            const catVideos = videos.filter(v => v.category === cat.key)
            const isOpen = activeCategory === cat.key

            return (
              <div key={cat.key}>

                {/* Category Row */}
                <button
                  onClick={() => setActiveCategory(isOpen ? null : cat.key)}
                  className="w-full text-left rounded-2xl bg-white shadow-md border-2 flex items-center overflow-hidden transition-all hover:shadow-lg"
                  style={{
                    borderColor: isOpen ? '#7B4FA6' : 'transparent',
                    borderBottomLeftRadius: isOpen ? '0' : '',
                    borderBottomRightRadius: isOpen ? '0' : '',
                  }}
                >
                  <div
                    className="w-28 h-28 flex-shrink-0"
                    style={{backgroundColor: isOpen ? '#7B4FA6' : '#4ABFB0'}}
                  />
                  <div className="p-5 flex-1">
                    <h3 className="font-bold text-lg leading-snug mb-1"
                        style={{color: '#1a2e44'}}>
                      {cat.heading}
                    </h3>
                    <p className="text-sm" style={{color: '#4a5568'}}>
                      {cat.subheading}
                    </p>
                  </div>
                  <div className="pr-6 flex items-center gap-2">
                    <span
                      className="text-sm font-semibold px-4 py-1 rounded-full text-white whitespace-nowrap"
                      style={{backgroundColor: isOpen ? '#7B4FA6' : '#4ABFB0'}}
                    >
                      {isOpen ? 'Hide' : 'See videos'}
                    </span>
                    <svg
                      className="w-5 h-5 transition-transform flex-shrink-0"
                      style={{
                        color: '#4ABFB0',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Panel */}
                {isOpen && (
                  <div
                    className="border-2 border-t-0 rounded-b-2xl p-8"
                    style={{backgroundColor: '#f3eeff', borderColor: '#7B4FA6'}}
                  >
                    {/* Bundle */}
                    {catBundles.length > 0 && (
                      <div className="mb-10">
                        <h3 className="text-xl font-bold mb-1" style={{color: '#1a2e44'}}>
                          Full Bundle
                        </h3>
                        <p className="mb-6" style={{color: '#4a5568'}}>
                          Get all 10 videos in this topic for A$39 — saving A$11 compared to buying individually.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {catBundles.map(bundle => (
                            <div key={bundle.id}
                                 className="bg-white rounded-2xl shadow-md overflow-hidden">
                              {bundle.thumbnail_url && (
                                <img src={bundle.thumbnail_url} alt={bundle.title}
                                     className="w-full h-44 object-cover" />
                              )}
                              <div className="p-5">
                                <span className="text-xs font-bold px-2 py-1 rounded-full text-white"
                                      style={{backgroundColor: '#4ABFB0'}}>
                                  {bundle.age_group}
                                </span>
                                <h4 className="font-bold text-lg mt-3"
                                    style={{color: '#1a2e44'}}>
                                  {bundle.title}
                                </h4>
                                <p className="text-sm mt-1 mb-4" style={{color: '#4a5568'}}>
                                  {bundle.description}
                                </p>
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="text-2xl font-bold"
                                          style={{color: '#7B4FA6'}}>
                                      A$39
                                    </span>
                                    <span className="text-xs text-gray-400 ml-1">
                                      10 videos
                                    </span>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      addToCart({
                                        id: bundle.id,
                                        title: bundle.title,
                                        price_cents: bundle.price_cents,
                                        type: 'bundle'
                                      })
                                    }}
                                    className="px-5 py-2 rounded-full text-sm font-semibold text-white"
                                    style={{
                                      backgroundColor: inCart(bundle.id) ? '#9ca3af' : '#7B4FA6'
                                    }}
                                    disabled={inCart(bundle.id)}
                                  >
                                    {inCart(bundle.id) ? 'Added' : 'Add Bundle'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Individual Videos */}
                    {catVideos.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold mb-1" style={{color: '#1a2e44'}}>
                          Individual Videos
                        </h3>
                        <p className="mb-6" style={{color: '#4a5568'}}>
                          Prefer to start with just one or two? Pick exactly what you need for A$5 each.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {catVideos.map(video => (
                            <div key={video.id}
                                 className="bg-white rounded-xl shadow-sm overflow-hidden">
                              {video.thumbnail_url && (
                                <img src={video.thumbnail_url} alt={video.title}
                                     className="w-full h-36 object-cover" />
                              )}
                              <div className="p-4">
                                <h4 className="font-semibold text-sm" style={{color: '#1a2e44'}}>
                                  {video.title}
                                </h4>
                                <p className="text-xs mt-1 mb-3" style={{color: '#4a5568'}}>
                                  {video.description}
                                </p>
                                <div className="flex justify-between items-center">
                                  <span className="font-bold" style={{color: '#7B4FA6'}}>
                                    A$5
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      addToCart({
                                        id: video.id,
                                        title: video.title,
                                        price_cents: video.price_cents,
                                        type: 'video'
                                      })
                                    }}
                                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                                    style={{
                                      backgroundColor: inCart(video.id) ? '#9ca3af' : '#4ABFB0'
                                    }}
                                    disabled={inCart(video.id)}
                                  >
                                    {inCart(video.id) ? 'Added' : 'Add to Cart'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {catBundles.length === 0 && catVideos.length === 0 && (
                      <p className="text-center py-8" style={{color: '#4a5568'}}>
                        Videos coming soon for this topic.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}