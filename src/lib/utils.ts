import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'עכשיו';
  if (diffMins < 60) return `לפני ${diffMins} דקות`;
  if (diffHours < 24) return `לפני ${diffHours} שעות`;
  if (diffDays === 1) return 'אתמול';
  if (diffDays < 7) return `לפני ${diffDays} ימים`;
  if (diffDays < 30) return `לפני ${Math.floor(diffDays / 7)} שבועות`;
  return formatDate(dateStr);
}

export function daysBetween(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  return Math.floor(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

export function getStoreColor(storeName: string): string {
  const colors: Record<string, string> = {
    'אמזון': '#FF9900',
    'שיין': '#000000',
    'AliExpress': '#E43225',
    'דואר ישראל': '#D32F2F',
    'FedEx': '#4D148C',
    'iHerb': '#6AAF35',
    'ASOS': '#2D2D2D',
    'KSP': '#0066CC',
  };
  return colors[storeName] || '#FF6B6B';
}

export function getDeliveryProgress(status: string): number {
  switch (status) {
    case 'new': return 25;
    case 'in_transit': return 50;
    case 'ready_for_pickup': return 75;
    case 'picked_up': return 100;
    default: return 0;
  }
}
