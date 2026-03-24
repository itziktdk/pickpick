'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Calendar, Truck, PackageCheck, PackageOpen, Package as PkgIcon, Copy } from 'lucide-react';
import { usePackageStore } from '@/lib/store';
import { STATUS_LABELS, STATUS_COLORS, PackageStatus } from '@/types/package';
import { cn, formatDateTime } from '@/lib/utils';
import { BottomNav } from '@/components/bottom-nav';

const TIMELINE_ICONS: Record<PackageStatus, React.ReactNode> = {
  new: <PackageOpen className="w-4 h-4" />,
  in_transit: <Truck className="w-4 h-4" />,
  ready_for_pickup: <PackageCheck className="w-4 h-4" />,
  picked_up: <PkgIcon className="w-4 h-4" />,
};

export default function PackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pkg = usePackageStore((s) => s.getPackage(id));

  if (!pkg) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤷</div>
          <p className="text-gray-500">חבילה לא נמצאה</p>
          <button onClick={() => router.push('/dashboard')} className="mt-4 text-primary-600 font-semibold">
            חזרה לדשבורד
          </button>
        </div>
      </div>
    );
  }

  const c = STATUS_COLORS[pkg.status];

  return (
    <div className="min-h-screen bg-surface safe-bottom">
      {/* Header */}
      <div className="gradient-primary px-6 pt-14 pb-8 rounded-b-3xl">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/80 mb-6 active:text-white">
          <ArrowRight className="w-5 h-5" />
          <span className="text-sm">חזרה</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold">
            {pkg.storeName.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{pkg.storeName}</h1>
            <span className={cn('inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold', 'bg-white/20 text-white')}>
              {STATUS_LABELS[pkg.status]}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4 pb-4">
        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-sm"
        >
          <h2 className="font-bold text-gray-900 mb-4">פרטי חבילה</h2>
          <div className="space-y-3 text-sm">
            {pkg.trackingNumber && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">מספר מעקב</span>
                <button
                  onClick={() => navigator.clipboard?.writeText(pkg.trackingNumber || '')}
                  className="flex items-center gap-2 font-mono text-gray-800 active:text-primary-600"
                  dir="ltr"
                >
                  {pkg.trackingNumber}
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-500">מקור</span>
              <span className="text-gray-800">{pkg.source === 'sms' ? 'SMS' : pkg.source === 'email' ? 'אימייל' : 'ידני'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">תאריך קבלה</span>
              <span className="text-gray-800">{new Date(pkg.receivedDate).toLocaleDateString('he-IL')}</span>
            </div>
            {pkg.estimatedDate && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">תאריך משוער</span>
                <span className="text-gray-800">{new Date(pkg.estimatedDate).toLocaleDateString('he-IL')}</span>
              </div>
            )}
            {pkg.pickupLocation && (
              <div className="flex items-start justify-between gap-4">
                <span className="text-gray-500 shrink-0">מיקום איסוף</span>
                <span className="text-gray-800 text-left">{pkg.pickupLocation}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-sm"
        >
          <h2 className="font-bold text-gray-900 mb-4">ציר זמן</h2>
          <div className="space-y-0">
            {[...pkg.statusHistory].reverse().map((entry, i) => {
              const isFirst = i === 0;
              const isLast = i === pkg.statusHistory.length - 1;
              const ec = STATUS_COLORS[entry.status];
              return (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', isFirst ? ec.bg : 'bg-gray-100', isFirst ? ec.text : 'text-gray-400')}>
                      {TIMELINE_ICONS[entry.status]}
                    </div>
                    {!isLast && <div className="w-0.5 h-full min-h-[2rem] bg-gray-100" />}
                  </div>
                  <div className={cn('pb-4', isLast && 'pb-0')}>
                    <p className={cn('font-semibold text-sm', isFirst ? 'text-gray-900' : 'text-gray-500')}>
                      {STATUS_LABELS[entry.status]}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(entry.date)}</p>
                    {entry.note && <p className="text-xs text-gray-500 mt-1">{entry.note}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
