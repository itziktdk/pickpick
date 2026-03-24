'use client';

import { usePackageStore } from '@/lib/store';

const CONFETTI_COLORS = ['#FF6B6B', '#4ECDC4', '#FFB347', '#7BC67E', '#FF8E8E', '#667eea'];

export function Confetti() {
  const show = usePackageStore((s) => s.showConfetti);
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[200]">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            width: `${8 + Math.random() * 8}px`,
            height: `${8 + Math.random() * 8}px`,
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${Math.random() * 1}s`,
            animationDuration: `${2 + Math.random() * 1.5}s`,
          }}
        />
      ))}
    </div>
  );
}
