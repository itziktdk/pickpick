'use client';

import { useState } from 'react';

interface DeliveryCompleteProps {
  earnings: number;
  onBack: () => void;
  onRate: (rating: number) => void;
}

export function DeliveryComplete({ earnings, onBack, onRate }: DeliveryCompleteProps) {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleRate = (r: number) => {
    setRating(r);
    setSubmitted(true);
    onRate(r);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* CSS Confetti */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confetti-fall linear forwards;
        }
      `}</style>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="confetti rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF8B8B'][i % 5],
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 2}s`,
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 text-center">
        <p className="text-6xl mb-4 animate-bounce">🎉</p>
        <h1 className="text-3xl font-bold text-white mb-2">המשלוח הגיע!</h1>
        <p className="text-[#FF6B6B] text-4xl font-black mb-8">+{earnings}₪</p>

        {/* Star rating */}
        <p className="text-gray-400 mb-3 text-sm">{submitted ? 'תודה על הדירוג!' : 'איך היה השירות?'}</p>
        <div className="flex justify-center gap-2 mb-10">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => !submitted && handleRate(star)}
              className={`text-3xl transition-transform ${
                star <= rating ? 'scale-110' : 'grayscale opacity-40'
              } ${!submitted ? 'hover:scale-125 active:scale-95' : ''}`}
            >
              ⭐
            </button>
          ))}
        </div>

        <button
          onClick={onBack}
          className="px-8 py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all active:scale-[0.97]"
        >
          חזרה לדשבורד 🏠
        </button>
      </div>
    </div>
  );
}
