export interface PackageModel {
  id: string;
  trackingNumber?: string;
  carrier?: string;
  status: string;
  description?: string;
  storeName: string;
  userId: string;
  familyId?: string;
  location?: string;
  pickupLocation?: string;
  pickupLocationDetails?: {
    address: string;
    hours?: string;
    name?: string;
  };
  timeline: TimelineEntry[];
  statusHistory: StatusEntry[];
  estimatedDelivery?: string;
  estimatedDate?: string;
  receivedDate: string;
  source: string;
  rawMessage?: string;
  confirmationUrl?: string;
  pickupDeadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEntry {
  timestamp: string;
  status: string;
  location?: string;
  description?: string;
}

export interface StatusEntry {
  status: string;
  date: string;
  note?: string;
}
