f = open('src/app/layout.tsx', 'w', encoding='utf-8')
f.write("""import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import AuthRedirectHandler from '@/components/AuthRedirectHandler'

export const metadata: Metadata = {
  title: 'Play Move Improve',
  description: 'Movement and literacy resources for families',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <AuthRedirectHandler />
        {children}
      </body>
    </html>
  )
}
""")
f.close()
print('done')
