'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const screens = [
  {
    emoji: '📦✨',
    title: 'כל החבילות שלך, במקום אחד',
    desc: 'מעקב חכם אחרי כל ההזמנות שלך — ממיילים, SMS, או ידנית.',
    floats: ['📦', '🎁', '📬', '✨', '🛒'],
  },
  {
    emoji: '📱🔍',
    title: 'אנחנו סורקים, אתה אוסף',
    desc: 'חיבור ל-Gmail וסריקת SMS אוטומטית. אנחנו מוצאים את החבילות בשבילך.',
    floats: ['💌', '📧', '📲', '🔔', '📨'],
  },
  {
    emoji: '🔔💪',
    title: 'לא נשכח אף חבילה',
    desc: 'תזכורות חכמות, התראות על חבילות שעומדות לפוג, ומעקב משפחתי.',
    floats: ['⏰', '🎯', '👨‍👩‍👧‍👦', '🗓️', '✅'],
  },
];

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  const next = () => {
    if (current < screens.length - 1) {
      setCurrent(current + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const screen = screens[current];

  return (
    <div className="min-h-screen bg-surface dark:bg-[#1a1a2e] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="text-center w-full"
          >
            {/* Floating emojis */}
            <div className="relative h-48 flex items-center justify-center mb-8">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="text-7xl"
              >
                {screen.emoji}
              </motion.span>
              {screen.floats.map((emoji, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0.5],
                    scale: [0, 1.2, 1, 0.8],
                    y: [0, -20, -10, 0],
                  }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  className="absolute text-2xl"
                  style={{
                    top: `${20 + Math.sin(i * 1.5) * 30}%`,
                    left: `${15 + (i * 18)}%`,
                  }}
                >
                  {emoji}
                </motion.span>
              ))}
            </div>

            <h2 className="text-2xl font-black text-secondary-700 dark:text-gray-100 mb-3">{screen.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed max-w-sm mx-auto">{screen.desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="px-8 pb-12 space-y-6">
        {/* Dots */}
        <div className="flex justify-center gap-2">
          {screens.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === current ? 24 : 8,
                backgroundColor: i === current ? '#FF6B6B' : '#e5e7eb',
              }}
              className="h-2 rounded-full"
            />
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={next}
          className="w-full py-4 rounded-2xl gradient-primary text-white font-bold text-lg shadow-lg"
        >
          {current === screens.length - 1 ? 'בוא נתחיל! 🚀' : 'המשך'}
        </motion.button>

        {current < screens.length - 1 && (
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full text-center text-gray-400 text-sm font-medium"
          >
            דלג
          </button>
        )}
      </div>
    </div>
  );
}
