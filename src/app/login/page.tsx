'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) return setError('נא להזין אימייל');
    if (!password) return setError('נא להזין סיסמה');

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="gradient-primary px-6 pt-16 pb-12 rounded-b-[2rem] text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-4xl">📦</span>
          </div>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl font-black text-white mb-1">
          ברוך הבא חזרה!
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-white/70 text-sm">
          התחבר כדי לראות את החבילות שלך
        </motion.p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onSubmit={handleSubmit}
        className="px-6 -mt-6 space-y-4"
      >
        <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 text-center">
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">אימייל</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com" dir="ltr"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm text-left"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">סיסמה</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="הזן סיסמה" dir="ltr"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm text-left pl-12"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl gradient-primary text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
          {loading ? 'מתחבר...' : 'התחברות'}
        </motion.button>

        <p className="text-center text-sm text-gray-500 pb-8">
          אין לך חשבון?{' '}
          <Link href="/register" className="text-primary-500 font-semibold">הירשם</Link>
        </p>
      </motion.form>
    </div>
  );
}
