'use client';
import { Sidebar } from '@/components/Sidebar';
import { usePathname } from 'next/navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <div className="flex">
      {!isLanding && <Sidebar />}
      {/* Main Content */}
      <main className={`flex-1 min-h-screen ${!isLanding ? 'pl-64' : ''}`}>
        {children}
      </main>
    </div>
  );
}
