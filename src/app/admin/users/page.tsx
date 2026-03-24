'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mail, MailX, Package, Calendar, Clock } from 'lucide-react';
import { mockUsers } from '@/lib/mock-users';
import { formatDate } from '@/lib/utils';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  const filtered = mockUsers.filter(
    (u) =>
      u.name.includes(search) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש לפי שם או אימייל..."
          className="w-full bg-gray-900 border border-gray-800 rounded-xl pr-10 pl-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <p className="text-sm text-gray-500">{filtered.length} משתמשים</p>

      {/* User List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((user, i) => (
            <motion.div
              key={user.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ delay: i * 0.03 }}
              className="bg-gray-900 rounded-2xl p-4 border border-gray-800"
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-gray-800 flex items-center justify-center text-lg font-bold text-primary-400 shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">{user.name}</h3>
                    {user.gmailConnected ? (
                      <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <MailX className="w-3.5 h-3.5 text-gray-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate" dir="ltr">{user.email}</p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {user.packageCount} חבילות
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      הצטרף {formatDate(user.joinDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      פעיל {formatDate(user.lastActive)}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="text-xs text-primary-400 bg-primary-400/10 px-3 py-1.5 rounded-lg font-semibold shrink-0"
                >
                  חבילות
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
