'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, PackageCheck, PackageOpen, Package as PkgIcon, Copy, MapPin, Share2, Navigation, Trash2, Archive, Check } from 'lucide-react';
import { usePackageStore } from '@/lib/store';
import { STATUS_LABELS, STATUS_COLORS, PackageStatus } from '@/types/package';
import { cn, formatDateTime, getStoreColor, getDeliveryProgress } from '@/lib/utils';
import { BottomNav } from '@/components/bottom-nav';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Toast } from '@/components/ui/toast';
import { Confetti } from '@/components/ui/confetti';

const TIMELINE_ICONS: Record<PackageStatus, React.ReactNode> = {
  new: <PackageOpen className="w-4 h-4" />,
  in_transit: <Truck className="w-4 h-4" />,
  ready_for_pickup: <PackageCheck className="w-4 h-4" />,
  picked_up: <PkgIcon className="w-4 h-4" />,
};

export default function PackageDetailClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pkg = usePackageStore((s) => s.getPackage(id));
  const updateStatus = usePackageStore((s) => s.updatePackageStatus);
  const showToast = usePackageStore((s) => s.showToast);

  if (!pkg) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤷</div>
          <p className="text-gray-500">חבילה לא נמצאה</p>
          <button onClick={() => router.push('/dashboard')} className="mt-4 text-primary-500 font-semibold">
            חזרה לדשבורד
          </button>
        </div>
      </div>
    );
  }

  const storeColor = getStoreColor(pkg.storeName);
  const progress = getDeliveryProgress(pkg.status);

  const handleCopy = () => {
    navigator.clipboard?.writeText(pkg.trackingNumber || '');
    showToast('מספר מעקב הועתק! 📋');
  };

  const handlePickedUp = () => {
    updateStatus(pkg.id, 'picked_up', 'נאסף בהצלחה');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `חבילה מ-${pkg.storeName}`,
        text: pkg.pickupLocation ? `מיקום איסוף: ${pkg.pickupLocation}` : `מספר מעקב: ${pkg.trackingNumber}`,
      });
    } else {
      showToast('שיתוף לא נתמך בדפדפן זה');
    }
  };

  return (
    <div className="min-h-screen bg-surface safe-bottom">
      <div className="gradient-primary px-6 pt-14 pb-8 rounded-b-3xl">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/80 mb-6 active:text-white">
          <ArrowRight className="w-5 h-5" />
          <span className="text-sm">חזרה</span>
        </button>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg"
            style={{ backgroundColor: storeColor }}
          >
            {pkg.storeName.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white">{pkg.storeName}</h1>
            <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white">
              {STATUS_LABELS[pkg.status]}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar progress={progress} className="bg-white/20 [&>div]:bg-white" />
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4 pb-4">
        {/* Details card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 card-shadow"
        >
          <h2 className="font-bold text-secondary-700 mb-4">פרטי חבילה</h2>
          <div className="space-y-3 text-sm">
            {pkg.trackingNumber && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">מספר מעקב</span>
                <button onClick={handleCopy} className="flex items-center gap-2 font-mono text-secondary-700 active:text-primary-500" dir="ltr">
                  {pkg.trackingNumber}
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-500">מקור</span>
              <span className="text-secondary-700">{pkg.source === 'sms' ? 'SMS' : pkg.source === 'email' ? 'אימייל' : 'ידני'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">תאריך קבלה</span>
              <span className="text-secondary-700">{new Date(pkg.receivedDate).toLocaleDateString('he-IL')}</span>
            </div>
            {pkg.estimatedDate && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">תאריך משוער</span>
                <span className="text-secondary-700">{new Date(pkg.estimatedDate).toLocaleDateString('he-IL')}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Pickup location */}
        {pkg.pickupLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl p-5 card-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center text-accent-500">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-secondary-700 text-sm">📍 נקודת איסוף</h3>
                <p className="text-sm text-gray-500 mt-1">{pkg.pickupLocation}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-accent-50 text-accent-600"
              >
                <Navigation className="w-4 h-4" />
                נווט לשם
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-gray-50 text-gray-600"
              >
                <Share2 className="w-4 h-4" />
                שתף
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 card-shadow"
        >
          <h2 className="font-bold text-secondary-700 mb-4">ציר זמן</h2>
          <div className="space-y-0">
            {[...pkg.statusHistory].reverse().map((entry, i) => {
              const isFirst = i === 0;
              const isLast = i === pkg.statusHistory.length - 1;
              const ec = STATUS_COLORS[entry.status];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="flex gap-3"
                >
                  <div className="flex flex-col items-center">
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', isFirst ? ec.bg : 'bg-gray-100', isFirst ? ec.text : 'text-gray-400')}>
                      {TIMELINE_ICONS[entry.status]}
                    </div>
                    {!isLast && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="w-0.5 min-h-[2rem] bg-gray-100"
                      />
                    )}
                  </div>
                  <div className={cn('pb-4', isLast && 'pb-0')}>
                    <p className={cn('font-semibold text-sm', isFirst ? 'text-secondary-700' : 'text-gray-500')}>
                      {STATUS_LABELS[entry.status]}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(entry.date)}</p>
                    {entry.note && <p className="text-xs text-gray-500 mt-1">{entry.note}</p>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Actions */}
        <div className="space-y-2">
          {pkg.status !== 'picked_up' && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handlePickedUp}
              className="w-full py-4 rounded-2xl gradient-primary text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg"
            >
              <Check className="w-5 h-5" />
              סמן כנאסף 🎉
            </motion.button>
          )}
        </div>
      </div>

      <Toast />
      <Confetti />
      <BottomNav />
    </div>
  );
}
