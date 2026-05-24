import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Play Move Improve',
  description: 'Movement and literacy resources for families',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}