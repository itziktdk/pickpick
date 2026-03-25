import { JsonRepository } from '../json-db';
import { PasskeyCredential } from '@/types/user';

export interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  phone?: string;
  address?: string;
  joinDate: string;
  lastActive: string;
  gmailConnected: boolean;
  passkeys?: PasskeyCredential[];
  currentChallenge?: string;
}

export const userRepository = new JsonRepository<DbUser>('users');
