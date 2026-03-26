export interface Notification {
  id: string;
  userId: string;
  type: 'package_update' | 'family_invite' | 'family_join' | 'reminder' | 'system' | 'delivery_offer' | 'delivery_update';
  title: string;
  body: string;
  read: boolean;
  data: Record<string, unknown>;
  createdAt: string;
}
