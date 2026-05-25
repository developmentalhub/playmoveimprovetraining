'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    async function establishSession() {
      const hash = window.location.hash
      if (hash) {
        const params = new URLSearchParams(hash.replace('#', ''))
        const access_token = params.get('access_token')
        const refresh_token = params.get('refresh_token')
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token })
          if (!error) setReady(true)
          else setError('Invalid or expired reset link. Please request a new one.')
          return
        }
      }
      const { data: { session } } = await supabase.auth.getSession()
      if (session) setReady(true)
      else setError('Invalid or expired reset link. Please request a new one.')
    }
    establishSession()
  }, [])

  async function handleReset() {
    if (!password.trim() || password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true)
    setError('')
    setMessage('')
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) setError(error.message)
    else {
      setMessage('Password updated! Redirecting...')
      setTimeout(() => window.location.href = '/members', 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{backgroundColor: '#f8fffe'}}>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border-t-4" style={{borderColor: '#4ABFB0'}}>
        <h2 className="text-2xl font-bold mb-1" style={{color: '#1a2e44'}}>Reset your password</h2>
        <p className="text-sm mb-6" style={{color: '#4a5568'}}>Enter your new password below.</p>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
        {message && <div className="px-4 py-3 rounded-lg mb-4 text-sm text-white" style={{backgroundColor: '#4ABFB0'}}>{message}</div>}
        {!ready && !error && !message && <div className="px-4 py-3 rounded-lg mb-4 text-sm" style={{backgroundColor: 'rgba(74,191,176,0.1)', color: '#4a5568'}}>Verifying your reset link...</div>}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1" style={{color: '#1a2e44'}}>New password</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none pr-10" style={{borderColor: '#4ABFB0'}} placeholder="Min 6 characters" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{color: '#4a5568'}}>
              {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
            </button>
          </div>
        </div>
        <button onClick={handleReset} disabled={loading || !ready} className="w-full py-3 rounded-full font-semibold text-white transition-all" style={{backgroundColor: loading || !ready ? '#9ca3af' : '#4ABFB0'}}>
          {loading ? 'Updating...' : !ready ? 'Verifying...' : 'Update Password'}
        </button>
      </div>
    </div>
  )
}
