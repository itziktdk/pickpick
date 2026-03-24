import { JsonRepository } from '../json-db';
import { Package } from '@/types/package';

export interface DbPackage extends Package {
  userId: string;
}

export const packageRepository = new JsonRepository<DbPackage>('packages');
