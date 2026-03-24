import { NextRequest, NextResponse } from 'next/server';
import { userRepository } from '@/lib/db/repositories/user-repository';
import { signToken, hashPassword } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'כל השדות נדרשים' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'כתובת אימייל לא תקינה' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'הסיסמה חייבת להכיל לפחות 6 תווים' }, { status: 400 });
    }

    const existing = await userRepository.findBy(u => u.email === email);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'כתובת האימייל כבר רשומה' }, { status: 409 });
    }

    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash: hashPassword(password),
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      gmailConnected: false,
    };

    await userRepository.create(user);

    const token = await signToken({ userId: user.id, email: user.email, name: user.name });

    return NextResponse.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'שגיאה בהרשמה' }, { status: 500 });
  }
}
