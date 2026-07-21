import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { AuthProvider } from '@/lib/auth-context'

export const metadata = {
  title: 'Chakra - Nepal MTB Hub',
  description: 'Central hub for mountain bikers in Nepal'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fcfaf8] font-sans antialiased text-zinc-900">
        <AuthProvider>
          <SiteHeader />
          <main className="min-h-[calc(100vh-160px)]">{children}</main>
          <footer className="border-t mt-20 py-10 text-center text-xs text-zinc-500 bg-white">
            Built for Nepal MTB community • Kathmandu • Open source • v1.0 MVP
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
