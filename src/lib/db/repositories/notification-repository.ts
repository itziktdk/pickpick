import { JsonRepository } from '../json-db';

export interface DbNotification {
  id: string;
  userId: string;
  type: 'arrived' | 'reminder' | 'expiring';
  title: string;
  body: string;
  packageId: string;
  date: string;
  read: boolean;
}

export const notificationRepository = new JsonRepository<DbNotification>('notifications');
