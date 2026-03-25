'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, X, Lock, Key, LogOut, Trash2, Eye, EyeOff, ChevronDown, Fingerprint, Plus, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { isPasskeySupported } from '@/lib/passkey';
import { BottomNav } from '@/components/bottom-nav';
import { cn } from '@/lib/utils';

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function EditableField({ label, icon, value, onSave, editable = true, placeholder }: {
  label: string; icon: string; value: string; onSave?: (v: string) => Promise<void>; editable?: boolean; placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setDraft(value); }, [value]);

  const handleSave = async () => {
    if (draft === value) { setEditing(false); return; }
    setSaving(true);
    try {
      await onSave?.(draft);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div layout className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <span className="text-lg">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        {editing ? (
          <motion.input
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder={placeholder}
            className="w-full text-sm font-semibold text-gray-900 dark:text-gray-100 bg-transparent outline-none border-b-2 border-primary-400 pb-0.5"
          />
        ) : (
          <p className={cn('text-sm font-semibold', value ? 'text-gray-900 dark:text-gray-100' : 'text-gray-300 dark:text-gray-600')}>
            {value || placeholder || '—'}
          </p>
        )}
      </div>
      {editable && (
        editing ? (
          <div className="flex gap-1.5">
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleSave} disabled={saving}
              className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              {saving ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full" /> : <Check className="w-4 h-4" />}
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setDraft(value); setEditing(false); }}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        ) : (
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setEditing(true)}
            className="text-xs text-primary-500 font-semibold px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30">
            עריכה
          </motion.button>
        )
      )}
    </motion.div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, logout, updateUser, registerPasskeyFn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [passkeySupported, setPasskeySupported] = useState(false);
  const [passkeyCount, setPasskeyCount] = useState<number | null>(null);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPwSection, setShowPwSection] = useState(false);
  const [toast, setToast] = useState('');

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => {
    setPasskeySupported(isPasskeySupported());
    if (token) {
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => { if (data.user?.passkeyCount !== undefined) setPasskeyCount(data.user.passkeyCount); })
        .catch(() => {});
    }
  }, [token]);

  const handleRegisterPasskey = async () => {
    setPasskeyLoading(true);
    const result = await registerPasskeyFn();
    setPasskeyLoading(false);
    if (result.success) {
      setPasskeyCount((prev) => (prev ?? 0) + 1);
      showToastMsg('Passkey נוסף בהצלחה! 🎉');
    } else {
      showToastMsg(result.error || 'שגיאה ברישום Passkey');
    }
  };

  const saveField = async (field: string, value: string) => {
    const res = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ [field]: value }),
    });
    if (!res.ok) throw new Error();
    updateUser({ [field]: value });
    showToastMsg('נשמר בהצלחה ✅');
  };

  const handleChangePassword = async () => {
    setPwError('');
    if (newPw.length < 6) { setPwError('הסיסמה חייבת להכיל לפחות 6 תווים'); return; }
    if (newPw !== confirmPw) { setPwError('הסיסמאות לא תואמות'); return; }
    setPwLoading(true);
    try {
      const res = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) { setPwError(data.error); return; }
      setPwSuccess(true);
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      showToastMsg('הסיסמה שונתה בהצלחה 🔒');
      setTimeout(() => { setPwSuccess(false); setShowPwSection(false); }, 2000);
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-surface dark:bg-[#1a1a2e] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">יש להתחבר כדי לצפות בפרופיל</p>
          <button onClick={() => router.push('/login')} className="gradient-primary text-white px-6 py-3 rounded-2xl font-bold">התחברות</button>
        </div>
        <BottomNav />
      </div>
    );
  }

  const initials = getInitials(user.name);
  const joinDate = user.joinDate ? new Date(user.joinDate).toLocaleDateString('he-IL', { year: 'numeric', month: 'long' }) : '';

  return (
    <div className="min-h-screen bg-surface dark:bg-[#1a1a2e] safe-bottom">
      {/* Header */}
      <div className="gradient-primary px-6 pt-14 pb-12 rounded-b-3xl relative">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/80 mb-6 active:text-white">
          <ArrowRight className="w-5 h-5" />
          <span className="text-sm">חזרה</span>
        </button>
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-black text-white border-4 border-white/30 shadow-xl"
          >
            {initials}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-2xl font-black text-white mt-4">{user.name}</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/70 text-sm mt-1">{user.email}</motion.p>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-4 pb-4">
        {/* Stats */}
        {joinDate && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 card-shadow flex items-center justify-around text-center">
            <div>
              <p className="text-2xl font-black text-primary-500">0</p>
              <p className="text-xs text-gray-400 mt-0.5">חבילות נמסרו</p>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
            <div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{joinDate}</p>
              <p className="text-xs text-gray-400 mt-0.5">חבר מאז</p>
            </div>
          </motion.div>
        )}

        {/* Profile Fields */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-5 card-shadow">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2">פרטים אישיים</h2>
          <EditableField icon="📝" label="שם מלא" value={user.name} onSave={(v) => saveField('name', v)} />
          <EditableField icon="📧" label="אימייל" value={user.email} editable={false} />
          <EditableField icon="📱" label="טלפון" value={user.phone || ''} onSave={(v) => saveField('phone', v)} placeholder="הוסף מספר טלפון" />
          <EditableField icon="📍" label="כתובת" value={user.address || ''} onSave={(v) => saveField('address', v)} placeholder="הוסף כתובת" />
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-5 card-shadow space-y-4">
          <h2 className="font-bold text-gray-900 dark:text-gray-100">אבטחה</h2>

          {/* Password */}
          <motion.button whileTap={{ scale: 0.98 }} onClick={() => setShowPwSection(!showPwSection)}
            className="w-full flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">שינוי סיסמה</span>
            </div>
            <motion.div animate={{ rotate: showPwSection ? 180 : 0 }}>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {showPwSection && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-3">
                <input type="password" placeholder="סיסמה נוכחית" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 outline-none border border-gray-200 dark:border-gray-600 focus:border-primary-400" />
                <input type="password" placeholder="סיסמה חדשה (לפחות 6 תווים)" value={newPw} onChange={(e) => setNewPw(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 outline-none border border-gray-200 dark:border-gray-600 focus:border-primary-400" />
                <input type="password" placeholder="אימות סיסמה חדשה" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 outline-none border border-gray-200 dark:border-gray-600 focus:border-primary-400" />
                {pwError && <p className="text-xs text-red-500 font-semibold">{pwError}</p>}
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleChangePassword} disabled={pwLoading}
                  className="w-full py-3 rounded-xl gradient-primary text-white font-bold text-sm flex items-center justify-center gap-2">
                  {pwLoading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Lock className="w-4 h-4" />}
                  {pwLoading ? 'משנה...' : 'שנה סיסמה'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Passkey */}
          {!passkeySupported ? (
            <div className="flex items-center justify-between py-2 opacity-60">
              <div className="flex items-center gap-3">
                <Fingerprint className="w-5 h-5 text-gray-400" />
                <div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Passkey</span>
                  <p className="text-xs text-gray-400 mt-0.5">המכשיר שלך לא תומך ב-Passkey</p>
                  <p className="text-xs text-gray-400">נדרש מכשיר עם Face ID, Touch ID, או חיישן טביעת אצבע</p>
                </div>
              </div>
            </div>
          ) : passkeyCount && passkeyCount > 0 ? (
            <div className="py-2 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-emerald-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Passkey</span>
                      <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">✅ מוגדר</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{passkeyCount} מכשירים מחוברים</p>
                  </div>
                </div>
                <Shield className="w-4 h-4 text-emerald-500" />
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleRegisterPasskey} disabled={passkeyLoading}
                className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                {passkeyLoading ? 'מוסיף...' : 'הוסף מכשיר נוסף'}
              </motion.button>
            </div>
          ) : (
            <div className="py-2 space-y-2">
              <div className="flex items-center gap-3">
                <Fingerprint className="w-5 h-5 text-gray-400" />
                <div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Passkey</span>
                  <p className="text-xs text-gray-400 mt-0.5">התחבר עם Face ID או טביעת אצבע</p>
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleRegisterPasskey} disabled={passkeyLoading}
                className="w-full py-3 rounded-xl gradient-primary text-white font-bold text-sm flex items-center justify-center gap-2">
                <Fingerprint className="w-4 h-4" />
                {passkeyLoading ? 'מגדיר...' : 'הגדר Passkey 🔑'}
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-5 card-shadow space-y-3">
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold text-sm">
            <LogOut className="w-4 h-4" />
            התנתק
          </motion.button>

          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-red-400 font-semibold text-sm">
            <Trash2 className="w-4 h-4" />
            מחק חשבון
          </motion.button>
        </motion.div>
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[101] bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-2">מחיקת חשבון</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">אתה בטוח? הפעולה לא הפיכה. כל המידע שלך יימחק לצמיתות.</p>
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-semibold text-sm text-gray-600 dark:text-gray-400">
                  ביטול
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm">
                  מחק לצמיתות
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 inset-x-4 z-[102] bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-2xl py-3 px-5 text-center text-sm font-semibold shadow-xl">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
