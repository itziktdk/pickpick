'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Navigation } from 'lucide-react';

interface NavigationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

export function NavigationSheet({ isOpen, onClose, address }: NavigationSheetProps) {
  const encoded = encodeURIComponent(address);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
  const wazeUrl = `https://waze.com/ul?q=${encoded}&navigate=yes`;

  const handleOpen = (url: string) => {
    window.open(url, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="fixed bottom-0 inset-x-0 z-[101] bg-white dark:bg-gray-800 rounded-t-3xl p-6 pb-10 shadow-2xl"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 2.5rem)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-100">נווט לנקודת האיסוף</h3>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </motion.button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {address}
            </p>

            <div className="space-y-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleOpen(googleMapsUrl)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 active:bg-blue-100 dark:active:bg-blue-900/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-2xl shadow-md">
                  🗺️
                </div>
                <div className="flex-1 text-right">
                  <h4 className="font-bold text-blue-700 dark:text-blue-300">Google Maps</h4>
                  <p className="text-xs text-blue-500 dark:text-blue-400 mt-0.5">פתח במפות גוגל</p>
                </div>
                <Navigation className="w-5 h-5 text-blue-400" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleOpen(wazeUrl)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 active:bg-cyan-100 dark:active:bg-cyan-900/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center text-2xl shadow-md">
                  🚗
                </div>
                <div className="flex-1 text-right">
                  <h4 className="font-bold text-cyan-700 dark:text-cyan-300">Waze</h4>
                  <p className="text-xs text-cyan-500 dark:text-cyan-400 mt-0.5">נווט עם Waze</p>
                </div>
                <Navigation className="w-5 h-5 text-cyan-400" />
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
