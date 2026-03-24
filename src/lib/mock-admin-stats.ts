import { AdminStats } from '@/types/admin';

export const mockAdminStats: AdminStats = {
  totalUsers: 10,
  totalPackages: 63,
  activeToday: 6,
  packagesByStatus: {
    new: 8,
    in_transit: 15,
    ready_for_pickup: 22,
    picked_up: 18,
  },
  recentRegistrations: [
    { id: 'u10', name: 'תמר רוזן', email: 'tamar.r@example.com', joinDate: '2026-03-22T10:00:00Z' },
    { id: 'u9', name: 'גל פרידמן', email: 'gal.f@example.com', joinDate: '2026-03-20T12:00:00Z' },
    { id: 'u8', name: 'מיכל דוד', email: 'michal.d@example.com', joinDate: '2026-03-15T16:00:00Z' },
    { id: 'u7', name: 'עומר שלום', email: 'omer.s@example.com', joinDate: '2026-03-10T07:00:00Z' },
    { id: 'u6', name: 'רונית ברק', email: 'ronit.b@example.com', joinDate: '2026-03-05T13:00:00Z' },
  ],
  dailyActivity: [
    { date: '2026-03-18', scans: 12, newPackages: 3 },
    { date: '2026-03-19', scans: 18, newPackages: 5 },
    { date: '2026-03-20', scans: 15, newPackages: 2 },
    { date: '2026-03-21', scans: 22, newPackages: 7 },
    { date: '2026-03-22', scans: 10, newPackages: 4 },
    { date: '2026-03-23', scans: 25, newPackages: 6 },
    { date: '2026-03-24', scans: 20, newPackages: 3 },
  ],
};
