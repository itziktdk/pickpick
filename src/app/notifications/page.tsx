'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check } from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';
import { mockNotifications } from '@/lib/mock-data';
import { timeAgo } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const TYPE_ICONS: Record<string, string> = {
  arrived: '📦',
  expiring: '⚠️',
  reminder: '⏰',
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-[#1a1a2e] safe-bottom">
      <div className="gradient-primary px-6 pt-14 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">התראות 🔔</h1>
            <p className="text-white/70 text-sm mt-1">
              {unreadCount > 0 ? `${unreadCount} התראות חדשות` : 'הכל נקרא'}
            </p>
          </div>
          {unreadCount > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={markAllRead}
              className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-xs font-semibold"
            >
              <Check className="w-3.5 h-3.5" />
              סמן הכל כנקרא
            </motion.button>
          )}
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-3 pb-4">
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🎧</div>
            <h3 className="text-lg font-bold text-secondary-700 mb-1">הכל שקט!</h3>
            <p className="text-sm text-gray-400">אין התראות חדשות</p>
          </motion.div>
        ) : (
          notifications.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/package/${notif.packageId}`)}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-4 card-shadow cursor-pointer flex items-start gap-3 relative ${
                !notif.read ? 'ring-2 ring-primary-200/50 dark:ring-primary-700/50' : ''
              }`}
            >
              {!notif.read && (
                <span className="absolute top-4 left-4 w-2.5 h-2.5 rounded-full bg-primary-500" />
              )}
              <span className="text-2xl mt-0.5">{TYPE_ICONS[notif.type] || '📦'}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-secondary-700 dark:text-gray-100 text-sm">{notif.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{notif.body}</p>
                <p className="text-[10px] text-gray-300 mt-1.5 font-semibold">{timeAgo(notif.date)}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
