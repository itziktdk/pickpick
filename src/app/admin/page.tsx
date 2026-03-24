'use client';

import { motion } from 'framer-motion';
import { Users, Package, Activity, TrendingUp, UserPlus } from 'lucide-react';
import { mockAdminStats } from '@/lib/mock-admin-stats';
import { formatDate } from '@/lib/utils';

const STAT_CARDS = [
  { label: 'סה״כ משתמשים', value: mockAdminStats.totalUsers, icon: Users, color: 'from-blue-500 to-blue-600' },
  { label: 'סה״כ חבילות', value: mockAdminStats.totalPackages, icon: Package, color: 'from-purple-500 to-purple-600' },
  { label: 'פעילים היום', value: mockAdminStats.activeToday, icon: Activity, color: 'from-emerald-500 to-emerald-600' },
];

const STATUS_BAR_COLORS: Record<string, string> = {
  new: 'bg-blue-500',
  in_transit: 'bg-amber-500',
  ready_for_pickup: 'bg-emerald-500',
  picked_up: 'bg-gray-400',
};

const STATUS_LABELS: Record<string, string> = {
  new: 'חדש',
  in_transit: 'בדרך',
  ready_for_pickup: 'ממתין לאיסוף',
  picked_up: 'נאסף',
};

export default function AdminDashboard() {
  const total = Object.values(mockAdminStats.packagesByStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-900 rounded-2xl p-5 border border-gray-800"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-white">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Package Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 rounded-2xl p-5 border border-gray-800"
        >
          <h2 className="font-bold text-white mb-4">חבילות לפי סטטוס</h2>
          <div className="space-y-3">
            {Object.entries(mockAdminStats.packagesByStatus).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{STATUS_LABELS[status]}</span>
                  <span className="text-gray-300 font-semibold">{count}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / total) * 100}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className={`h-2.5 rounded-full ${STATUS_BAR_COLORS[status]}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Registrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 rounded-2xl p-5 border border-gray-800"
        >
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary-400" />
            הרשמות אחרונות
          </h2>
          <div className="space-y-3">
            {mockAdminStats.recentRegistrations.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-bold text-primary-400">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <span className="text-xs text-gray-600">{formatDate(user.joinDate)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Daily Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-900 rounded-2xl p-5 border border-gray-800"
      >
        <h2 className="font-bold text-white mb-4">פעילות יומית</h2>
        <div className="flex items-end gap-2 h-32">
          {mockAdminStats.dailyActivity.map((day, i) => {
            const maxScans = Math.max(...mockAdminStats.dailyActivity.map((d) => d.scans));
            const height = (day.scans / maxScans) * 100;
            return (
              <motion.div
                key={day.date}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.6 + i * 0.05, duration: 0.5 }}
                className="flex-1 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg relative group cursor-pointer"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {day.scans} סריקות
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="flex gap-2 mt-2">
          {mockAdminStats.dailyActivity.map((day) => (
            <div key={day.date} className="flex-1 text-center text-[10px] text-gray-600">
              {new Date(day.date).toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' })}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
