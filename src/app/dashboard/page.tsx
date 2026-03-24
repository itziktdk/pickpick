'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, ChevronLeft, Truck, PackageCheck, PackageOpen, Clock, Package, Navigation, ChevronDown, Bell, Scan, PlusCircle, ExternalLink } from 'lucide-react';
import { cn, formatDate, timeAgo, getDeliveryProgress, getStoreColor, daysBetween } from '@/lib/utils';
import { Package as PkgType, STATUS_LABELS, STATUS_COLORS, PackageStatus } from '@/types/package';
import { usePackageStore } from '@/lib/store';
import { BottomNav } from '@/components/bottom-nav';
import { Toast } from '@/components/ui/toast';
import { Confetti } from '@/components/ui/confetti';
import { ProgressBar } from '@/components/ui/progress-bar';
import { useRouter } from 'next/navigation';

const STATUS_ICONS: Record<PackageStatus, React.ReactNode> = {
  new: <PackageOpen className="w-4 h-4" />,
  in_transit: <Truck className="w-4 h-4" />,
  ready_for_pickup: <PackageCheck className="w-4 h-4" />,
  picked_up: <Package className="w-4 h-4" />,
};

function getGreeting(): string {
  const now = new Date();
  // Israel timezone approximation: UTC+3
  const israelHour = (now.getUTCHours() + 3) % 24;
  const name = 'חבר'; // default, could come from auth context

  if (israelHour >= 5 && israelHour < 12) return `בוקר טוב, ${name}! ☀️`;
  if (israelHour >= 12 && israelHour < 17) return `צהריים טובים, ${name}! 🌤️`;
  if (israelHour >= 17 && israelHour < 21) return `ערב טוב, ${name}! 🌅`;
  return `לילה טוב, ${name}! 🌙`;
}

function UrgentBanner({ packages }: { packages: PkgType[] }) {
  const expiring = packages.filter((p) => {
    if (p.status !== 'ready_for_pickup') return false;
    const readyEntry = [...p.statusHistory].reverse().find((h) => h.status === 'ready_for_pickup');
    if (!readyEntry) return false;
    return daysBetween(readyEntry.date, new Date().toISOString()) >= 7;
  });

  if (expiring.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 -mt-3 mb-3"
    >
      {expiring.map((pkg) => (
        <div key={pkg.id} className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl p-3 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700 dark:text-red-300">חבילה עומדת לפוג!</p>
            <p className="text-xs text-red-500 dark:text-red-400">{pkg.storeName} — {pkg.pickupLocation}</p>
          </div>
          <Bell className="w-4 h-4 text-red-400" />
        </div>
      ))}
    </motion.div>
  );
}

function PackageCard({ pkg }: { pkg: PkgType }) {
  const router = useRouter();
  const storeColor = getStoreColor(pkg.storeName);
  const progress = getDeliveryProgress(pkg.status);
  const isReady = pkg.status === 'ready_for_pickup';
  const hasConfirmation = pkg.confirmationUrl && isReady;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(`/package/${pkg.id}`)}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl p-4 card-shadow cursor-pointer active:card-shadow-hover transition-shadow',
        isReady && 'ring-2 ring-accent-400/30'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-sm"
            style={{ backgroundColor: storeColor }}
          >
            {pkg.storeName.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-secondary-700 dark:text-gray-100">{pkg.storeName}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{timeAgo(pkg.receivedDate)}</p>
          </div>
        </div>
        <span className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border',
          STATUS_COLORS[pkg.status].bg, STATUS_COLORS[pkg.status].text, STATUS_COLORS[pkg.status].border
        )}>
          {STATUS_ICONS[pkg.status]}
          {STATUS_LABELS[pkg.status]}
        </span>
      </div>

      <ProgressBar progress={progress} className="mb-3" />

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-3">
          {pkg.pickupLocation && (
            <span className="flex items-center gap-1 truncate max-w-[180px]">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-primary-400" />
              <span className="truncate">{pkg.pickupLocation}</span>
            </span>
          )}
        </div>
        {hasConfirmation ? (
          <motion.a
            href={pkg.confirmationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg"
          >
            <ExternalLink className="w-3 h-3" />
            אשר מסירה
          </motion.a>
        ) : isReady ? (
          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-1 text-accent-500 font-bold text-xs"
          >
            <Navigation className="w-3.5 h-3.5" />
            אסוף עכשיו!
          </motion.span>
        ) : null}
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { filter, setFilter, filteredPackages } = usePackageStore();
  const allPackages = usePackageStore((s) => s.packages);
  const packages = filteredPackages();
  const router = useRouter();
  const [showCompleted, setShowCompleted] = useState(false);
  const [greeting, setGreeting] = useState('שלום! 👋');

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const activePackages = packages.filter((p) => p.status !== 'picked_up');
  const completedPackages = packages.filter((p) => p.status === 'picked_up');
  const activeCount = allPackages.filter((p) => p.status !== 'picked_up').length;
  const readyCount = allPackages.filter((p) => p.status === 'ready_for_pickup').length;

  return (
    <div className="min-h-screen bg-surface dark:bg-[#1a1a2e] safe-bottom">
      {/* Header */}
      <div className="gradient-primary px-6 pt-14 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-white">{greeting}</h1>
            <p className="text-white/80 text-sm mt-1">
              {activeCount > 0
                ? `יש לך ${activeCount} חבילות ממתינות`
                : 'אין חבילות פעילות'}
              {readyCount > 0 && ` • ${readyCount} לאיסוף`}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/notifications')}
            className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center relative"
          >
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-warning rounded-full text-[9px] font-bold text-white flex items-center justify-center">2</span>
          </motion.button>
        </div>

        {/* Quick action chips */}
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/settings')}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-semibold"
          >
            <Scan className="w-4 h-4" />
            סרוק עכשיו
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/add')}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-semibold"
          >
            <PlusCircle className="w-4 h-4" />
            הוסף ידנית
          </motion.button>
        </div>
      </div>

      <UrgentBanner packages={allPackages} />

      {/* Package List */}
      <div className="px-4 space-y-3 pb-4 mt-4">
        <AnimatePresence mode="popLayout">
          {activePackages.length > 0 ? (
            activePackages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-lg font-bold text-secondary-700 dark:text-gray-200 mb-1">אין חבילות בדרך...</h3>
              <p className="text-sm text-gray-400">זה הזמן להזמין משהו! 😄</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completed section */}
        {completedPackages.length > 0 && (
          <div className="pt-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCompleted(!showCompleted)}
              className="w-full flex items-center justify-between py-3 px-1 text-gray-400"
            >
              <span className="text-sm font-semibold">חבילות שנאספו ({completedPackages.length})</span>
              <motion.div animate={{ rotate: showCompleted ? 180 : 0 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>
            <AnimatePresence>
              {showCompleted && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  {completedPackages.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Toast />
      <Confetti />
      <BottomNav />
    </div>
  );
}
