'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16"
         style={{backgroundColor: '#f8fffe'}}>
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-lg text-center border-t-4"
           style={{borderColor: '#4ABFB0'}}>

        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
             style={{backgroundColor: '#e0f7f5'}}>
          <svg className="w-8 h-8" style={{color: '#4ABFB0'}}
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-3xl font-bold mb-3" style={{color: '#1a2e44'}}>
          Payment successful
        </h2>
        <p className="mb-2" style={{color: '#4a5568'}}>
          Thank you for your purchase. Your videos are now available in your library.
        </p>
        <p className="text-sm mb-8" style={{color: '#7B4FA6'}}>
          You will also receive a confirmation email shortly.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/library"
                className="w-full py-3 rounded-full font-semibold text-white text-center"
                style={{backgroundColor: '#4ABFB0'}}>
            Go to My Library
          </Link>
          <Link href="/shop"
                className="w-full py-3 rounded-full font-semibold text-center border-2"
                style={{borderColor: '#7B4FA6', color: '#7B4FA6'}}>
            Browse More Videos
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}