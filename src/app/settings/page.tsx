'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Mail, MessageSquare, Bell, ChevronLeft, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/bottom-nav';

const SETTINGS = [
  { icon: MessageSquare, title: 'חיבור SMS', desc: 'קריאת הודעות SMS אוטומטית', soon: true },
  { icon: Mail, title: 'חיבור Gmail', desc: 'סריקת אימיילים לזיהוי חבילות', soon: true },
  { icon: Bell, title: 'התראות', desc: 'קבלת עדכונים על שינויי סטטוס', soon: true },
  { icon: Smartphone, title: 'אפליקציית שליחים', desc: 'חיבור לאפליקציות שליחים', soon: true },
];

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-surface safe-bottom">
      <div className="gradient-primary px-6 pt-14 pb-8 rounded-b-3xl">
        <h1 className="text-2xl font-black text-white">הגדרות ⚙️</h1>
        <p className="text-white/70 text-sm mt-1">ניהול חיבורים ואינטגרציות</p>
      </div>

      <div className="px-4 -mt-4 space-y-3 pb-4">
        {SETTINGS.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4"
          >
            <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
            </div>
            {item.soon && (
              <span className="text-xs bg-accent-50 text-accent-600 px-2.5 py-1 rounded-full font-semibold">בקרוב</span>
            )}
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center pt-8 text-sm text-gray-400"
        >
          <p>PickPick v0.1.0</p>
          <p className="mt-1">🇮🇱 נבנה באהבה בישראל</p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
