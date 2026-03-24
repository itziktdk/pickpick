'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen gradient-primary flex flex-col items-center justify-center px-6 text-white">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="mb-8"
      >
        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl">
          <span className="text-5xl">📦</span>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-5xl font-black mb-3 tracking-tight"
      >
        PickPick
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-xl text-white/80 mb-12 text-center"
      >
        כל החבילות שלך. במקום אחד. ✨
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => router.push('/register')}
        className="w-full max-w-sm bg-white text-secondary-700 font-bold text-lg py-4 px-8 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:shadow-md transition-shadow"
      >
        התחל עכשיו 🚀
      </motion.button>

      <motion.button
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => router.push('/login')}
        className="w-full max-w-sm mt-3 bg-white/20 backdrop-blur-sm text-white font-bold text-lg py-4 px-8 rounded-2xl flex items-center justify-center gap-3 active:bg-white/30 transition-colors"
      >
        כבר יש לך חשבון? התחבר
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-sm text-white/50"
      >
        גרסה 0.2.0 • בטא
      </motion.p>
    </div>
  );
}
