'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const ADMIN_NAV = [
  { href: '/admin', label: 'דשבורד', icon: LayoutDashboard },
  { href: '/admin/users', label: 'משתמשים', icon: Users },
  { href: '/admin/settings', label: 'הגדרות', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Admin Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">PickPick Admin</h1>
              <p className="text-gray-500 text-xs">לוח ניהול</p>
            </div>
          </div>
          <Link href="/settings" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
            ← חזרה לאפליקציה
          </Link>
        </div>
      </header>

      {/* Admin Nav */}
      <nav className="bg-gray-900/50 border-b border-gray-800 px-6">
        <div className="flex gap-1 max-w-5xl mx-auto overflow-x-auto">
          {ADMIN_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  active
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
