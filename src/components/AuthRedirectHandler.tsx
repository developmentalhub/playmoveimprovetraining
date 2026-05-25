'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthRedirectHandler() {
  const router = useRouter()
  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.includes('type=recovery')) {
      router.push('/reset-password' + hash)
    }
  }, [router])
  return null
}
