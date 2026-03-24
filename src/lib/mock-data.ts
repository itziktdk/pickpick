import { Package } from '@/types/package';

export const mockPackages: Package[] = [
  {
    id: '1',
    storeName: 'אמזון',
    trackingNumber: 'AMZ-IL-78234921',
    status: 'in_transit',
    pickupLocation: 'נקודת חלוקה - רמת גן, רח׳ ביאליק 32',
    estimatedDate: '2026-03-26',
    receivedDate: '2026-03-21',
    source: 'email',
    statusHistory: [
      { status: 'new', date: '2026-03-21T10:00:00Z', note: 'הזמנה התקבלה' },
      { status: 'in_transit', date: '2026-03-23T14:30:00Z', note: 'החבילה יצאה מהמחסן' },
    ],
  },
  {
    id: '9',
    storeName: 'ליאור פרנקל',
    trackingNumber: '65276619',
    status: 'ready_for_pickup',
    pickupLocation: 'מולא מנעולים ומפתחות - האורגים 6, חולון',
    receivedDate: '2026-03-20',
    source: 'email',
    confirmationUrl: 'https://www.cargo-ship.co.il/cargobox-client/approve-delivery/Z8S2SP5XVPWI',
    pickupDeadline: '2 ימי עסקים',
    pickupLocationDetails: {
      address: 'האורגים 6, חולון',
      hours: 'א-ה 9:00-17:00, ו 9:00-12:30',
      name: 'מולא מנעולים ומפתחות',
    },
    statusHistory: [
      { status: 'new', date: '2026-03-20T10:00:00Z', note: 'הזמנה התקבלה' },
      { status: 'in_transit', date: '2026-03-21T14:00:00Z' },
      { status: 'ready_for_pickup', date: '2026-03-23T08:00:00Z', note: 'ממתין לאישור מסירה' },
    ],
  },
  {
    id: '10',
    storeName: 'זארה',
    trackingNumber: '98712345',
    status: 'ready_for_pickup',
    pickupLocation: 'CargoBox - קניון עזריאלי, תל אביב',
    receivedDate: '2026-03-22',
    source: 'sms',
    confirmationUrl: 'https://www.cargo-ship.co.il/cargobox-client/approve-delivery/ABC123XYZ',
    pickupDeadline: '3 ימי עסקים',
    pickupLocationDetails: {
      address: 'דרך מנחם בגין 132, תל אביב',
      hours: 'א-ה 8:00-22:00, ו 8:00-14:00, ש 20:00-22:00',
      name: 'CargoBox - עזריאלי',
    },
    statusHistory: [
      { status: 'new', date: '2026-03-22T09:00:00Z' },
      { status: 'in_transit', date: '2026-03-23T11:00:00Z' },
      { status: 'ready_for_pickup', date: '2026-03-24T07:00:00Z', note: 'ממתין לאישור מסירה' },
    ],
  },
  {
    id: '2',
    storeName: 'שיין',
    trackingNumber: 'SHEIN-9182736455',
    status: 'ready_for_pickup',
    pickupLocation: 'לוקר - קניון איילון, רמת גן',
    receivedDate: '2026-03-15',
    source: 'sms',
    rawMessage: 'שיין: החבילה שלך מוכנה לאיסוף בלוקר קניון איילון',
    statusHistory: [
      { status: 'new', date: '2026-03-15T08:00:00Z' },
      { status: 'in_transit', date: '2026-03-18T12:00:00Z' },
      { status: 'ready_for_pickup', date: '2026-03-23T09:15:00Z', note: 'ממתין בלוקר - קוד: 4821' },
    ],
  },
  {
    id: '3',
    storeName: 'דואר ישראל',
    trackingNumber: 'RR123456789IL',
    status: 'ready_for_pickup',
    pickupLocation: 'סניף דואר 61 - תל אביב, רח׳ דיזנגוף 99',
    receivedDate: '2026-03-10',
    source: 'sms',
    statusHistory: [
      { status: 'new', date: '2026-03-10T07:30:00Z' },
      { status: 'in_transit', date: '2026-03-12T16:00:00Z' },
      { status: 'ready_for_pickup', date: '2026-03-15T08:00:00Z', note: 'ממתין בסניף דואר' },
    ],
  },
  {
    id: '4',
    storeName: 'AliExpress',
    trackingNumber: 'LP00123456789CN',
    status: 'new',
    receivedDate: '2026-03-23',
    source: 'email',
    statusHistory: [
      { status: 'new', date: '2026-03-23T20:00:00Z', note: 'ההזמנה נשלחה מסין' },
    ],
  },
  {
    id: '5',
    storeName: 'iHerb',
    trackingNumber: 'IHR-8827364',
    status: 'picked_up',
    pickupLocation: 'נקודת חלוקה - גבעתיים',
    receivedDate: '2026-03-10',
    source: 'manual',
    statusHistory: [
      { status: 'new', date: '2026-03-10T12:00:00Z' },
      { status: 'in_transit', date: '2026-03-14T09:00:00Z' },
      { status: 'ready_for_pickup', date: '2026-03-18T11:30:00Z' },
      { status: 'picked_up', date: '2026-03-19T17:45:00Z', note: 'נאסף בהצלחה' },
    ],
  },
  {
    id: '6',
    storeName: 'FedEx',
    trackingNumber: 'FDX-794826135',
    status: 'in_transit',
    estimatedDate: '2026-03-27',
    receivedDate: '2026-03-22',
    source: 'email',
    statusHistory: [
      { status: 'new', date: '2026-03-22T06:00:00Z', note: 'חבילה נאספה' },
      { status: 'in_transit', date: '2026-03-23T10:00:00Z', note: 'במכס - נתב״ג' },
    ],
  },
  {
    id: '7',
    storeName: 'ASOS',
    trackingNumber: 'ASOS-UK-4429182',
    status: 'picked_up',
    pickupLocation: 'נקודת חלוקה - תל אביב',
    receivedDate: '2026-02-28',
    source: 'email',
    statusHistory: [
      { status: 'new', date: '2026-02-28T10:00:00Z' },
      { status: 'in_transit', date: '2026-03-04T12:00:00Z' },
      { status: 'ready_for_pickup', date: '2026-03-08T09:00:00Z' },
      { status: 'picked_up', date: '2026-03-09T14:00:00Z' },
    ],
  },
  {
    id: '8',
    storeName: 'KSP',
    trackingNumber: 'KSP-882716',
    status: 'picked_up',
    pickupLocation: 'סניף KSP - רמת גן',
    receivedDate: '2026-03-01',
    source: 'manual',
    statusHistory: [
      { status: 'new', date: '2026-03-01T10:00:00Z' },
      { status: 'ready_for_pickup', date: '2026-03-02T14:00:00Z' },
      { status: 'picked_up', date: '2026-03-03T11:00:00Z' },
    ],
  },
];

export interface Notification {
  id: string;
  type: 'arrived' | 'reminder' | 'expiring';
  title: string;
  body: string;
  packageId: string;
  date: string;
  read: boolean;
}

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'arrived',
    title: 'חבילה הגיעה! 📦',
    body: 'החבילה מ-שיין מוכנה לאיסוף בלוקר קניון איילון',
    packageId: '2',
    date: '2026-03-23T09:15:00Z',
    read: false,
  },
  {
    id: 'n2',
    type: 'expiring',
    title: 'חבילה עומדת לפוג! ⚠️',
    body: 'החבילה מדואר ישראל בסניף דואר 61 מחכה כבר 14 יום',
    packageId: '3',
    date: '2026-03-24T08:00:00Z',
    read: false,
  },
  {
    id: 'n3',
    type: 'reminder',
    title: 'תזכורת לאיסוף 🔔',
    body: 'לא לשכוח לאסוף את החבילה מ-שיין!',
    packageId: '2',
    date: '2026-03-24T10:00:00Z',
    read: true,
  },
  {
    id: 'n4',
    type: 'arrived',
    title: 'חבילה הגיעה! 📦',
    body: 'החבילה מדואר ישראל ממתינה בסניף דואר 61',
    packageId: '3',
    date: '2026-03-15T08:00:00Z',
    read: true,
  },
];

export interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  packageCount: number;
}

export const mockFamilyMembers: FamilyMember[] = [
  { id: 'f1', name: 'יצחק', packageCount: 4 },
  { id: 'f2', name: 'נטלי', packageCount: 2 },
  { id: 'f3', name: 'עידן', packageCount: 1 },
];

export interface UserStats {
  totalThisMonth: number;
  totalThisYear: number;
  favoriteStores: { name: string; count: number; color: string }[];
  averageDeliveryDays: number;
  bestMonth: { month: string; count: number };
  uniqueStoresThisYear: number;
}

export const mockUserStats: UserStats = {
  totalThisMonth: 6,
  totalThisYear: 28,
  favoriteStores: [
    { name: 'אמזון', color: '#FF9900', count: 9 },
    { name: 'שיין', color: '#000000', count: 6 },
    { name: 'AliExpress', color: '#E43225', count: 5 },
    { name: 'iHerb', color: '#6AAF35', count: 4 },
    { name: 'דואר ישראל', color: '#D32F2F', count: 4 },
  ],
  averageDeliveryDays: 8,
  bestMonth: { month: 'ינואר 2026', count: 11 },
  uniqueStoresThisYear: 8,
};
