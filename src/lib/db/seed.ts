import { userRepository, DbUser } from './repositories/user-repository';
import { packageRepository, DbPackage } from './repositories/package-repository';
import { notificationRepository, DbNotification } from './repositories/notification-repository';
import { mockPackages, mockNotifications } from '@/lib/mock-data';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'pickpick-salt').digest('hex');
}

export async function seed() {
  // Check if already seeded
  const existingUsers = await userRepository.findAll();
  if (existingUsers.length > 0) {
    console.log('Database already seeded, skipping...');
    return;
  }

  console.log('Seeding database...');

  // Create demo user
  const demoUser: DbUser = {
    id: 'demo-user-1',
    name: 'יצחק',
    email: 'demo@pickpick.app',
    passwordHash: hashPassword('demo123'),
    joinDate: '2026-01-01T00:00:00Z',
    lastActive: new Date().toISOString(),
    gmailConnected: false,
  };
  await userRepository.create(demoUser);

  // Seed packages
  for (const pkg of mockPackages) {
    const dbPkg: DbPackage = { ...pkg, userId: demoUser.id };
    await packageRepository.create(dbPkg);
  }

  // Seed notifications
  for (const notif of mockNotifications) {
    const dbNotif: DbNotification = { ...notif, userId: demoUser.id };
    await notificationRepository.create(dbNotif);
  }

  console.log('Database seeded successfully!');
  console.log(`  - 1 user (email: demo@pickpick.app, password: demo123)`);
  console.log(`  - ${mockPackages.length} packages`);
  console.log(`  - ${mockNotifications.length} notifications`);
}

// Run if called directly
seed().catch(console.error);
