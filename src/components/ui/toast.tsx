'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePackageStore } from '@/lib/store';

export function Toast() {
  const message = usePackageStore((s) => s.toastMessage);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-secondary-700 dark:bg-gray-700 text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-semibold"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
