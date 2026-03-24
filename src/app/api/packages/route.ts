import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { packageRepository } from '@/lib/db/repositories/package-repository';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  const packages = await packageRepository.findBy(p => p.userId === auth.userId);
  return NextResponse.json({ packages });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const pkg = {
      ...body,
      id: crypto.randomUUID(),
      userId: auth.userId,
      statusHistory: [{ status: body.status || 'new', date: new Date().toISOString(), note: 'נוסף ידנית' }],
    };

    await packageRepository.create(pkg);
    return NextResponse.json({ package: pkg }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'שגיאה ביצירת חבילה' }, { status: 500 });
  }
}
