import { NextRequest, NextResponse } from 'next/server';
import { userRepository } from '@/lib/db/repositories/user-repository';
import { signToken, verifyPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'אימייל וסיסמה נדרשים' }, { status: 400 });
    }

    const users = await userRepository.findBy(u => u.email === email);
    if (users.length === 0) {
      return NextResponse.json({ error: 'אימייל או סיסמה שגויים' }, { status: 401 });
    }

    const user = users[0];
    if (!verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: 'אימייל או סיסמה שגויים' }, { status: 401 });
    }

    await userRepository.update(user.id, { lastActive: new Date().toISOString() });

    const token = await signToken({ userId: user.id, email: user.email, name: user.name });

    return NextResponse.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    return NextResponse.json({ error: 'שגיאה בהתחברות' }, { status: 500 });
  }
}
