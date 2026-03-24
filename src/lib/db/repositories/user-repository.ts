import { JsonRepository } from '../json-db';

export interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  joinDate: string;
  lastActive: string;
  gmailConnected: boolean;
}

export const userRepository = new JsonRepository<DbUser>('users');
