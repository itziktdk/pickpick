import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { userRepository } from '@/lib/db/repositories/user-repository';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const users = await userRepository.findAll();
  const safeUsers = users.map(({ passwordHash, ...u }) => u);
  return NextResponse.json({ users: safeUsers });
}
