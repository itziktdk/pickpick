export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: string;
  joinDate: string;
  lastActive: string;
  packageCount: number;
  gmailConnected: boolean;
  createdAt: string;
}
