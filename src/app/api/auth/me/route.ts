import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { userRepository } from '@/lib/db/repositories/user-repository';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  const user = await userRepository.findById(auth.userId);
  if (!user) {
    return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
  }

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, phone: (user as any).phone, address: (user as any).address, joinDate: user.joinDate, gmailConnected: user.gmailConnected },
  });
}
