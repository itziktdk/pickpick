'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, PlusCircle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'דשבורד', icon: LayoutDashboard },
  { href: '/add', label: 'הוסף', icon: PlusCircle },
  { href: '/settings', label: 'הגדרות', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href === '/dashboard' && pathname.startsWith('/package'));
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                'flex flex-col items-center gap-0.5 px-6 py-2 rounded-xl transition-colors relative',
                active ? 'text-primary-600' : 'text-gray-400'
              )}
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 w-6 h-1 rounded-full gradient-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
