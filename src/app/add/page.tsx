'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePackageStore } from '@/lib/store';
import { PackageStatus } from '@/types/package';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/bottom-nav';

const STORES = ['אמזון', 'שיין', 'AliExpress', 'דואר ישראל', 'FedEx', 'iHerb', 'אחר'];
const STATUSES: { value: PackageStatus; label: string }[] = [
  { value: 'new', label: 'חדש' },
  { value: 'in_transit', label: 'בדרך' },
  { value: 'ready_for_pickup', label: 'ממתין לאיסוף' },
];

export default function AddPackagePage() {
  const router = useRouter();
  const addPackage = usePackageStore((s) => s.addPackage);
  const [storeName, setStoreName] = useState('');
  const [customStore, setCustomStore] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [status, setStatus] = useState<PackageStatus>('new');
  const [pickupLocation, setPickupLocation] = useState('');
  const [success, setSuccess] = useState(false);

  const effectiveStore = storeName === 'אחר' ? customStore : storeName;

  const handleSubmit = () => {
    if (!effectiveStore) return;
    addPackage({
      storeName: effectiveStore,
      trackingNumber: trackingNumber || undefined,
      status,
      pickupLocation: pickupLocation || undefined,
      receivedDate: new Date().toISOString(),
      source: 'manual',
    });
    setSuccess(true);
    setTimeout(() => router.push('/dashboard'), 1200);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-gray-800">החבילה נוספה!</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface safe-bottom">
      <div className="gradient-primary px-6 pt-14 pb-8 rounded-b-3xl">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/80 mb-4">
          <ArrowRight className="w-5 h-5" />
          <span className="text-sm">חזרה</span>
        </button>
        <h1 className="text-2xl font-black text-white">הוספת חבילה 📦</h1>
        <p className="text-white/70 text-sm mt-1">הזינו את פרטי החבילה</p>
      </div>

      <div className="px-4 -mt-4 space-y-4 pb-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 shadow-sm space-y-5">
          {/* Store */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">חנות / שולח</label>
            <div className="flex flex-wrap gap-2">
              {STORES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStoreName(s)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                    storeName === s ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            {storeName === 'אחר' && (
              <input
                value={customStore}
                onChange={(e) => setCustomStore(e.target.value)}
                placeholder="שם החנות"
                className="mt-3 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            )}
          </div>

          {/* Tracking */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">מספר מעקב (אופציונלי)</label>
            <input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="הזינו מספר מעקב"
              dir="ltr"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">סטטוס</label>
            <div className="flex gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className={cn(
                    'flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all',
                    status === s.value ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600'
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">מיקום איסוף (אופציונלי)</label>
            <input
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="לדוגמה: סניף דואר 61"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={!effectiveStore}
            className={cn(
              'w-full py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all',
              effectiveStore ? 'gradient-primary active:shadow-md' : 'bg-gray-300 cursor-not-allowed'
            )}
          >
            <Plus className="w-5 h-5" />
            הוספת חבילה
          </motion.button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
