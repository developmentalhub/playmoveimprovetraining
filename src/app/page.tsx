import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-purple-700 mb-4">
        Play Move Improve
      </h1>
      <p className="text-gray-500 mb-8">
        Movement and literacy resources for families
      </p>
      <Link
        href="/shop"
        className="bg-purple-600 text-white px-6 py-3 rounded-lg text-lg"
      >
        Browse Videos →
      </Link>
    </div>
  )
}