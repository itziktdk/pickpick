import { NextRequest, NextResponse } from 'next/server';
import { getNotificationsRepo } from '@/lib/db';
import { Notification } from '@/models/notification';
import { v4 as uuid } from 'uuid';

// POST - שליחת התראה (כולל הצעת שליחות לחברים)
export async function POST(req: NextRequest) {
  try {
    const { userId, type, title, body, data } = await req.json();

    if (!userId || !type || !title || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const notificationsRepo = await getNotificationsRepo();
    const notification: Notification = {
      id: uuid(),
      userId,
      type,
      title,
      body,
      read: false,
      data: data || {},
      createdAt: new Date().toISOString(),
    };

    await notificationsRepo.create(notification);

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - התראות של המשתמש
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const unreadOnly = req.nextUrl.searchParams.get('unread') === 'true';

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const notificationsRepo = await getNotificationsRepo();
    let notifications = await notificationsRepo.findBy(n => n.userId === userId);

    if (unreadOnly) {
      notifications = notifications.filter(n => !n.read);
    }

    // מיון לפי תאריך יצירה (חדש ראשון)
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - סימון כנקרא
export async function PATCH(req: NextRequest) {
  try {
    const { notificationIds } = await req.json();

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json({ error: 'notificationIds array required' }, { status: 400 });
    }

    const notificationsRepo = await getNotificationsRepo();
    const updated = await Promise.all(
      notificationIds.map(id => notificationsRepo.update(id, { read: true }))
    );

    return NextResponse.json({ updated: updated.filter(Boolean).length });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
