'use client';

import { motion } from 'framer-motion';
import { Settings, Globe, Database, Key } from 'lucide-react';

const ADMIN_SETTINGS = [
  { icon: Globe, title: 'כתובת שרת Gmail', desc: 'http://localhost:3001', badge: 'פיתוח' },
  { icon: Database, title: 'מסד נתונים', desc: 'In-Memory (לפיתוח בלבד)', badge: 'פיתוח' },
  { icon: Key, title: 'Google OAuth', desc: 'יש להגדיר ב-.env', badge: 'נדרש' },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <Settings className="w-5 h-5 text-primary-400" />
        הגדרות מערכת
      </h2>

      <div className="space-y-3">
        {ADMIN_SETTINGS.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-900 rounded-2xl p-4 border border-gray-800 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-primary-400">
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-sm">{item.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5" dir="ltr">{item.desc}</p>
            </div>
            <span className="text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full font-semibold">
              {item.badge}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900 rounded-2xl p-5 border border-gray-800"
      >
        <h3 className="font-bold text-white text-sm mb-3">הוראות התקנה</h3>
        <div className="text-xs text-gray-400 space-y-2 font-mono" dir="ltr">
          <p>1. cd src/services/gmail-service</p>
          <p>2. cp .env.example .env</p>
          <p>3. npm install</p>
          <p>4. # Edit .env with your Google OAuth credentials</p>
          <p>5. npm run dev</p>
        </div>
      </motion.div>
    </div>
  );
}
