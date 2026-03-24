'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  return (
    <div className={cn('w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2', className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={cn(
          'h-2 rounded-full',
          progress === 100 ? 'bg-success' : progress >= 75 ? 'bg-accent-400' : 'gradient-primary'
        )}
      />
    </div>
  );
}
