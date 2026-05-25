'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div style={{backgroundColor: '#4ABFB0'}} className="shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex flex-col">
          <span className="text-xl font-bold text-white">Play Move Improve</span>
          <span className="text-xs" style={{color: '#e0f7f5'}}>The Developmental Hub</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-2">
          <Link
            href="/shop"
            className="text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-white hover:bg-opacity-20 transition-all"
          >
            Videos
          </Link>

          {!loading && user ? (
            <>
              <Link
                href="/library"
                className="text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-white hover:bg-opacity-20 transition-all"
              >
                My Library
              </Link>
              <Link
                href="/shop#cart"
                className="bg-white font-semibold px-4 py-2 rounded-full text-sm shadow"
                style={{color: '#7B4FA6'}}
              >
                Cart
              </Link>
              <button
                onClick={handleSignOut}
                className="text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-white hover:bg-opacity-20 transition-all"
              >
                Sign Out
              </button>
            </>
          ) : !loading && (
            <Link
              href="/login"
              className="bg-white font-semibold px-4 py-2 rounded-full text-sm shadow"
              style={{color: '#7B4FA6'}}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}