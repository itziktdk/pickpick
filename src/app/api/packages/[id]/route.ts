import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { packageRepository } from '@/lib/db/repositories/package-repository';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const pkg = await packageRepository.findById(params.id);
  if (!pkg || pkg.userId !== auth.userId) {
    return NextResponse.json({ error: 'חבילה לא נמצאה' }, { status: 404 });
  }
  return NextResponse.json({ package: pkg });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const pkg = await packageRepository.findById(params.id);
  if (!pkg || pkg.userId !== auth.userId) {
    return NextResponse.json({ error: 'חבילה לא נמצאה' }, { status: 404 });
  }

  const updates = await req.json();
  if (updates.status) {
    updates.statusHistory = [...pkg.statusHistory, { status: updates.status, date: new Date().toISOString(), note: updates.note }];
    delete updates.note;
  }

  const updated = await packageRepository.update(params.id, updates);
  return NextResponse.json({ package: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const pkg = await packageRepository.findById(params.id);
  if (!pkg || pkg.userId !== auth.userId) {
    return NextResponse.json({ error: 'חבילה לא נמצאה' }, { status: 404 });
  }

  await packageRepository.delete(params.id);
  return NextResponse.json({ success: true });
}
