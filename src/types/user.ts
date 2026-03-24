export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
  lastActive: string;
  packageCount: number;
  gmailConnected: boolean;
}
