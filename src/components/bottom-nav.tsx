'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, PlusCircle, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'דשבורד', icon: LayoutDashboard },
  { href: '/add', label: 'הוסף', icon: PlusCircle, prominent: true },
  { href: '/stats', label: 'סטטיסטיקות', icon: BarChart3 },
  { href: '/settings', label: 'הגדרות', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href === '/dashboard' && pathname.startsWith('/package'));
          return (
            <motion.button
              key={item.href}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push(item.href)}
              className={cn(
                'flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-colors relative',
                item.prominent && !active ? 'text-primary-500' : '',
                active ? 'text-primary-500' : !item.prominent ? 'text-gray-400' : ''
              )}
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 w-6 h-1 rounded-full gradient-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {item.prominent ? (
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center -mt-3 shadow-lg',
                  active ? 'gradient-primary text-white' : 'bg-primary-50 text-primary-500'
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
              ) : (
                <item.icon className="w-5 h-5" />
              )}
              <span className="text-[10px] font-semibold">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
