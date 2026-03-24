'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Mail, MessageSquare, Bell, Smartphone, Shield, RefreshCw, CheckCircle2, Wifi, WifiOff, Sun, Moon, Monitor } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { useThemeStore, Theme } from '@/lib/theme-store';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function ThemeSelector() {
  const { theme, setTheme } = useThemeStore();
  const options: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'בהיר', icon: '☀️' },
    { value: 'dark', label: 'כהה', icon: '🌙' },
    { value: 'system', label: 'מערכת', icon: '💻' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm space-y-3"
    >
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
          <Moon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">מצב תצוגה</h3>
          <p className="text-xs text-gray-400 mt-0.5">בהיר, כהה או אוטומטי</p>
        </div>
      </div>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold border transition-all',
              theme === opt.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
            )}
          >
            <span>{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function GmailSection() {
  const searchParams = useSearchParams();
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState('');
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [autoScan, setAutoScan] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    if (token && email) {
      localStorage.setItem('gmail_token', token);
      localStorage.setItem('gmail_email', email);
      setGmailConnected(true);
      setGmailEmail(email);
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      const savedEmail = localStorage.getItem('gmail_email');
      const savedToken = localStorage.getItem('gmail_token');
      if (savedEmail && savedToken) {
        setGmailConnected(true);
        setGmailEmail(savedEmail);
      }
    }
    const savedScan = localStorage.getItem('gmail_last_scan');
    if (savedScan) setLastScan(savedScan);
  }, [searchParams]);

  const handleConnectGmail = async () => {
    try {
      const res = await fetch('http://localhost:3001/auth/google', { method: 'POST' });
      const data = await res.json();
      window.location.href = data.url;
    } catch {
      alert('שגיאה בהתחברות. וודאו שהשרת פועל.');
    }
  };

  const handleScan = async () => {
    setScanning(true);
    try {
      const token = localStorage.getItem('gmail_token');
      const res = await fetch('http://localhost:3001/api/packages/scan', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const now = new Date().toISOString();
      setLastScan(now);
      localStorage.setItem('gmail_last_scan', now);
      alert(`נסרקו ${data.totalScanned} אימיילים, נמצאו ${data.newPackages.length} חבילות`);
    } catch {
      alert('שגיאה בסריקה');
    } finally {
      setScanning(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('gmail_token');
    localStorage.removeItem('gmail_email');
    localStorage.removeItem('gmail_last_scan');
    setGmailConnected(false);
    setGmailEmail('');
    setLastScan(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm space-y-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
          <Mail className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">חיבור Gmail</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {gmailConnected ? `מחובר כ-${gmailEmail}` : 'סריקת אימיילים לזיהוי חבילות'}
          </p>
        </div>
        {gmailConnected ? (
          <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            מחובר
          </span>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleConnectGmail}
            className="text-xs gradient-primary text-white px-4 py-2 rounded-xl font-semibold"
          >
            התחברות
          </motion.button>
        )}
      </div>

      {gmailConnected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3 border-t border-gray-100 dark:border-gray-700 pt-3"
        >
          {lastScan && (
            <p className="text-xs text-gray-400">
              סריקה אחרונה: {new Date(lastScan).toLocaleDateString('he-IL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
          )}

          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleScan}
              disabled={scanning}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30"
            >
              <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
              {scanning ? 'סורק...' : 'סרוק עכשיו'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleDisconnect}
              className="py-2.5 px-4 rounded-xl text-sm font-semibold border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30"
            >
              ניתוק
            </motion.button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">סריקה אוטומטית</span>
            <button
              onClick={() => setAutoScan(!autoScan)}
              className={`relative w-11 h-6 rounded-full transition-colors ${autoScan ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <motion.div
                animate={{ x: autoScan ? -20 : 0 }}
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

const OTHER_SETTINGS = [
  { icon: MessageSquare, title: 'חיבור SMS', desc: 'קריאת הודעות SMS אוטומטית', soon: true },
  { icon: Bell, title: 'התראות', desc: 'קבלת עדכונים על שינויי סטטוס', soon: true },
  { icon: Smartphone, title: 'אפליקציית שליחים', desc: 'חיבור לאפליקציות שליחים', soon: true },
];

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-surface dark:bg-[#1a1a2e] safe-bottom">
      <div className="gradient-primary px-6 pt-14 pb-8 rounded-b-3xl">
        <h1 className="text-2xl font-black text-white">הגדרות ⚙️</h1>
        <p className="text-white/70 text-sm mt-1">ניהול חיבורים ואינטגרציות</p>
      </div>

      <div className="px-4 -mt-4 space-y-3 pb-4">
        <ThemeSelector />

        <Suspense fallback={<div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm animate-pulse h-20" />}>
          <GmailSection />
        </Suspense>

        {OTHER_SETTINGS.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (i + 1) * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-center gap-4"
          >
            <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{item.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
            </div>
            <span className="text-xs bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 px-2.5 py-1 rounded-full font-semibold">בקרוב</span>
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
          <Link href="/admin" className="inline-flex items-center gap-1 mt-4 text-xs text-gray-300 hover:text-gray-500 transition-colors">
            <Shield className="w-3 h-3" />
            ניהול
          </Link>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
