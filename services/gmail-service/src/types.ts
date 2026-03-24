export interface GmailTokens {
  access_token: string;
  refresh_token?: string;
  expiry_date?: number;
}

export interface ParsedPackage {
  storeName: string;
  trackingNumber?: string;
  status: 'new' | 'in_transit' | 'ready_for_pickup' | 'picked_up';
  pickupLocation?: string;
  estimatedDate?: string;
  receivedDate: string;
  source: 'email';
  rawMessage: string;
  emailSubject: string;
  emailFrom: string;
}

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  tokens: GmailTokens;
  lastScan?: string;
  createdAt: string;
}

export interface ScanResult {
  newPackages: ParsedPackage[];
  totalScanned: number;
  scanDate: string;
}
