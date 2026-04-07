'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Database, 
  Users, 
  Lock, 
  FolderOpen, 
  Key, 
  Zap, 
  ShieldCheck,
  Settings,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Database', href: '/db', icon: Database },
  { name: 'Authentication', href: '/auth', icon: Users },
  { name: 'Realtime', href: '/realtime', icon: Zap },
  { name: 'Storage', href: '/storage', icon: FolderOpen },
  { name: 'API Keys', href: '/keys', icon: Key },
  { name: 'Security Rules', href: '/rules', icon: ShieldCheck },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Documentation', href: '/docs', icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-[#1e1e24] h-screen fixed left-0 top-0 bg-[#09090b] flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-sm rotate-45" />
        </div>
        <span className="text-xl font-bold tracking-tight">AetherBase</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group text-sm font-medium",
                isActive 
                  ? "bg-[#1e1e24] text-white" 
                  : "text-zinc-400 hover:text-white hover:bg-[#1e1e24]/50"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-zinc-500 group-hover:text-white")} />
              <span className="flex-1">{item.name}</span>
              {isActive && <ChevronRight className="w-3 h-3 text-white" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1e1e24]">
        <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800" />
            <div className="flex-1 overflow-hidden">
                <p className="text-xs font-semibold truncate uppercase tracking-widest text-zinc-500">Free Tier</p>
                <p className="text-xs text-zinc-400 truncate">admin@aetherbase.com</p>
            </div>
        </div>
      </div>
    </aside>
  );
}
