export interface AdminStats {
  totalUsers: number;
  totalPackages: number;
  activeToday: number;
  packagesByStatus: {
    new: number;
    in_transit: number;
    ready_for_pickup: number;
    picked_up: number;
  };
  recentRegistrations: {
    id: string;
    name: string;
    email: string;
    joinDate: string;
  }[];
  dailyActivity: {
    date: string;
    scans: number;
    newPackages: number;
  }[];
}
