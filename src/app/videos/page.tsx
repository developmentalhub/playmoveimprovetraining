'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Video } from '@/lib/types'
import Link from 'next/link'

type Subscription = {
  id: string
  status: string
  current_period_end: string
}

type Webinar = {
  id: string
  title: string
  description: string
  zoom_url: string
  scheduled_at: string
}

type CartItem = {
  id: string
  title: string
  price_cents: number
  type: string
}

export default function VideosPage() {
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single()
        setSubscription(sub)
      }

      const { data: videoData } = await supabase
        .from('videos')
        .select('*')
        .order('created_at')

      const { data: webinarData } = await supabase
        .from('webinars')
        .select('*')
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at')

      setVideos(videoData || [])
      setWebinars(webinarData || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  async function handleSubscribe() {
    if (!user) {
      window.location.href = '/login'
      return
    }
    setSubscribing(true)
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
      },
    })
    const { url } = await res.json()
    window.location.href = url
  }

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
    if (!user) {
      window.location.href = '/login'
      return
    }
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
      },
      body: JSON.stringify({ cartItems: cart }),
    })
    const { url } = await res.json()
    window.location.href = url
  }

  const total = cart.reduce((sum, c) => sum + c.price_cents, 0)
  const membershipVideos = videos.filter(v => v.is_membership)
  const payPerVideos = videos.filter(v => !v.is_membership)
  const isMember = subscription?.status === 'active'

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
         style={{backgroundColor: '#f8fffe'}}>
      <p style={{color: '#4ABFB0'}} className="font-semibold text-lg">
        Loading...
      </p>
    </div>
  )

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f8fffe'}}>

      {/* Cart Bar */}
      {cart.length > 0 && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-3 flex justify-end">
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="font-semibold px-5 py-2 rounded-full text-sm shadow border-2"
              style={{color: '#7B4FA6', borderColor: '#7B4FA6'}}
            >
              Cart ({cart.length}) — A${(total / 100).toFixed(2)}
            </button>
          </div>
        </div>
      )}

      {/* Cart Dropdown */}
      {cartOpen && (
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-xl shadow-lg p-6 mt-2 border-2"
               style={{borderColor: '#7B4FA6'}}>
            <h3 className="font-bold text-lg mb-4" style={{color: '#1a2e44'}}>
              Your Cart
            </h3>
            {cart.map(item => (
              <div key={item.id}
                   className="flex justify-between items-center py-2 border-b">
                <p className="font-medium" style={{color: '#1a2e44'}}>{item.title}</p>
                <div className="flex items-center gap-3">
                  <span className="font-bold" style={{color: '#7B4FA6'}}>
                    A${(item.price_cents / 100).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 text-sm"
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
                className="text-white px-6 py-2 rounded-full font-semibold"
                style={{backgroundColor: '#7B4FA6'}}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Membership Hero */}
      <div style={{backgroundColor: '#e0f7f5'}} className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            {isMember ? (
              <>
                <span className="text-sm font-bold px-3 py-1 rounded-full text-white mb-4 inline-block"
                      style={{backgroundColor: '#4ABFB0'}}>
                  Active Member
                </span>
                <h2 className="text-4xl font-bold mb-4" style={{color: '#1a2e44'}}>
                  Welcome back!
                </h2>
                <p className="text-lg mb-6" style={{color: '#4a5568'}}>
                  You have full access to all videos, the monthly webinar
                  and the community forum.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link
                    href="/members"
                    className="px-6 py-3 rounded-full font-semibold text-white"
                    style={{backgroundColor: '#4ABFB0'}}
                  >
                    Go to Members Area
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold mb-4" style={{color: '#1a2e44'}}>
                  Full access for A$39/month
                </h2>
                <p className="text-lg mb-6" style={{color: '#4a5568'}}>
                  Join Play Move Improve and get unlimited access to all
                  videos, a live monthly webinar with Robyn, and a
                  community forum where you can ask questions directly.
                </p>
                <ul className="mb-8 space-y-2">
                  {[
                    'All pre-recorded videos — new and old',
                    'Live monthly webinar with Robyn via Zoom',
                    'Community forum — ask Robyn questions',
                    'Downloadable printables for every activity',
                    'Cancel any time',
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm"
                        style={{color: '#4a5568'}}>
                      <span style={{color: '#4ABFB0'}}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleSubscribe}
                  disabled={subscribing}
                  className="px-8 py-3 rounded-full font-semibold text-white shadow-md text-lg"
                  style={{backgroundColor: subscribing ? '#9ca3af' : '#4ABFB0'}}
                >
                  {subscribing ? 'Loading...' : 'Join for A$39/month'}
                </button>
                {!user && (
                  <p className="mt-3 text-sm" style={{color: '#4a5568'}}>
                    Already a member?{' '}
                    <Link href="/login" style={{color: '#4ABFB0'}}
                          className="font-semibold">
                      Sign in
                    </Link>
                  </p>
                )}
              </>
            )}
          </div>

          {/* What's included cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'All Videos', desc: 'Unlimited access to every activity' },
              { title: 'Monthly Webinar', desc: 'Live session with Robyn via Zoom' },
              { title: 'Community Forum', desc: 'Ask Robyn questions any time' },
              { title: 'Printables', desc: 'Download resources for every activity' },
            ].map(item => (
              <div key={item.title}
                   className="bg-white rounded-xl p-4 shadow-sm border-t-2"
                   style={{borderColor: '#4ABFB0'}}>
                <h4 className="font-bold text-sm mb-1" style={{color: '#1a2e44'}}>
                  {item.title}
                </h4>
                <p className="text-xs" style={{color: '#4a5568'}}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Webinar */}
      {webinars.length > 0 && (
        <div className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-6" style={{color: '#1a2e44'}}>
              Upcoming Webinar
            </h3>
            {webinars.slice(0, 1).map(webinar => (
              <div key={webinar.id}
                   className="bg-white rounded-2xl shadow-md p-8 border-l-4"
                   style={{borderColor: '#7B4FA6'}}>
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <h4 className="font-bold text-xl mb-2"
                        style={{color: '#1a2e44'}}>
                      {webinar.title}
                    </h4>
                    <p className="text-sm mb-2" style={{color: '#4a5568'}}>
                      {webinar.description}
                    </p>
                    <p className="text-sm font-semibold" style={{color: '#7B4FA6'}}>
                      {new Date(webinar.scheduled_at).toLocaleDateString('en-AU', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {isMember ? (
                    <a href={webinar.zoom_url} target="_blank" rel="noopener noreferrer" className="px-6 py-2 rounded-full font-semibold text-white" style={{backgroundColor: '#7B4FA6'}}>Join Webinar</a>
                  ) : (
                    <button
                      onClick={handleSubscribe}
                      className="px-6 py-2 rounded-full font-semibold text-white"
                      style={{backgroundColor: '#4ABFB0'}}
                    >
                      Join to Access
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Membership Videos Preview */}
      {membershipVideos.length > 0 && (
        <div className="py-12 px-6" style={{backgroundColor: '#f3eeff'}}>
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold" style={{color: '#1a2e44'}}>
                  Member Videos
                </h3>
                <p className="text-sm mt-1" style={{color: '#4a5568'}}>
                  {isMember
                    ? 'Your full video library'
                    : 'Available with membership'}
                </p>
              </div>
              {!isMember && (
                <button
                  onClick={handleSubscribe}
                  className="px-5 py-2 rounded-full font-semibold text-white text-sm"
                  style={{backgroundColor: '#4ABFB0'}}
                >
                  Join to Watch
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {membershipVideos.map(video => (
                <div key={video.id}
                     className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {video.thumbnail_url ? (
                    <img src={video.thumbnail_url} alt={video.title}
                         className="w-full h-36 object-cover" />
                  ) : (
                    <div className="w-full h-36"
                         style={{backgroundColor: '#e0f7f5'}} />
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-sm" style={{color: '#1a2e44'}}>
                      {video.title}
                    </h4>
                    <p className="text-xs mt-1" style={{color: '#4a5568'}}>
                      {video.description}
                    </p>
                    {isMember ? (
                      <Link
                        href="/members"
                        className="mt-3 inline-block text-xs font-semibold px-3 py-1 rounded-full text-white"
                        style={{backgroundColor: '#7B4FA6'}}
                      >
                        Watch now
                      </Link>
                    ) : (
                      <div className="mt-3 flex items-center gap-1">
                        <span className="text-xs" style={{color: '#7B4FA6'}}>
                          Members only
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pay Per Video Section */}
      {payPerVideos.length > 0 && (
        <div className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-2" style={{color: '#1a2e44'}}>
              Try individual videos
            </h3>
            <p className="mb-8" style={{color: '#4a5568'}}>
              Not ready to join? Browse older videos at A$5 each and
              see what Play Move Improve is all about.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {payPerVideos.map(video => (
                <div key={video.id}
                     className="bg-white rounded-xl shadow-sm overflow-hidden border"
                     style={{borderColor: '#e0f7f5'}}>
                  {video.thumbnail_url ? (
                    <img src={video.thumbnail_url} alt={video.title}
                         className="w-full h-36 object-cover" />
                  ) : (
                    <div className="w-full h-36"
                         style={{backgroundColor: '#e0f7f5'}} />
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
                        {inCart(video.id) ? 'Added' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Membership upsell */}
            <div className="mt-10 bg-white rounded-2xl p-8 text-center border-2"
                 style={{borderColor: '#4ABFB0'}}>
              <h4 className="text-xl font-bold mb-2" style={{color: '#1a2e44'}}>
                Get everything for A$39/month
              </h4>
              <p className="mb-6" style={{color: '#4a5568'}}>
                Join as a member and get unlimited access to all videos,
                live webinars and the community forum.
              </p>
              <button
                onClick={handleSubscribe}
                className="px-8 py-3 rounded-full font-semibold text-white shadow-md"
                style={{backgroundColor: '#4ABFB0'}}
              >
                Join for A$39/month
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}