'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Package, MapPin, Calendar, ChevronLeft, Truck, PackageCheck, PackageOpen, Clock } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { Package as PkgType, STATUS_LABELS, STATUS_COLORS, PackageStatus } from '@/types/package';
import { usePackageStore } from '@/lib/store';
import { BottomNav } from '@/components/bottom-nav';
import { useRouter } from 'next/navigation';

const STATUS_ICONS: Record<PackageStatus, React.ReactNode> = {
  new: <PackageOpen className="w-4 h-4" />,
  in_transit: <Truck className="w-4 h-4" />,
  ready_for_pickup: <PackageCheck className="w-4 h-4" />,
  picked_up: <Package className="w-4 h-4" />,
};

const FILTERS: { value: PackageStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'הכל' },
  { value: 'new', label: 'חדש' },
  { value: 'in_transit', label: 'בדרך' },
  { value: 'ready_for_pickup', label: 'לאיסוף' },
  { value: 'picked_up', label: 'נאסף' },
];

function StatusBadge({ status }: { status: PackageStatus }) {
  const c = STATUS_COLORS[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border', c.bg, c.text, c.border)}>
      {STATUS_ICONS[status]}
      {STATUS_LABELS[status]}
    </span>
  );
}

function PackageCard({ pkg }: { pkg: PkgType }) {
  const router = useRouter();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(`/package/${pkg.id}`)}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer active:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white text-lg font-bold shadow-sm">
            {pkg.storeName.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{pkg.storeName}</h3>
            {pkg.trackingNumber && (
              <p className="text-xs text-gray-400 font-mono mt-0.5" dir="ltr">{pkg.trackingNumber}</p>
            )}
          </div>
        </div>
        <StatusBadge status={pkg.status} />
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(pkg.receivedDate)}
        </span>
        {pkg.pickupLocation && (
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{pkg.pickupLocation}</span>
          </span>
        )}
        {pkg.estimatedDate && (
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatDate(pkg.estimatedDate)}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { filter, setFilter, filteredPackages } = usePackageStore();
  const packages = filteredPackages();
  const activeCount = usePackageStore((s) => s.packages.filter((p) => p.status !== 'picked_up').length);

  return (
    <div className="min-h-screen bg-surface safe-bottom">
      {/* Header */}
      <div className="gradient-primary px-6 pt-14 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-2xl font-black text-white">שלום! 👋</h1>
            <p className="text-white/70 text-sm mt-1">
              {activeCount > 0 ? `${activeCount} חבילות פעילות` : 'אין חבילות פעילות'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 -mt-4 mb-4">
        <div className="bg-white rounded-2xl p-1.5 shadow-sm flex gap-1 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all',
                filter === f.value
                  ? 'gradient-primary text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Package List */}
      <div className="px-4 space-y-3 pb-4">
        <AnimatePresence mode="popLayout">
          {packages.length > 0 ? (
            packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-lg font-bold text-gray-700 mb-1">אין חבילות</h3>
              <p className="text-sm text-gray-400">הוסיפו חבילה חדשה כדי להתחיל לעקוב</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
