import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Community Issues & Impact Tracker – Malaysia',
  description: 'Track and manage community issues across Malaysia with local NGO support',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <nav className="bg-gradient-to-r from-sky-900 via-sky-800 to-teal-800 text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:bg-white/20 transition-all">
                  <span className="text-2xl">🇲🇾</span>
                </div>
                <div>
                  <span className="font-bold text-lg tracking-tight">Community Impact</span>
                  <span className="hidden sm:inline text-sky-200 text-sm ml-2">Malaysia</span>
                </div>
              </Link>
              
              <div className="flex items-center space-x-1">
                <Link 
                  href="/ngos" 
                  className="px-4 py-2 rounded-lg text-sky-100 hover:bg-white/10 hover:text-white transition-all duration-200 font-medium"
                >
                  NGOs
                </Link>
                <Link 
                  href="/issues" 
                  className="px-4 py-2 rounded-lg text-sky-100 hover:bg-white/10 hover:text-white transition-all duration-200 font-medium"
                >
                  Issues
                </Link>
                <Link 
                  href="/issues/create" 
                  className="ml-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-sky-900 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  + Report Issue
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>

        <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm">
              🇲🇾 Community Issues & Impact Tracker – Malaysia
            </p>
            <p className="text-xs mt-2 text-slate-500">
              Connecting communities with NGOs for a better Malaysia
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
