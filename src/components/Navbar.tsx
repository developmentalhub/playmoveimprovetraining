'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

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
    <div style={{backgroundColor: '#4ABFB0'}} className="shadow-md relative">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex flex-col">
          <span className="text-xl font-bold text-white">Play Move Improve</span>
          <span className="text-xs" style={{color: '#e0f7f5'}}>The Developmental Hub</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/shop"
            className="text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-white hover:bg-opacity-20 transition-all"
          >
            Videos
          </Link>
          <Link
            href="/about"
            className="text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-white hover:bg-opacity-20 transition-all"
          >
            About
          </Link>
          <a
            href="https://developmental-hub.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-white hover:bg-opacity-20 transition-all"
           >
            Developmental Hub
          </a>
          {!loading && user ? (
            <>
              <Link
                href="/library"
                className="text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-white hover:bg-opacity-20 transition-all"
              >
                My Library
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-white font-semibold px-4 py-2 rounded-full text-sm shadow"
                style={{color: '#7B4FA6'}}
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

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className="block w-6 h-0.5 bg-white transition-all"
            style={{transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none'}}
          />
          <span
            className="block w-6 h-0.5 bg-white transition-all"
            style={{opacity: menuOpen ? 0 : 1}}
          />
          <span
            className="block w-6 h-0.5 bg-white transition-all"
            style={{transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none'}}
          />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 shadow-lg z-50 px-6 py-4 flex flex-col gap-2"
          style={{backgroundColor: '#3da898'}}
        >
          <Link
            href="/shop"
            onClick={() => setMenuOpen(false)}
            className="text-white font-semibold py-3 border-b border-white border-opacity-20"
          >
            Videos
          </Link>
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="text-white font-semibold py-3 border-b border-white border-opacity-20"
          >
            About
          </Link>
          <a
            href="https://developmental-hub.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="text-white font-semibold py-3 border-b border-white border-opacity-20"
          >
            Developmental Hub
          </a>
          {!loading && user ? (
            <>
              <Link
                href="/library"
                onClick={() => setMenuOpen(false)}
                className="text-white font-semibold py-3 border-b border-white border-opacity-20"
              >
                My Library
              </Link>
              <button
                onClick={handleSignOut}
                className="text-left text-white font-semibold py-3"
              >
                Sign Out
              </button>
            </>
          ) : !loading && (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-white font-semibold py-3"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </div>
  )
}