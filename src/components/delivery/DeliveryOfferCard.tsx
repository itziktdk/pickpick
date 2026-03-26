'use client';

import { useState, useEffect } from 'react';

interface DeliveryOfferCardProps {
  id: string;
  location: string;
  packages: number;
  timeLeft: number; // minutes
  status: 'active' | 'collected' | 'on_way' | 'delivered';
  earnings: number;
  deliverer?: string;
}

const statusConfig = {
  active: { label: 'פעיל', color: 'bg-green-500/20 text-green-400' },
  collected: { label: 'נאסף', color: 'bg-yellow-500/20 text-yellow-400' },
  on_way: { label: 'בדרך', color: 'bg-blue-500/20 text-blue-400' },
  delivered: { label: 'נמסר', color: 'bg-gray-500/20 text-gray-400' },
};

export function DeliveryOfferCard({ location, packages, timeLeft, status, earnings, deliverer }: DeliveryOfferCardProps) {
  const [remaining, setRemaining] = useState(timeLeft * 60);

  useEffect(() => {
    if (status === 'delivered' || remaining <= 0) return;
    const interval = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(interval);
  }, [status, remaining]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const cfg = statusConfig[status];

  return (
    <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700/50 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{location}</h3>
          {deliverer && <p className="text-sm text-gray-400 mt-0.5">🚴 {deliverer}</p>}
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 mr-2 ${cfg.color}`}>
          {cfg.label}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>📦 {packages} חבילות</span>
          {status !== 'delivered' && (
            <span className={remaining < 300 ? 'text-[#FF6B6B]' : ''}>
              ⏱ {mins}:{secs.toString().padStart(2, '0')}
            </span>
          )}
        </div>
        <span className="text-[#FF6B6B] font-bold text-lg">+{earnings}₪</span>
      </div>
    </div>
  );
}
