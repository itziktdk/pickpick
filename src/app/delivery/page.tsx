'use client';

import { useState } from 'react';
import { DeliveryOfferCard } from '@/components/delivery/DeliveryOfferCard';
import { CreateOfferSheet } from '@/components/delivery/CreateOfferSheet';

const mockMyOffers = [
  { id: '1', location: 'סניף דואר רמת גן', packages: 3, timeLeft: 45, status: 'active' as const, earnings: 21 },
  { id: '2', location: 'נקודת חלוקה הרצליה', packages: 1, timeLeft: 12, status: 'collected' as const, earnings: 7 },
];

const mockForMe = [
  { id: '3', location: 'סניף דואר תל אביב', packages: 1, timeLeft: 30, status: 'on_way' as const, earnings: 10, deliverer: 'דני' },
];

const mockHistory = [
  { id: '4', location: 'נקודת חלוקה פתח תקווה', packages: 2, timeLeft: 0, status: 'delivered' as const, earnings: 14 },
];

export default function DeliveryPage() {
  const [tab, setTab] = useState<'offering' | 'receiving'>('offering');
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-900 text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-4 pt-6 pb-3">
        <h1 className="text-2xl font-bold mb-4">שליחויות בין חברים 🤝</h1>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['offering', 'receiving'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t
                  ? 'bg-[#FF6B6B] text-white shadow-lg shadow-[#FF6B6B]/25'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {t === 'offering' ? 'אני מביא 🚴' : 'מביאים לי 📬'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Active section */}
        {tab === 'offering' ? (
          mockMyOffers.length > 0 ? (
            <div className="space-y-3">
              {mockMyOffers.map((offer) => (
                <DeliveryOfferCard key={offer.id} {...offer} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">📦</p>
              <p>אין שליחויות פעילות</p>
              <p className="text-sm mt-1">ליד סניף? הצע שליחות לחברים!</p>
            </div>
          )
        ) : (
          mockForMe.length > 0 ? (
            <div className="space-y-3">
              {mockForMe.map((offer) => (
                <DeliveryOfferCard key={offer.id} {...offer} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">☕</p>
              <p>אף אחד לא מביא לך כרגע</p>
              <p className="text-sm mt-1">כשחבר יהיה ליד סניף, תקבל התראה</p>
            </div>
          )
        )}

        {/* History */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-400 mb-3">היסטוריה</h2>
          {mockHistory.length > 0 ? (
            <div className="space-y-3">
              {mockHistory.map((offer) => (
                <DeliveryOfferCard key={offer.id} {...offer} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm text-center py-4">אין היסטוריה עדיין</p>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-6 left-4 right-4 z-20">
        <button
          onClick={() => setShowCreate(true)}
          className="w-full py-4 bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-bold text-lg rounded-2xl shadow-xl shadow-[#FF6B6B]/30 active:scale-[0.98] transition-all"
        >
          אני ליד סניף! 📦
        </button>
      </div>

      {showCreate && <CreateOfferSheet onClose={() => setShowCreate(false)} />}
    </div>
  );
}
