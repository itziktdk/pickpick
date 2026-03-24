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
}

export const STATUS_LABELS: Record<PackageStatus, string> = {
  new: 'חדש',
  in_transit: 'בדרך',
  ready_for_pickup: 'ממתין לאיסוף',
  picked_up: 'נאסף',
};

export const STATUS_COLORS: Record<PackageStatus, { bg: string; text: string; border: string }> = {
  new: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  in_transit: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  ready_for_pickup: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  picked_up: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' },
};
