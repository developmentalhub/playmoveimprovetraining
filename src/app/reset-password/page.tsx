'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleReset() {
    setLoading(true)
    setError('')
    setMessage('')
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) setError(error.message)
    else {
      setMessage('Password updated successfully!')
      setTimeout(() => window.location.href = '/library', 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6"
         style={{backgroundColor: '#f8fffe'}}>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border-t-4"
           style={{borderColor: '#4ABFB0'}}>
        <h2 className="text-2xl font-bold mb-1" style={{color: '#1a2e44'}}>
          Reset your password
        </h2>
        <p className="text-sm mb-6" style={{color: '#4a5568'}}>
          Enter your new password below.
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

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1"
                 style={{color: '#1a2e44'}}>
            New password
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
          onClick={handleReset}
          disabled={loading}
          className="w-full py-3 rounded-full font-semibold text-white"
          style={{backgroundColor: loading ? '#9ca3af' : '#4ABFB0'}}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </div>
  )
}