'use client';

import { motion } from 'framer-motion';
import { BarChart3, ShoppingBag, Clock, Trophy, Store, TrendingUp } from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';
import { mockUserStats } from '@/lib/mock-data';

const MONTHLY_DATA = [
  { month: 'אוק', count: 4 },
  { month: 'נוב', count: 6 },
  { month: 'דצמ', count: 3 },
  { month: 'ינו', count: 11 },
  { month: 'פבר', count: 4 },
  { month: 'מרץ', count: 6 },
];

const MAX_MONTH = Math.max(...MONTHLY_DATA.map((m) => m.count));

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function StatsPage() {
  const stats = mockUserStats;
  const maxStore = Math.max(...stats.favoriteStores.map((s) => s.count));

  return (
    <div className="min-h-screen bg-surface safe-bottom">
      <div className="gradient-primary px-6 pt-14 pb-8 rounded-b-3xl">
        <h1 className="text-2xl font-black text-white">הסטטיסטיקות שלי 📊</h1>
        <p className="text-white/70 text-sm mt-1">כל המספרים במקום אחד</p>
      </div>

      <motion.div
        className="px-4 -mt-4 space-y-3 pb-4"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      >
        {/* Summary cards */}
        <motion.div variants={item} className="grid grid-cols-3 gap-3">
          {[
            { label: 'החודש', value: stats.totalThisMonth, emoji: '📦' },
            { label: 'השנה', value: stats.totalThisYear, emoji: '📅' },
            { label: 'ממוצע ימים', value: stats.averageDeliveryDays, emoji: '⏱️' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 card-shadow text-center">
              <span className="text-2xl">{s.emoji}</span>
              <p className="text-2xl font-black text-secondary-700 mt-1">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Fun stats */}
        <motion.div variants={item} className="bg-white rounded-2xl p-4 card-shadow space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
              <Store className="w-5 h-5 text-accent-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-secondary-700">הזמנת מ-{stats.uniqueStoresThisYear} חנויות שונות!</p>
              <p className="text-xs text-gray-400">מגוון רציני 🛍️</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-secondary-700">שיא: {stats.bestMonth.count} חבילות בחודש אחד</p>
              <p className="text-xs text-gray-400">{stats.bestMonth.month} 🏆</p>
            </div>
          </div>
        </motion.div>

        {/* Favorite stores */}
        <motion.div variants={item} className="bg-white rounded-2xl p-4 card-shadow">
          <h3 className="font-bold text-secondary-700 mb-3 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-primary-400" />
            חנויות מועדפות
          </h3>
          <div className="space-y-2.5">
            {stats.favoriteStores.map((store, i) => (
              <motion.div
                key={store.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-700">{store.name}</span>
                  <span className="text-xs text-gray-400">{store.count} חבילות</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(store.count / maxStore) * 100}%` }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: store.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Monthly breakdown */}
        <motion.div variants={item} className="bg-white rounded-2xl p-4 card-shadow">
          <h3 className="font-bold text-secondary-700 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-400" />
            פירוט חודשי
          </h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {MONTHLY_DATA.map((m, i) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-secondary-700">{m.count}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(m.count / MAX_MONTH) * 100}%` }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
                  className="w-full rounded-t-lg gradient-primary min-h-[4px]"
                />
                <span className="text-[10px] text-gray-400 font-semibold">{m.month}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <BottomNav />
    </div>
  );
}
