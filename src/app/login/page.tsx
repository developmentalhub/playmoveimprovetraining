'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit() {
    setLoading(true)
    setError('')
    setMessage('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `https://www.playmoveimprove.com/auth/callback`,
        },
      })
      if (error) setError(error.message)
      else setMessage('Check your email to confirm your account.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) setError(error.message)
      else window.location.href = '/library'
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor: '#f8fffe'}}>

      {/* Header */}
      <div style={{backgroundColor: '#4ABFB0'}} className="shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Play Move Improve</h1>
            <p className="text-sm" style={{color: '#e0f7f5'}}>The Developmental Hub</p>
          </div>
          <Link href="/shop"
                className="bg-white px-4 py-2 rounded-full font-semibold text-sm shadow"
                style={{color: '#4ABFB0'}}>
            Browse Videos
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border-t-4"
             style={{borderColor: '#4ABFB0'}}>

          <h2 className="text-2xl font-bold mb-1" style={{color: '#1a2e44'}}>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-sm mb-6" style={{color: '#4a5568'}}>
            {isSignUp
              ? 'Sign up to access your purchased videos.'
              : 'Sign in to access your video library.'}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="px-4 py-3 rounded-lg mb-4 text-sm text-white"
                 style={{backgroundColor: '#4ABFB0'}}>
              {message}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1"
                   style={{color: '#1a2e44'}}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none"
              style={{borderColor: '#4ABFB0'}}
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1"
                   style={{color: '#1a2e44'}}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none"
              style={{borderColor: '#4ABFB0'}}
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-full font-semibold text-white mb-4"
            style={{backgroundColor: loading ? '#9ca3af' : '#4ABFB0'}}
          >
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-sm text-center"
            style={{color: '#7B4FA6'}}
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}