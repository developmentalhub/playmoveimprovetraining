import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" 
         style={{backgroundColor: '#f0faf9'}}>
      <h1 className="text-4xl font-bold mb-2" style={{color: '#7B4FA6'}}>
        Play Move Improve
      </h1>
      <p className="text-lg mb-2 font-semibold" style={{color: '#4ABFB0'}}>
        The Developmental Hub
      </p>
      <p className="mb-8 text-gray-600">
        Movement and literacy resources for families
      </p>
      <Link
        href="/shop"
        className="px-6 py-3 rounded-lg text-lg text-white font-semibold"
        style={{backgroundColor: '#4ABFB0'}}
      >
        Browse Videos →
      </Link>
    </div>
  )
}