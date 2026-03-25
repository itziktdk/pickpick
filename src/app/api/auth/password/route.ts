import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, hashPassword, verifyPassword } from '@/lib/auth';
import { userRepository } from '@/lib/db/repositories/user-repository';

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'כל השדות נדרשים' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'הסיסמה חייבת להכיל לפחות 6 תווים' }, { status: 400 });
    }

    const user = await userRepository.findById(auth.userId);
    if (!user) {
      return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
    }

    if (!verifyPassword(currentPassword, user.passwordHash)) {
      return NextResponse.json({ error: 'הסיסמה הנוכחית שגויה' }, { status: 401 });
    }

    await userRepository.update(auth.userId, {
      passwordHash: hashPassword(newPassword),
    });

    return NextResponse.json({ message: 'הסיסמה שונתה בהצלחה' });
  } catch {
    return NextResponse.json({ error: 'שגיאה בשינוי הסיסמה' }, { status: 500 });
  }
}
