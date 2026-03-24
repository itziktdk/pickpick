export type PackageStatus = 'new' | 'in_transit' | 'ready_for_pickup' | 'picked_up';
export type PackageSource = 'sms' | 'email' | 'manual';

export interface StatusChange {
  status: PackageStatus;
  date: string;
  note?: string;
}

export interface Package {
  id: string;
  storeName: string;
  trackingNumber?: string;
  status: PackageStatus;
  pickupLocation?: string;
  estimatedDate?: string;
  receivedDate: string;
  statusHistory: StatusChange[];
  source: PackageSource;
  rawMessage?: string;
  confirmationUrl?: string;
  pickupDeadline?: string;
  pickupLocationDetails?: {
    address: string;
    hours?: string;
    name?: string;
  };
}

export const STATUS_LABELS: Record<PackageStatus, string> = {
  new: 'חדש',
  in_transit: 'בדרך',
  ready_for_pickup: 'ממתין לאיסוף',
  picked_up: 'נאסף',
};

export const STATUS_COLORS: Record<PackageStatus, { bg: string; text: string; border: string }> = {
  new: { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
  in_transit: { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
  ready_for_pickup: { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
  picked_up: { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-500 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-700' },
};
