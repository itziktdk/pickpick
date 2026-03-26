'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, MapPin, Copy, Check, LogOut, Crown, Plus, Link2, X } from 'lucide-react';
import { cn, timeAgo, getStoreColor } from '@/lib/utils';
import { STATUS_LABELS, STATUS_COLORS, Package } from '@/types/package';
import { BottomNav } from '@/components/bottom-nav';
import { Toast } from '@/components/ui/toast';
import { usePackageStore } from '@/lib/store';
import { ProgressBar } from '@/components/ui/progress-bar';
import { useAuth } from '@/lib/auth-context';

// Mock family data (will be replaced with API calls when DB is connected)
interface FamilyMemberData {
  id: string;
  name: string;
  initial: string;
  color: string;
  packages: Package[];
  lastActive: string;
}

interface FamilyGroup {
  id: string;
  name: string;
  ownerId: string;
  inviteCode: string;
  members: FamilyMemberData[];
}

const MEMBER_COLORS = ['#4ECDC4', '#FF6B6B', '#FFB347', '#9B59B6', '#3498DB', '#E74C3C', '#2ECC71', '#F39C12'];

const MOCK_FAMILY: FamilyGroup = {
  id: 'fam-1',
  name: 'משפחת צדקה',
  ownerId: 'f1',
  inviteCode: 'TZD4K2',
  members: [
    {
      id: 'f1',
      name: 'איציק',
      initial: 'א',
      color: '#4ECDC4',
      lastActive: '2026-03-24T10:00:00Z',
      packages: [
        {
          id: 'fam1', storeName: 'אמזון', trackingNumber: 'AMZ-FAM-001', status: 'in_transit',
          estimatedDate: '2026-03-28', receivedDate: '2026-03-20', source: 'email',
          statusHistory: [{ status: 'new', date: '2026-03-20T10:00:00Z' }, { status: 'in_transit', date: '2026-03-22T14:00:00Z' }],
        },
        {
          id: 'fam2', storeName: 'KSP', trackingNumber: 'KSP-FAM-002', status: 'ready_for_pickup',
          pickupLocation: 'סניף KSP - רמת גן', receivedDate: '2026-03-18', source: 'manual',
          statusHistory: [{ status: 'new', date: '2026-03-18T08:00:00Z' }, { status: 'ready_for_pickup', date: '2026-03-21T12:00:00Z' }],
        },
      ],
    },
    {
      id: 'f2', name: 'נטלי', initial: 'נ', color: '#FF6B6B', lastActive: '2026-03-23T18:00:00Z',
      packages: [
        {
          id: 'fam3', storeName: 'שיין', trackingNumber: 'SHEIN-FAM-003', status: 'in_transit',
          receivedDate: '2026-03-19', source: 'email',
          statusHistory: [{ status: 'new', date: '2026-03-19T09:00:00Z' }, { status: 'in_transit', date: '2026-03-21T11:00:00Z' }],
        },
        {
          id: 'fam4', storeName: 'ASOS', trackingNumber: 'ASOS-FAM-004', status: 'ready_for_pickup',
          pickupLocation: 'לוקר - דיזנגוף סנטר', receivedDate: '2026-03-15', source: 'email',
          statusHistory: [{ status: 'new', date: '2026-03-15T10:00:00Z' }, { status: 'ready_for_pickup', date: '2026-03-22T09:00:00Z' }],
        },
      ],
    },
    {
      id: 'f3', name: 'לירוי', initial: 'ל', color: '#FFB347', lastActive: '2026-03-22T14:00:00Z',
      packages: [
        {
          id: 'fam6', storeName: 'AliExpress', trackingNumber: 'ALI-FAM-006', status: 'new',
          receivedDate: '2026-03-23', source: 'email',
          statusHistory: [{ status: 'new', date: '2026-03-23T20:00:00Z' }],
        },
      ],
    },
    {
      id: 'f4', name: 'גאיה', initial: 'ג', color: '#9B59B6', lastActive: '2026-03-20T10:00:00Z',
      packages: [
        {
          id: 'fam7', storeName: 'דואר ישראל', trackingNumber: 'RR-FAM-007', status: 'ready_for_pickup',
          pickupLocation: 'סניף דואר 15 - פתח תקווה', receivedDate: '2026-03-12', source: 'sms',
          statusHistory: [{ status: 'new', date: '2026-03-12T07:00:00Z' }, { status: 'ready_for_pickup', date: '2026-03-17T08:00:00Z' }],
        },
      ],
    },
  ],
};

// --- Create Family Modal ---
function CreateFamilyModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string) => void }) {
  const [name, setName] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-md space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-secondary-700 dark:text-gray-100">צור משפחה חדשה 👨‍👩‍👧‍👦</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <input
          type="text"
          placeholder="שם המשפחה (למשל: משפחת כהן)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 text-right outline-none focus:ring-2 ring-primary-400 text-secondary-700 dark:text-gray-100"
          autoFocus
        />
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!name.trim()}
          onClick={() => onCreate(name.trim())}
          className="w-full gradient-primary text-white font-bold py-3 rounded-xl disabled:opacity-40"
        >
          צור משפחה
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// --- Join Family Modal ---
function JoinFamilyModal({ onClose, onJoin }: { onClose: () => void; onJoin: (code: string) => void }) {
  const [code, setCode] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-md space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-secondary-700 dark:text-gray-100">הצטרף למשפחה 🔗</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-400">הזן את קוד ההזמנה שקיבלת מבן משפחה</p>
        <input
          type="text"
          placeholder="קוד הזמנה"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={6}
          className="w-full bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-widest outline-none focus:ring-2 ring-primary-400 text-secondary-700 dark:text-gray-100"
          autoFocus
        />
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={code.length < 6}
          onClick={() => onJoin(code)}
          className="w-full gradient-primary text-white font-bold py-3 rounded-xl disabled:opacity-40"
        >
          הצטרף
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// --- Invite Code Card ---
function InviteCodeCard({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl p-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-primary-600 dark:text-primary-300 font-semibold mb-1">קוד הזמנה למשפחה</p>
          <p className="text-2xl font-mono font-black tracking-widest text-primary-700 dark:text-primary-200">{code}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleCopy}
          className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-800 flex items-center justify-center"
        >
          {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-primary-500" />}
        </motion.button>
      </div>
      <p className="text-[10px] text-primary-400 mt-2">שתף את הקוד עם בני המשפחה כדי שיוכלו להצטרף</p>
    </motion.div>
  );
}

export default function FamilyPage() {
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [family, setFamily] = useState<FamilyGroup | null>(MOCK_FAMILY);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const { showToast } = usePackageStore();

  const handleCreateFamily = (name: string) => {
    setFamily({
      id: crypto.randomUUID(),
      name,
      ownerId: 'current-user',
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      members: [],
    });
    setShowCreateModal(false);
    showToast('משפחה נוצרה! 🎉');
  };

  const handleJoinFamily = (code: string) => {
    // In production, this will call the API
    showToast('הצטרפת למשפחה! 🎉');
    setShowJoinModal(false);
  };

  // No family yet - show onboarding
  if (!family) {
    return (
      <div className="min-h-screen bg-surface dark:bg-[#1a1a2e] safe-bottom">
        <div className="gradient-primary px-6 pt-14 pb-8 rounded-b-3xl">
          <h1 className="text-2xl font-black text-white">חבילות המשפחה 👨‍👩‍👧‍👦</h1>
          <p className="text-white/70 text-sm mt-1">מעקב משותף לכל המשפחה</p>
        </div>

        <div className="px-4 pt-8 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
            <h2 className="text-xl font-black text-secondary-700 dark:text-gray-100 mb-2">
              עוד לא חבר במשפחה
            </h2>
            <p className="text-sm text-gray-400 mb-6">צור קבוצה משפחתית או הצטרף לקבוצה קיימת</p>
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowCreateModal(true)}
            className="w-full gradient-primary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-lg"
          >
            <Plus className="w-5 h-5" />
            צור משפחה חדשה
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowJoinModal(true)}
            className="w-full bg-white dark:bg-gray-800 text-primary-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-lg card-shadow"
          >
            <Link2 className="w-5 h-5" />
            הצטרף עם קוד הזמנה
          </motion.button>
        </div>

        <AnimatePresence>
          {showCreateModal && <CreateFamilyModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateFamily} />}
          {showJoinModal && <JoinFamilyModal onClose={() => setShowJoinModal(false)} onJoin={handleJoinFamily} />}
        </AnimatePresence>

        <Toast />
        <BottomNav />
      </div>
    );
  }

  const tabs = [{ id: 'all', name: 'כולם' }, ...family.members.map((m) => ({ id: m.id, name: m.name }))];

  const displayedPackages =
    selectedMember === 'all'
      ? family.members.flatMap((m) => m.packages.map((p) => ({ ...p, owner: m.name, ownerColor: m.color, ownerInitial: m.initial })))
      : (() => {
          const member = family.members.find((m) => m.id === selectedMember);
          return member ? member.packages.map((p) => ({ ...p, owner: member.name, ownerColor: member.color, ownerInitial: member.initial })) : [];
        })();

  const activePackages = displayedPackages.filter((p) => p.status !== 'picked_up');
  const totalActive = family.members.reduce((sum, m) => sum + m.packages.filter((p) => p.status !== 'picked_up').length, 0);
  const totalReady = family.members.reduce((sum, m) => sum + m.packages.filter((p) => p.status === 'ready_for_pickup').length, 0);

  return (
    <div className="min-h-screen bg-surface dark:bg-[#1a1a2e] safe-bottom">
      {/* Header */}
      <div className="gradient-primary px-6 pt-14 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">{family.name} 👨‍👩‍👧‍👦</h1>
            <p className="text-white/70 text-sm mt-1">
              {totalActive} חבילות פעילות
              {totalReady > 0 && ` • ${totalReady} לאיסוף`}
            </p>
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

      <div className="px-4 -mt-4 space-y-3 pb-28">
        {/* Invite code */}
        <InviteCodeCard code={family.inviteCode} />

        {/* Family member avatars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide"
        >
          {family.members.map((member, i) => (
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
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-black"
                  style={{ backgroundColor: member.color }}
                >
                  {member.initial}
                </div>
                {member.id === family.ownerId && (
                  <Crown className="w-4 h-4 text-amber-400 absolute -top-1 -right-1" />
                )}
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="text-5xl mb-3">📭</div>
              <h3 className="text-base font-bold text-secondary-700 dark:text-gray-100">אין חבילות פעילות</h3>
              <p className="text-sm text-gray-400 mt-1">הכל נאסף! 🎉</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showCreateModal && <CreateFamilyModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateFamily} />}
        {showJoinModal && <JoinFamilyModal onClose={() => setShowJoinModal(false)} onJoin={handleJoinFamily} />}
      </AnimatePresence>

      <Toast />
      <BottomNav />
    </div>
  );
}
