f = open('src/app/login/page.tsx', 'w', encoding='utf-8')
f.write("""'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    setError('')
    setMessage('')
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: 'https://www.playmoveimprove.com/auth/callback' } })
      setLoading(false)
      if (error) setError(error.message)
      else setMessage('Check your email to confirm your account.')
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setLoading(false); setError(error.message); return; }
      if (data.user) {
        const { data: sub } = await supabase.from('subscriptions').select('status').eq('user_id', data.user.id).eq('status', 'active').maybeSingle()
        window.location.href = sub ? '/members' : '/library'
      }
    }
  }

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
  )
  const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" /></svg>
  )

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor: '#f8fffe'}}>
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border-t-4" style={{borderColor: '#4ABFB0'}}>
          <h2 className="text-2xl font-bold mb-1" style={{color: '#1a2e44'}}>{isSignUp ? 'Create your account' : 'Welcome back'}</h2>
          <p className="text-sm mb-6" style={{color: '#4a5568'}}>{isSignUp ? 'Sign up to access your purchased videos.' : 'Sign in to access your video library.'}</p>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
          {message && <div className="px-4 py-3 rounded-lg mb-4 text-sm text-white" style={{backgroundColor: '#4ABFB0'}}>{message}</div>}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1" style={{color: '#1a2e44'}}>Email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none" style={{borderColor: '#4ABFB0'}} placeholder="you@example.com" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1" style={{color: '#1a2e44'}}>Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none pr-10" style={{borderColor: '#4ABFB0'}} placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{color: '#4a5568'}}>{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={loading} className="w-full py-3 rounded-full font-semibold text-white mb-4 transition-all" style={{backgroundColor: loading ? '#9ca3af' : '#4ABFB0'}}>
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
          <button onClick={() => setIsSignUp(!isSignUp)} className="w-full text-sm text-center mb-2" style={{color: '#7B4FA6'}}>
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
          {!isSignUp && (
            <button onClick={async () => {
              if (!email) { setError('Please enter your email address first'); return; }
              setLoading(true)
              const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://www.playmoveimprove.com/reset-password' })
              setLoading(false)
              if (error) setError(error.message)
              else setMessage('Check your email for a password reset link.')
            }} className="w-full text-sm text-center" style={{color: '#4a5568'}}>Forgot your password?</button>
          )}
        </div>
      </div>
    </div>
  )
}
""")
f.close()
print('done')
