import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AetherBase Dashboard',
  description: 'Production-ready BaaS control panel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#09090b] text-white min-h-screen`}>
        <div className="flex">
          <Sidebar />
          {/* Main Content */}
          <main className="flex-1 min-h-screen pl-64">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
