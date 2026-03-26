'use client';

import { useState } from 'react';

interface FriendPackage {
  id: string;
  friendName: string;
  packageDesc: string;
  earning: number;
}

const mockPackages: FriendPackage[] = [
  { id: '1', friendName: 'דני', packageDesc: 'חבילה מאמזון', earning: 7 },
  { id: '2', friendName: 'מיכל', packageDesc: 'חבילה מ-AliExpress', earning: 7 },
  { id: '3', friendName: 'יוסי', packageDesc: '2 חבילות מ-iHerb', earning: 10 },
];

interface CreateOfferSheetProps {
  onClose: () => void;
}

export function CreateOfferSheet({ onClose }: CreateOfferSheetProps) {
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const totalEarnings = mockPackages.filter((p) => selected.has(p.id)).reduce((sum, p) => sum + p.earning, 0);

  const dismiss = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div dir="rtl" className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        onClick={dismiss}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      />

      <div
        className={`relative w-full max-w-md bg-gray-800 rounded-t-3xl p-6 pb-8 transition-transform duration-300 ease-out ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-5" />

        <h2 className="text-xl font-bold text-white mb-1">הצע שליחות 🚀</h2>
        <p className="text-gray-400 text-sm mb-5">בחר חבילות של חברים שאתה יכול להביא</p>

        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
          {mockPackages.map((pkg) => {
            const checked = selected.has(pkg.id);
            return (
              <button
                key={pkg.id}
                onClick={() => toggle(pkg.id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-right ${
                  checked
                    ? 'border-[#FF6B6B] bg-[#FF6B6B]/10'
                    : 'border-gray-700 bg-gray-900/50'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                    checked ? 'border-[#FF6B6B] bg-[#FF6B6B]' : 'border-gray-600'
                  }`}
                >
                  {checked && <span className="text-white text-xs">✓</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{pkg.friendName}</p>
                  <p className="text-gray-400 text-xs">{pkg.packageDesc}</p>
                </div>
                <span className="text-[#FF6B6B] font-bold text-sm">+{pkg.earning}₪</span>
              </button>
            );
          })}
        </div>

        {/* Earnings summary */}
        <div className="flex items-center justify-between bg-gray-900/50 rounded-xl p-4 mb-5">
          <span className="text-gray-400">רווח משוער</span>
          <span className="text-[#FF6B6B] font-black text-2xl">{totalEarnings}₪</span>
        </div>

        <button
          onClick={dismiss}
          disabled={selected.size === 0}
          className={`w-full py-4 font-bold text-lg rounded-2xl transition-all active:scale-[0.98] ${
            selected.size > 0
              ? 'bg-[#FF6B6B] hover:bg-[#ff5252] text-white shadow-lg shadow-[#FF6B6B]/30'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          הצע שליחות ({selected.size}) 🚀
        </button>
      </div>
    </div>
  );
}
