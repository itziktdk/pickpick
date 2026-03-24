'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, MapPin } from 'lucide-react';
import { cn, timeAgo, getStoreColor } from '@/lib/utils';
import { STATUS_LABELS, STATUS_COLORS } from '@/types/package';
import { BottomNav } from '@/components/bottom-nav';
import { Toast } from '@/components/ui/toast';
import { usePackageStore } from '@/lib/store';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Package } from '@/types/package';
import { useRouter } from 'next/navigation';

interface FamilyMemberData {
  id: string;
  name: string;
  initial: string;
  color: string;
  packages: Package[];
  lastActive: string;
}

const FAMILY_MEMBERS: FamilyMemberData[] = [
  {
    id: 'f1',
    name: 'אבא',
    initial: 'א',
    color: '#4ECDC4',
    lastActive: '2026-03-24T10:00:00Z',
    packages: [
      {
        id: 'fam1',
        storeName: 'אמזון',
        trackingNumber: 'AMZ-FAM-001',
        status: 'in_transit',
        estimatedDate: '2026-03-28',
        receivedDate: '2026-03-20',
        source: 'email',
        statusHistory: [
          { status: 'new', date: '2026-03-20T10:00:00Z' },
          { status: 'in_transit', date: '2026-03-22T14:00:00Z' },
        ],
      },
      {
        id: 'fam2',
        storeName: 'KSP',
        trackingNumber: 'KSP-FAM-002',
        status: 'ready_for_pickup',
        pickupLocation: 'סניף KSP - רמת גן',
        receivedDate: '2026-03-18',
        source: 'manual',
        statusHistory: [
          { status: 'new', date: '2026-03-18T08:00:00Z' },
          { status: 'ready_for_pickup', date: '2026-03-21T12:00:00Z' },
        ],
      },
    ],
  },
  {
    id: 'f2',
    name: 'אמא',
    initial: 'א',
    color: '#FF6B6B',
    lastActive: '2026-03-23T18:00:00Z',
    packages: [
      {
        id: 'fam3',
        storeName: 'שיין',
        trackingNumber: 'SHEIN-FAM-003',
        status: 'in_transit',
        receivedDate: '2026-03-19',
        source: 'email',
        statusHistory: [
          { status: 'new', date: '2026-03-19T09:00:00Z' },
          { status: 'in_transit', date: '2026-03-21T11:00:00Z' },
        ],
      },
      {
        id: 'fam4',
        storeName: 'ASOS',
        trackingNumber: 'ASOS-FAM-004',
        status: 'ready_for_pickup',
        pickupLocation: 'לוקר - דיזנגוף סנטר',
        receivedDate: '2026-03-15',
        source: 'email',
        statusHistory: [
          { status: 'new', date: '2026-03-15T10:00:00Z' },
          { status: 'in_transit', date: '2026-03-18T12:00:00Z' },
          { status: 'ready_for_pickup', date: '2026-03-22T09:00:00Z' },
        ],
      },
      {
        id: 'fam5',
        storeName: 'iHerb',
        trackingNumber: 'IHR-FAM-005',
        status: 'picked_up',
        pickupLocation: 'נקודת חלוקה - גבעתיים',
        receivedDate: '2026-03-10',
        source: 'manual',
        statusHistory: [
          { status: 'new', date: '2026-03-10T08:00:00Z' },
          { status: 'picked_up', date: '2026-03-16T14:00:00Z' },
        ],
      },
    ],
  },
  {
    id: 'f3',
    name: 'עידן',
    initial: 'ע',
    color: '#FFB347',
    lastActive: '2026-03-22T14:00:00Z',
    packages: [
      {
        id: 'fam6',
        storeName: 'AliExpress',
        trackingNumber: 'ALI-FAM-006',
        status: 'new',
        receivedDate: '2026-03-23',
        source: 'email',
        statusHistory: [
          { status: 'new', date: '2026-03-23T20:00:00Z' },
        ],
      },
    ],
  },
  {
    id: 'f4',
    name: 'סבתא',
    initial: 'ס',
    color: '#9B59B6',
    lastActive: '2026-03-20T10:00:00Z',
    packages: [
      {
        id: 'fam7',
        storeName: 'דואר ישראל',
        trackingNumber: 'RR-FAM-007',
        status: 'ready_for_pickup',
        pickupLocation: 'סניף דואר 15 - פתח תקווה',
        receivedDate: '2026-03-12',
        source: 'sms',
        statusHistory: [
          { status: 'new', date: '2026-03-12T07:00:00Z' },
          { status: 'ready_for_pickup', date: '2026-03-17T08:00:00Z' },
        ],
      },
    ],
  },
];

export default function FamilyPage() {
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const { showToast } = usePackageStore();
  const router = useRouter();

  const tabs = [{ id: 'all', name: 'כולם' }, ...FAMILY_MEMBERS.map((m) => ({ id: m.id, name: m.name }))];

  const displayedPackages =
    selectedMember === 'all'
      ? FAMILY_MEMBERS.flatMap((m) => m.packages.map((p) => ({ ...p, owner: m.name, ownerColor: m.color })))
      : (FAMILY_MEMBERS.find((m) => m.id === selectedMember)?.packages || []).map((p) => {
          const member = FAMILY_MEMBERS.find((m) => m.id === selectedMember)!;
          return { ...p, owner: member.name, ownerColor: member.color };
        });

  const activePackages = displayedPackages.filter((p) => p.status !== 'picked_up');

  return (
    <div className="min-h-screen bg-surface dark:bg-[#1a1a2e] safe-bottom">
      <div className="gradient-primary px-6 pt-14 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">חבילות המשפחה 👨‍👩‍👧‍👦</h1>
            <p className="text-white/70 text-sm mt-1">מעקב משותף לכל המשפחה</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => showToast('בקרוב! 🚀')}
            className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <UserPlus className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-3 pb-4">
        {/* Family member cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide"
        >
          {FAMILY_MEMBERS.map((member, i) => (
            <motion.button
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMember(selectedMember === member.id ? 'all' : member.id)}
              className={cn(
                'flex-shrink-0 bg-white dark:bg-gray-800 rounded-2xl p-3 card-shadow flex flex-col items-center gap-1.5 min-w-[80px] transition-all',
                selectedMember === member.id && 'ring-2 ring-primary-400'
              )}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-black"
                style={{ backgroundColor: member.color }}
              >
                {member.initial}
              </div>
              <span className="text-xs font-bold text-secondary-700 dark:text-gray-100">{member.name}</span>
              <span className="text-[10px] text-gray-400">
                {member.packages.filter((p) => p.status !== 'picked_up').length} חבילות
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMember(tab.id)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors',
                selectedMember === tab.id
                  ? 'gradient-primary text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 card-shadow'
              )}
            >
              {tab.name}
            </motion.button>
          ))}
        </div>

        {/* Package list */}
        <AnimatePresence mode="popLayout">
          {activePackages.length > 0 ? (
            activePackages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 card-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black"
                      style={{ backgroundColor: getStoreColor(pkg.storeName) }}
                    >
                      {pkg.storeName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-secondary-700 dark:text-gray-100 text-sm">{pkg.storeName}</h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        <span
                          className="inline-block w-2 h-2 rounded-full mr-1"
                          style={{ backgroundColor: pkg.ownerColor }}
                        />
                        {pkg.owner} • {timeAgo(pkg.receivedDate)}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border',
                    STATUS_COLORS[pkg.status].bg, STATUS_COLORS[pkg.status].text, STATUS_COLORS[pkg.status].border
                  )}>
                    {STATUS_LABELS[pkg.status]}
                  </span>
                </div>
                {pkg.pickupLocation && (
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-primary-400" />
                    {pkg.pickupLocation}
                  </p>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-5xl mb-3">📭</div>
              <h3 className="text-base font-bold text-secondary-700 dark:text-gray-100">אין חבילות פעילות</h3>
              <p className="text-sm text-gray-400 mt-1">הכל נאסף! 🎉</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Toast />
      <BottomNav />
    </div>
  );
}
