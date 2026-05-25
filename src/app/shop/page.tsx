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
  { key: 'all', label: 'All Resources' },
  { key: 'pre-literacy', label: 'Pre-Literacy' },
  { key: 'early-literacy', label: 'Early Literacy' },
  { key: 'pre-writing', label: 'Pre-Writing Skills' },
  { key: 'fine-motor', label: 'Fine Motor Skills' },
  { key: 'language', label: 'Language Skills' },
]

export default function ShopPage() {
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
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
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems: cart }),
    })
    const { url } = await res.json()
    window.location.href = url
  }

  const total = cart.reduce((sum, c) => sum + c.price_cents, 0)

  const filteredBundles = activeCategory === 'all'
    ? bundles
    : bundles.filter(b => b.category === activeCategory)

  const filteredVideos = activeCategory === 'all'
    ? videos
    : videos.filter(v => v.category === activeCategory)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
         style={{backgroundColor: '#f0faf9'}}>
      <div className="text-center">
        <div className="text-4xl mb-4">🎯</div>
        <p style={{color: '#4ABFB0'}} className="font-semibold">Loading resources...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f8fffe'}}>

      {/* Header */}
      <div style={{backgroundColor: '#4ABFB0'}} className="shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Play Move Improve</h1>
            <p className="text-sm" style={{color: '#e0f7f5'}}>The Developmental Hub</p>
          </div>
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="relative bg-white px-4 py-2 rounded-full font-semibold shadow"
            style={{color: '#4ABFB0'}}
          >
            🛒 Cart ({cart.length})
            {cart.length > 0 && (
              <span className="ml-2 font-bold">
                — A${(total / 100).toFixed(2)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Cart Dropdown */}
      {cartOpen && (
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-xl shadow-lg p-6 mt-2 border"
               style={{borderColor: '#4ABFB0'}}>
            <h3 className="font-bold text-lg text-gray-800 mb-4">Your Cart</h3>
            {cart.length === 0 ? (
              <p className="text-gray-500">No items yet</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium text-gray-800">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.type === 'bundle' ? 'Bundle' : 'Single video'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold" style={{color: '#4ABFB0'}}>
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
                  <span className="font-bold text-gray-800 text-lg">
                    Total: A${(total / 100).toFixed(2)}
                  </span>
                  <button
                    onClick={handleCheckout}
                    className="text-white px-6 py-2 rounded-full font-semibold shadow"
                    style={{backgroundColor: '#4ABFB0'}}
                  >
                    Checkout →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Video Resources for Families
        </h2>
        <p className="text-gray-600 text-lg">
          Expert-designed activities to support your child's development.
          Buy individual videos for A$5 or save with a bundle for A$39.
        </p>
      </div>

      {/* Category Filters */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                backgroundColor: activeCategory === cat.key ? '#4ABFB0' : '#e0f7f5',
                color: activeCategory === cat.key ? 'white' : '#2d6b65',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16">

        {/* Bundles */}
        {filteredBundles.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              📦 Bundles — Save with 10 videos for A$39
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBundles.map(bundle => (
                <div key={bundle.id}
                     className="bg-white rounded-2xl shadow-md overflow-hidden border-2"
                     style={{borderColor: '#4ABFB0'}}>
                  {bundle.thumbnail_url && (
                    <img src={bundle.thumbnail_url} alt={bundle.title}
                         className="w-full h-44 object-cover" />
                  )}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold px-2 py-1 rounded-full text-white"
                            style={{backgroundColor: '#4ABFB0'}}>
                        {bundle.age_group}
                      </span>
                      <span className="text-xs text-gray-500">10 videos</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg mt-2">{bundle.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 mb-4">{bundle.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold" style={{color: '#4ABFB0'}}>A$39</span>
                        <span className="text-xs text-gray-400 ml-1">bundle</span>
                      </div>
                      <button
                        onClick={() => addToCart({
                          id: bundle.id,
                          title: bundle.title,
                          price_cents: bundle.price_cents,
                          type: 'bundle'
                        })}
                        className="px-4 py-2 rounded-full text-sm font-semibold text-white transition-all"
                        style={{backgroundColor: inCart(bundle.id) ? '#9ca3af' : '#4ABFB0'}}
                        disabled={inCart(bundle.id)}
                      >
                        {inCart(bundle.id) ? '✓ Added' : 'Add Bundle'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Individual Videos */}
        {filteredVideos.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              🎬 Individual Videos — A$5 each
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredVideos.map(video => (
                <div key={video.id}
                     className="bg-white rounded-xl shadow-sm overflow-hidden border"
                     style={{borderColor: '#e0f7f5'}}>
                  {video.thumbnail_url && (
                    <img src={video.thumbnail_url} alt={video.title}
                         className="w-full h-36 object-cover" />
                  )}
                  <div className="p-4">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full"
                          style={{backgroundColor: '#e0f7f5', color: '#2d6b65'}}>
                      {video.age_group}
                    </span>
                    <h4 className="font-semibold text-gray-900 mt-2 text-sm">{video.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 mb-3">{video.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold" style={{color: '#4ABFB0'}}>A$5</span>
                      <button
                        onClick={() => addToCart({
                          id: video.id,
                          title: video.title,
                          price_cents: video.price_cents,
                          type: 'video'
                        })}
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{backgroundColor: inCart(video.id) ? '#9ca3af' : '#4ABFB0'}}
                        disabled={inCart(video.id)}
                      >
                        {inCart(video.id) ? '✓ Added' : '+ Add'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}