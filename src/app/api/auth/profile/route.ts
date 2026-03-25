import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { userRepository } from '@/lib/db/repositories/user-repository';

export async function PATCH(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const allowedFields = ['name', 'phone', 'address'];
    const updates: Record<string, string> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'אין שדות לעדכון' }, { status: 400 });
    }

    const user = await userRepository.update(auth.userId, updates);
    if (!user) {
      return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
    }

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, phone: (user as any).phone, address: (user as any).address },
    });
  } catch {
    return NextResponse.json({ error: 'שגיאה בעדכון הפרופיל' }, { status: 500 });
  }
}
