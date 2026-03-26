'use client';

import { useState, useEffect } from 'react';

interface DeliveryNotificationProps {
  friendName: string;
  friendAvatar?: string;
  location: string;
  cost: number;
  onAccept: () => void;
  onDecline: () => void;
  timeoutSeconds?: number;
}

export function DeliveryNotification({
  friendName,
  location,
  cost,
  onAccept,
  onDecline,
  timeoutSeconds = 300,
}: DeliveryNotificationProps) {
  const [visible, setVisible] = useState(false);
  const [remaining, setRemaining] = useState(timeoutSeconds);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    if (remaining <= 0) { onDecline(); return; }
    const t = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(t);
  }, [remaining, onDecline]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = (remaining / timeoutSeconds) * 100;

  const dismiss = (action: () => void) => {
    setVisible(false);
    setTimeout(action, 300);
  };

  return (
    <div dir="rtl" className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        onClick={() => dismiss(onDecline)}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Sheet */}
      <div
        className={`relative w-full max-w-md bg-gray-800 rounded-t-3xl p-6 pb-8 transition-transform duration-300 ease-out ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Timer bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700 rounded-t-3xl overflow-hidden">
          <div
            className="h-full bg-[#FF6B6B] transition-all duration-1000 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Handle */}
        <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-5" />

        {/* Content */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl">
            👤
          </div>
          <div>
            <p className="font-bold text-white text-lg">{friendName}</p>
            <p className="text-gray-400 text-sm">📍 {location}</p>
          </div>
        </div>

        <p className="text-center text-white text-lg mb-1">רוצה שיביא לך?</p>
        <p className="text-center text-[#FF6B6B] font-bold text-2xl mb-1">{cost}₪</p>
        <p className="text-center text-gray-500 text-sm mb-6">
          ⏱ {mins}:{secs.toString().padStart(2, '0')}
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => dismiss(onDecline)}
            className="flex-1 py-3.5 bg-gray-700 text-gray-300 font-semibold rounded-xl active:scale-[0.97] transition-all"
          >
            לא תודה
          </button>
          <button
            onClick={() => dismiss(onAccept)}
            className="flex-1 py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl active:scale-[0.97] transition-all shadow-lg shadow-green-600/25"
          >
            כן, שיביא! ✅
          </button>
        </div>
      </div>
    </div>
  );
}
